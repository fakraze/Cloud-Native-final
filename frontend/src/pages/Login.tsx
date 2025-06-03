import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useLogin } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const loginMutation = useLogin();
  if (isAuthenticated) {
    // Redirect based on user role
    if (user?.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user?.role === 'staff') {
      return <Navigate to="/staff" replace />;
    } else {
      return <Navigate to="/restaurant" replace />;
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-indigo-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/30 to-pink-600/30 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-blue-400/60 rounded-full animate-bounce animation-delay-500"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-indigo-400/60 rounded-full animate-bounce animation-delay-1500"></div>
        <div className="absolute bottom-1/3 left-1/5 w-2 h-2 bg-purple-400/60 rounded-full animate-bounce animation-delay-3000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-pink-400/60 rounded-full animate-bounce animation-delay-2500"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-10 right-10 w-12 h-12 border-2 border-blue-300/30 rotate-45 animate-spin" style={{animationDuration: '20s'}}></div>
        <div className="absolute bottom-10 left-10 w-8 h-8 border-2 border-purple-300/30 rotate-12 animate-spin" style={{animationDuration: '15s'}}></div>
      </div>      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          {/* Enhanced logo container with better animations */}
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl mb-8 transform hover:scale-110 transition-all duration-500 hover:rotate-3 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Mail className="h-10 w-10 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/50 to-transparent animate-pulse"></div>
          </div>
          
          {/* Enhanced title with better typography */}
          <h2 className="text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-4 tracking-tight">
            Welcome Back
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-4"></div>
          <p className="text-xl text-gray-600 font-medium mb-2">
            Restaurant Ordering System
          </p>
          <p className="text-sm text-gray-500 italic">
            Sign in to continue your culinary journey
          </p>          {import.meta.env.VITE_USE_MOCK_API === 'true' && (
            <div className="mt-8 glass-card p-6 border border-blue-200/50 hover:border-blue-300/70 transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-3 animate-pulse"></div>
                <p className="text-sm text-blue-800 font-bold flex items-center">
                  🧪 Demo Mode - Test Credentials
                  <span className="ml-2 inline-block w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                </p>
              </div>
              <div className="text-sm text-blue-700 space-y-3">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200/50 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center mb-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <strong className="text-blue-800">Employee Access</strong>
                  </div>
                  <p className="font-mono text-xs">employee@test.com / password123</p>
                </div>                <div className="bg-gradient-to-r from-indigo-50 to-purple-100 rounded-xl p-3 border border-indigo-200/50 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center mb-1">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                    <strong className="text-indigo-800">Admin Access</strong>
                  </div>
                  <p className="font-mono text-xs">admin@test.com / password123</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-100 rounded-xl p-3 border border-purple-200/50 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center mb-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    <strong className="text-purple-800">Staff Access</strong>
                  </div>
                  <p className="font-mono text-xs">staff@test.com / password123</p>
                </div>
              </div>
            </div>
          )}
        </div>        <form className="glass-card p-8 space-y-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="group">
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-3 group-focus-within:text-blue-600 transition-colors duration-200">
                Email address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-all duration-300 group-focus-within:scale-110" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-12 text-gray-900 placeholder-gray-500 hover:border-blue-300 focus:scale-105 transition-all duration-300"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div className="group">
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-3 group-focus-within:text-blue-600 transition-colors duration-200">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-all duration-300 group-focus-within:scale-110" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-12 pr-12 text-gray-900 placeholder-gray-500 hover:border-blue-300 focus:scale-105 transition-all duration-300"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-xl transition-all duration-200 hover:scale-110"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                  )}
                </button>
              </div>
            </div>
          </div>          {loginMutation.error && (
            <div className="bg-gradient-to-r from-red-50 via-rose-50 to-red-50 border-2 border-red-200 rounded-xl p-4 transform animate-pulse hover:scale-105 transition-all duration-300">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-bounce"></div>
                <p className="text-sm text-red-700 font-medium flex items-center">
                  <span className="mr-2">❌</span>
                  Login failed. Please check your credentials and try again.
                </p>
              </div>
              <div className="mt-2 h-1 bg-gradient-to-r from-red-300 to-rose-300 rounded-full animate-pulse"></div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className={`w-full btn-primary relative overflow-hidden group ${
                loginMutation.isPending ? 'opacity-75 cursor-not-allowed transform-none shadow-lg' : 'hover:shadow-2xl hover:scale-105'
              }`}
            >
              {/* Button shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {loginMutation.isPending && (
                <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <span className={`relative z-10 flex items-center justify-center font-bold text-lg ${loginMutation.isPending ? 'opacity-50' : ''}`}>
                {loginMutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </>
                )}
              </span>            </button>
          </div>
          
          {/* Additional login options or forgot password could go here */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-500">
              Secure login powered by{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-semibold">
                Cloud Native Architecture
              </span>
            </p>
          </div>
        </form>
        
        {/* Footer with subtle branding */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
            <span>Crafted with ❤️ for food lovers</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Login };
