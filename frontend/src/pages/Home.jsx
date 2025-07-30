import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Signsvg from '../assets/Signsvg';
import HomeNavbar from '../components/HomeNavbar';
import { 
  FaShoppingBag, 
  FaChartLine, 
  FaUsers, 
  FaFileInvoice, 
  FaShoppingCart, 
  FaUserTie, 
  FaReceipt,
  FaStore,
  FaPlus,
  FaList,
  FaArrowRight,
  FaRocket,
  FaShieldAlt,
  FaChartBar,
  FaCog,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane
} from 'react-icons/fa';

function Home() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitStatus('success');
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 2000);
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const features = [
    {
      icon: <FaShoppingBag className="text-3xl" />,
      title: "Inventory Management",
      description: "Manage your products, track stock levels, and maintain inventory efficiently",
      color: "from-blue-500 to-blue-600",
      link: "/dashboard/item/list"
    },
    {
      icon: <FaChartLine className="text-3xl" />,
      title: "Sales Analytics",
      description: "Track sales performance, generate reports, and analyze business metrics",
      color: "from-green-500 to-green-600",
      link: "/dashboard/invoice"
    },
    {
      icon: <FaUsers className="text-3xl" />,
      title: "Customer Management",
      description: "Manage customer relationships, track interactions, and maintain customer data",
      color: "from-purple-500 to-purple-600",
      link: "/dashboard/client"
    },
    {
      icon: <FaUserTie className="text-3xl" />,
      title: "Vendor Management",
      description: "Manage suppliers, track purchases, and maintain vendor relationships",
      color: "from-orange-500 to-orange-600",
      link: "/dashboard/vendor"
    }
  ];

  const quickActions = [
    {
      icon: <FaPlus />,
      title: "Add New Item",
      description: "Create a new product in your inventory",
      link: "/dashboard/item/newitem",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <FaFileInvoice />,
      title: "Create Invoice",
      description: "Generate a new sales invoice",
      link: "/dashboard/invoice/add",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <FaUsers />,
      title: "Add Customer",
      description: "Add a new customer to your database",
      link: "/dashboard/client/add",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <FaUserTie />,
      title: "Add Vendor",
      description: "Add a new vendor or supplier",
      link: "/dashboard/vendor/add",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: <FaReceipt />,
      title: "Create Purchase Bill",
      description: "Generate a new purchase bill",
      link: "/dashboard/purchasebill/add",
      color: "from-red-500 to-red-600"
    },
    {
      icon: <FaShoppingCart />,
      title: "Create Order",
      description: "Create a new sales order",
      link: "/dashboard/Order/add",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const contactInfo = [
    {
      icon: <FaEnvelope />,
      title: "Email",
      value: "support@businesshub.com",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <FaPhone />,
      title: "Phone",
      value: "+1 (555) 123-4567",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Address",
      value: "123 Business Street, Suite 100, City, State 12345",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <FaClock />,
      title: "Business Hours",
      value: "Mon - Fri: 9:00 AM - 6:00 PM",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <HomeNavbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden -pt-10">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-purple-700/10 dark:from-blue-400/5 dark:via-indigo-400/3 dark:to-purple-400/5"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-400/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="text-center">
            {/* Logo and Brand */}
            <div className="mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 dark:bg-slate-800/20 backdrop-blur-sm rounded-2xl p-4 mb-6">
                <Signsvg />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2">BusinessHub</h2>
                <p className="text-slate-600 dark:text-slate-400">Complete Business Management Platform</p>
              </div>
            </div>
            
            {/* Main Hero Content */}
            <div className="mb-12">
              <h1 className="text-5xl md:text-7xl font-bold text-slate-800 dark:text-slate-100 mb-8 leading-tight">
                Transform Your
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Business Today
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-10 max-w-4xl mx-auto leading-relaxed">
                Join thousands of businesses that have streamlined their operations, 
                boosted productivity, and achieved remarkable growth with our comprehensive platform.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              
              <Link 
                to="/about"
                className="group inline-flex items-center px-10 py-5 bg-white/90 backdrop-blur-sm text-slate-700 font-bold text-lg rounded-xl hover:bg-white transition-all duration-300 shadow-xl hover:shadow-2xl border border-slate-200 transform hover:-translate-y-2 hover:scale-105"
              >
                <FaShieldAlt className="mr-3 text-xl group-hover:scale-110 transition-transform duration-300" />
                Learn More
              </Link>
            </div>
            
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">10,000+</div>
                <div className="text-slate-600 dark:text-slate-400 font-medium">Happy Businesses</div>
              </div>
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">50+</div>
                <div className="text-slate-600 dark:text-slate-400 font-medium">Countries Served</div>
              </div>
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">99.9%</div>
                <div className="text-slate-600 dark:text-slate-400 font-medium">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              Powerful Features for Your Business
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Everything you need to manage your business efficiently and grow your operations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link 
                key={index}
                to={feature.link}
                className="group bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-r ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                  <span>Learn More</span>
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              Quick Actions
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Get started quickly with these common tasks
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link 
                key={index}
                to={action.link}
                className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200 dark:border-slate-700"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} text-white mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  {action.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {action.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {action.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white mb-4">
                <FaChartBar className="text-2xl" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">100%</h3>
              <p className="text-slate-600 dark:text-slate-400">Business Efficiency</p>
            </div>
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white mb-4">
                <FaStore className="text-2xl" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">24/7</h3>
              <p className="text-slate-600 dark:text-slate-400">System Availability</p>
            </div>
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white mb-4">
                <FaCog className="text-2xl" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">Easy</h3>
              <p className="text-slate-600 dark:text-slate-400">To Use & Manage</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-6">Send us a Message</h3>
              
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                  Thank you! Your message has been sent successfully. We'll get back to you soon.
                </div>
              )}
              
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleContactChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="What's this about?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-slate-200">
                <h3 className="text-2xl font-semibold text-slate-800 mb-6">Contact Information</h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${info.color} text-white flex-shrink-0`}>
                        {info.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-1">{info.title}</h4>
                        <p className="text-slate-600">{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-8 text-white">
                <h3 className="text-2xl font-semibold mb-4">Need Immediate Help?</h3>
                <p className="text-blue-100 mb-6">
                  Our support team is available 24/7 to assist you with any questions or technical issues.
                </p>
                <div className="flex items-center space-x-2">
                  <FaPhone className="text-blue-200" />
                  <span className="font-semibold">+1 (555) 123-4567</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-12 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-300">
            © 2024 Business Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;