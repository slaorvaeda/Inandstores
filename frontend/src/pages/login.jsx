import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../assets/AuthContext";
import useRedirectIfAuthenticated from "../hooks/useRedirectIfAuthenticated";
import HomeNavbar from "../components/HomeNavbar";
import SvgLogo from "../assets/SvgLogo";
import { 
  FaEye, 
  FaEyeSlash, 
  FaEnvelope, 
  FaLock, 
  FaUser, 
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaRocket,
  FaShieldAlt,
  FaUsers,
  FaChartLine
} from "react-icons/fa";

const Login = () => {
  useRedirectIfAuthenticated();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  
  // Signup state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupAvatar, setSignupAvatar] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");
  const [isSignupLoading, setIsSignupLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoginLoading(true);
    setLoginError("");
    setLoginSuccess("");

    try {
      const response = await axios.post("http://localhost:4000/login", {
        email: loginEmail,
        password: loginPassword,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user.id);
      
      login();
      setLoginSuccess("Login successful!");
      navigate("/dashboard");
      
    } catch (err) {
      console.error("Error:", err);
      setLoginError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (signupPassword !== signupConfirmPassword) {
      setSignupError("Passwords do not match!");
      return;
    }

    setIsSignupLoading(true);
    setSignupError("");
    setSignupSuccess("");

    try {
      const response = await axios.post("http://localhost:4000/signup", {
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        avatar: signupAvatar,
      });
      setSignupSuccess("Signup successful! Please log in.");
      // Clear form
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
      setSignupConfirmPassword("");
      setSignupAvatar("");
    } catch (err) {
      console.error("Error:", err);
      setSignupError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setIsSignupLoading(false);
    }
  };

  const features = [
    {
      icon: <FaRocket />,
      title: "Get Started Fast",
      description: "Quick setup and intuitive interface"
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security for your data"
    },
    {
      icon: <FaUsers />,
      title: "Team Collaboration",
      description: "Work together seamlessly"
    },
    {
      icon: <FaChartLine />,
      title: "Analytics & Insights",
      description: "Powerful reporting and analytics"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <HomeNavbar />
      
      <div className="flex items-center justify-center min-h-screen pt-20">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="grid lg:grid-cols-2">
              
              {/* Left Side - Hero Section */}
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 lg:p-12 text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-black/5"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
                
                <div className="relative z-10">
                  {/* Logo and Brand */}
                  <div className="flex items-center mb-12">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                      <SvgLogo />
                    </div>
                    <div className="ml-4">
                      <h1 className="text-2xl font-bold">BusinessHub</h1>
                      <p className="text-blue-200 text-sm">Business Management Platform</p>
                    </div>
                  </div>
                  
                  {/* Main Hero Content */}
                  <div className="mb-12">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                      Transform Your
                      <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                        Business Today
                      </span>
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                      Join thousands of businesses that have streamlined their operations, 
                      boosted productivity, and achieved remarkable growth with our comprehensive platform.
                    </p>
                  </div>
                  
                  {/* Features Grid */}
                  <div className="grid grid-cols-1 gap-6 mb-12">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-4 group hover:bg-white/10 p-4 rounded-xl transition-all duration-300">
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-white/25 to-white/15 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-2 group-hover:text-yellow-300 transition-colors duration-300">
                            {feature.title}
                          </h3>
                          <p className="text-blue-200 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Stats Card */}
                  <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="grid grid-cols-2 gap-6 text-center">
                      <div>
                        <div className="text-3xl font-bold mb-1">10,000+</div>
                        <div className="text-blue-200 text-sm">Happy Businesses</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold mb-1">50+</div>
                        <div className="text-blue-200 text-sm">Countries Served</div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/20 text-center">
                      <p className="text-blue-200 text-sm">
                        Trusted by businesses worldwide for reliable management solutions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Side - Forms */}
              <div className="p-8 lg:p-12">
                {/* Toggle Buttons */}
                <div className="flex mb-10 bg-slate-100 dark:bg-slate-800 rounded-xl p-1.5 shadow-inner">
                  <button
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-4 px-8 rounded-lg font-semibold transition-all duration-300 ${
                      isLogin 
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-lg transform scale-105' 
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-4 px-8 rounded-lg font-semibold transition-all duration-300 ${
                      !isLogin 
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-lg transform scale-105' 
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
                
                {/* Login Form */}
                {isLogin && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-3">Welcome Back</h2>
                      <p className="text-slate-600 dark:text-slate-400 text-lg">Sign in to your account to continue your journey</p>
                    </div>
                    
                    {loginError && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg flex items-center">
                        <FaExclamationCircle className="mr-2" />
                        {loginError}
                      </div>
                    )}
                    
                    {loginSuccess && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg flex items-center">
                        <FaCheckCircle className="mr-2" />
                        {loginSuccess}
                      </div>
                    )}
                    
                    <form onSubmit={handleLoginSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                          </div>
                          <input
                            type="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                          </div>
                          <input
                            type={showPassword ? "text" : "password"}
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                            className="w-full pl-10 pr-12 py-3 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
                            placeholder="Enter your password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPassword ? (
                              <FaEyeSlash className="h-5 w-5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400" />
                            ) : (
                              <FaEye className="h-5 w-5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isLoginLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        {isLoginLoading ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            <span>Signing In...</span>
                          </>
                        ) : (
                          <span>Sign In</span>
                        )}
                      </button>
                    </form>
                  </div>
                )}
                
                {/* Signup Form */}
                {!isLogin && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-3">Create Account</h2>
                      <p className="text-slate-600 dark:text-slate-400 text-lg">Join thousands of businesses using our platform</p>
                    </div>
                    
                    {signupError && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg flex items-center">
                        <FaExclamationCircle className="mr-2" />
                        {signupError}
                      </div>
                    )}
                    
                    {signupSuccess && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg flex items-center">
                        <FaCheckCircle className="mr-2" />
                        {signupSuccess}
                      </div>
                    )}
                    
                    <form onSubmit={handleSignupSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaUser className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                          </div>
                          <input
                            type="text"
                            value={signupName}
                            onChange={(e) => setSignupName(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                          </div>
                          <input
                            type="email"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                          </div>
                          <input
                            type={showPassword ? "text" : "password"}
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            required
                            className="w-full pl-10 pr-12 py-3 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
                            placeholder="Create a password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPassword ? (
                              <FaEyeSlash className="h-5 w-5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400" />
                            ) : (
                              <FaEye className="h-5 w-5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                          </div>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={signupConfirmPassword}
                            onChange={(e) => setSignupConfirmPassword(e.target.value)}
                            required
                            className="w-full pl-10 pr-12 py-3 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
                            placeholder="Confirm your password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showConfirmPassword ? (
                              <FaEyeSlash className="h-5 w-5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400" />
                            ) : (
                              <FaEye className="h-5 w-5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2  dark:text-slate-500">
                          Avatar URL (Optional)
                        </label>
                        <input
                          type="url"
                          value={signupAvatar}
                          onChange={(e) => setSignupAvatar(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:placeholder-slate-400"
                          placeholder="https://example.com/avatar.jpg"
                        />
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isSignupLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        {isSignupLoading ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            <span>Creating Account...</span>
                          </>
                        ) : (
                          <span>Create Account</span>
                        )}
                      </button>
                    </form>
                  </div>
                )}
                
                {/* Footer */}
                <div className="mt-8 text-center">
                  <p className="text-sm text-slate-600">
                    By continuing, you agree to our{" "}
                    <Link to="/terms" className="text-blue-600 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
