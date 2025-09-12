import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  MapPin, 
  Database, 
  Eye, 
  EyeOff,
  Brain, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Satellite,
  TreePine,
  Globe,
  BarChart3,
  Shield,
  Zap,
  AlertCircle
} from 'lucide-react';

// Configure axios defaults
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_BASE_URL;

const FRAAtlasLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '' });
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in and log them out immediately on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Perform logout
      localStorage.removeItem('authToken');
      delete axios.defaults.headers.common['Authorization'];
    }
    setIsAuthChecked(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoginLoading(true);
    setLoginError('');

    try {
      const response = await axios.post('/api/auth/login', {
        email: loginForm.email.trim(),
        password: loginForm.password
      });

      if (response.data.success) {
        const { token } = response.data.data;
        
        // Store token in localStorage
        localStorage.setItem('authToken', token);
        
        // Set default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Close modal and reset form
        setIsLoginOpen(false);
        setLoginForm({ email: '', password: '' });
        
        // Navigate to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      setLoginError(errorMessage);
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsSignupLoading(true);
    setSignupError('');

    // Basic client-side validation
    if (signupForm.password.length < 6) {
      setSignupError('Password must be at least 6 characters long');
      setIsSignupLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/auth/signup', {
        name: signupForm.name.trim(),
        email: signupForm.email.trim(),
        password: signupForm.password
      });

      if (response.data.success) {
        const { token } = response.data.data;
        
        // Store token in localStorage
        localStorage.setItem('authToken', token);
        
        // Set default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Close modal and reset form
        setIsSignupOpen(false);
        setSignupForm({ name: '', email: '', password: '' });
        
        // Navigate to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
      setSignupError(errorMessage);
    } finally {
      setIsSignupLoading(false);
    }
  };

  const features = [
    {
      icon: <Database className="w-8 h-8 text-amber-600" />,
      title: "Legacy Data Digitization",
      description: "AI-powered extraction and standardization of scattered FRA documents using OCR and NER technologies."
    },
    {
      icon: <Satellite className="w-8 h-8 text-blue-600" />,
      title: "AI-Based Asset Mapping",
      description: "Computer vision and ML models to map agricultural land, forest cover, water bodies, and homesteads from satellite imagery."
    },
    {
      icon: <Globe className="w-8 h-8 text-teal-600" />,
      title: "Interactive WebGIS Portal",
      description: "Comprehensive spatial visualization with layered information including village boundaries, land-use, and FRA progress tracking."
    },
    {
      icon: <Brain className="w-8 h-8 text-emerald-600" />,
      title: "Decision Support System",
      description: "AI-enhanced DSS engine for cross-linking FRA holders with CSS schemes and prioritizing targeted interventions."
    },
    {
      icon: <Shield className="w-8 h-8 text-green-700" />,
      title: "Real-time Monitoring",
      description: "Satellite-based monitoring of CFR forests with integration of ground truth data and IoT sensors."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-yellow-600" />,
      title: "Analytics & Reporting",
      description: "Comprehensive analytics dashboard for policy makers with state, district, and village-level insights."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Data Collection & Digitization",
      description: "Upload and process legacy FRA documents using AI-powered OCR and data extraction."
    },
    {
      number: "02",
      title: "Satellite Analysis & Mapping",
      description: "Analyze high-resolution satellite imagery to map assets and land-use patterns."
    },
    {
      number: "03",
      title: "Integration & Visualization",
      description: "Integrate processed data into interactive WebGIS platform with multiple layers."
    },
    {
      number: "04",
      title: "Decision Support & Optimization",
      description: "Generate recommendations for scheme layering and targeted development interventions."
    }
  ];

  // Show loading while checking auth status
  if (!isAuthChecked) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <TreePine className="w-6 h-6 text-white" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                <TreePine className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">VanDarpan</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-teal-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-emerald-600 transition-colors">How It Works</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#contact" className="text-gray-600 hover:text-amber-600 transition-colors">Contact</a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
              >
                Login
              </button>
              <button 
                onClick={() => setIsSignupOpen(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-600 hover:text-green-600 transition-colors">Features</a>
                <a href="#how-it-works" className="text-gray-600 hover:text-green-600 transition-colors">How It Works</a>
                <a href="#about" className="text-gray-600 hover:text-green-600 transition-colors">About</a>
                <a href="#contact" className="text-gray-600 hover:text-green-600 transition-colors">Contact</a>
                <div className="flex space-x-4 pt-4">
                  <button 
                    onClick={() => setIsLoginOpen(true)}
                    className="text-green-600 hover:text-green-700 font-medium transition-colors"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => setIsSignupOpen(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 via-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Digital Forest Rights
                  <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent block">Atlas & DSS</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Revolutionizing forest rights management through AI-powered digitization, satellite mapping, and intelligent decision support for tribal communities and policy makers.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setIsSignupOpen(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Get Started Free
                </button>
                <button className="border-2 border-teal-600 text-teal-700 hover:bg-teal-600 hover:text-white px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300">
                  View Demo
                </button>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600 font-medium">AI-Powered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600 font-medium">Real-time Sync</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600 font-medium">Secure & Private</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="transform hover:scale-105 transition-transform duration-500">
                <img 
                  src="/Landing.png" 
                  alt="FRA Atlas Platform Visualization" 
                  className="w-full h-auto rounded-2xl shadow-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive suite of AI-powered tools for forest rights management, satellite mapping, and decision support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-8 hover:shadow-xl transition-all duration-300 hover:bg-gradient-to-br hover:from-white hover:to-green-50/50 group border border-green-100/50">
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-blue-50 via-teal-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, streamlined process from data collection to intelligent recommendations.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const gradients = [
                'from-amber-600 to-yellow-600',
                'from-blue-600 to-cyan-600', 
                'from-teal-600 to-emerald-600',
                'from-green-600 to-lime-600'
              ];
              return (
                <div key={index} className="relative">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-white/50">
                    <div className={`w-16 h-16 bg-gradient-to-br ${gradients[index]} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                      <span className="text-2xl font-bold text-white">{step.number}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="w-8 h-8 text-teal-600" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                  <TreePine className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">FRA Atlas</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Empowering forest rights management through AI and satellite technology for sustainable tribal development.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Product</h3>
              <div className="space-y-3">
                <a href="#" className="text-gray-400 hover:text-white transition-colors block">Features</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors block">Pricing</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors block">Documentation</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors block">API Reference</a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Support</h3>
              <div className="space-y-3">
                <a href="#" className="text-gray-400 hover:text-white transition-colors block">Help Center</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors block">Training</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors block">Community</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors block">Contact Us</a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Partners</h3>
              <div className="space-y-3">
                <a href="#" className="text-gray-400 hover:text-white transition-colors block">Ministry of Tribal Affairs</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors block">Forest Departments</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors block">NGO Partners</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors block">Research Institutes</a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">&copy; 2025 FRA Atlas. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsLoginOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 z-10">
            <button
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
                <TreePine className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your FRA Atlas account</p>
            </div>

            {loginError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-red-700 text-sm">{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Enter your email"
                  disabled={isLoginLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors pr-12"
                    placeholder="Enter your password"
                    disabled={isLoginLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoginLoading}
                  >
                    {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500" 
                    disabled={isLoginLoading}
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-green-600 hover:text-green-700">Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={isLoginLoading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
              >
                {isLoginLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setIsLoginOpen(false);
                    setIsSignupOpen(true);
                    setLoginError('');
                  }}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {isSignupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSignupOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 z-10">
            <button
              onClick={() => setIsSignupOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
                <TreePine className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600">Join FRA Atlas and get started</p>
            </div>

            {signupError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-red-700 text-sm">{signupError}</span>
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={signupForm.name}
                  onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Enter your full name"
                  disabled={isSignupLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Enter your email"
                  disabled={isSignupLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showSignupPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors pr-12"
                    placeholder="Create a password (min 6 characters)"
                    disabled={isSignupLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isSignupLoading}
                  >
                    {showSignupPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSignupLoading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
              >
                {isSignupLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setIsSignupOpen(false);
                    setIsLoginOpen(true);
                    setSignupError('');
                  }}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FRAAtlasLanding;