import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Building, BookOpen, Menu, X, User } from "lucide-react";
import logo from "@/assets/logo.png";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();
  const user = localStorage.getItem("token");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        setUserRole(decodedToken.role);
        setUserId(decodedToken.id);
      } catch (error) {
        console.error("Failed to decode token:", error);
        // Handle token error (e.g., log out user or redirect to login)
      }
    }
  }, []);


  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { title: "Job seekers", path: "/jobseekers", icon: Briefcase },
    { title: "Companies", path: "/companies", icon: Building },
    { title: "Resources", path: "/resources", icon: BookOpen },
  ];

  return (
    <motion.nav
      className="fixed w-full z-50 bg-white shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      style={{
        background: `linear-gradient(to right, rgba(255,255,255,${
          1 - scrollY / 500
        }), rgba(236,72,153,${scrollY / 500}))`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <motion.img
                src={logo}
                alt="ThriveConnect Logo"
                className="h-14 w-15"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              />
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.title}
                to={item.path}
                className="relative text-gray-600 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out overflow-hidden group"
              >
                <motion.div
                  className="flex items-center space-x-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </motion.div>
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-600"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </Link>
            ))}
            {user ? (
              <div className="flex space-x-2">
                {/* Profile Page Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={
                      userRole === "jobseeker"
                        ? `/jobSeeker-profile-page/${userId}`
                        : `/company-profile-page/${userId}`
                    }
                  >
                    <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                      Profile Page
                    </Button>
                  </Link>
                </motion.div>

                {/* Log Out Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => {
                      // Log out logic (e.g., remove token and redirect)
                      localStorage.removeItem("token");
                      navigate("/login");
                    }}
                  >
                    Log Out
                  </Button>
                </motion.div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/login">
                    <Button variant="outline" className="mr-2">
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/signup">
                    <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                      Sign Up
                    </Button>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
              {navItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.path}
                  className="text-gray-600 hover:text-pink-600 hover:bg-pink-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ease-in-out"
                >
                  <motion.div
                    className="flex items-center space-x-2"
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </motion.div>
                </Link>
              ))}
              <div className="mt-4 space-y-2">
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
