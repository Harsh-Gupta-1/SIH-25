import React, { useState, useEffect } from 'react';
import { 
  TreePine,
  User,
  LogOut,
  Database,
  Globe,
  BarChart3,
  AlertCircle,
  Settings,
  Bell,
  Home,
  Map,
  Archive,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Atlas from '../components/Atlas'; // Import the Atlas component

const Dashboard = () => {
  const [user, setUser] = useState({ name: 'John Doe', email: 'john.doe@example.com' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const sidebarItems = [
    { id: 'home', icon: Home, label: 'Home', active: activeTab === 'home' },
    { id: 'atlas', icon: Globe, label: 'Atlas', active: activeTab === 'atlas' },
    { id: 'archives', icon: Archive, label: 'Archives', active: activeTab === 'archives' }
  ];

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <TreePine className="w-6 h-6 text-white" />
          </div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar - Full Height */}
      <div className={`bg-white shadow-lg border-r border-gray-200 transition-all duration-300 flex flex-col ${isSidebarCollapsed ? 'w-16' : 'w-64'} h-screen flex-shrink-0`}>
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
              <TreePine className="w-6 h-6 text-white" />
            </div>
            {!isSidebarCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-gray-900">FRA Atlas</h1>
                <p className="text-sm text-gray-500">Dashboard</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items - Flexible Growth */}
        <nav className="flex-1 py-6 overflow-y-auto">
          <div className="px-3 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                  item.active 
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-l-4 border-green-600' 
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${item.active ? 'text-green-600' : ''}`} />
                {!isSidebarCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* User Profile Section - Fixed at Bottom */}
        <div className="border-t border-gray-100 p-4 flex-shrink-0">
          {!isSidebarCollapsed ? (
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || 'User'}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {user?.email || 'user@example.com'}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          )}
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 ${
              isSidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isSidebarCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>

        {/* Sidebar Toggle - Fixed at Bottom */}
        <div className="p-3 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full flex items-center justify-center p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content - Full Height */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Conditional Header - Only show for non-Atlas tabs */}
        {activeTab !== 'atlas' && (
          <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex-shrink-0">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {activeTab === 'home' ? `Welcome back, ${user?.name || 'User'}!` : 'Archives'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {activeTab === 'home' ? "Here's what's happening with your FRA Atlas projects today." :
                   'Access historical data and documents'}
                </p>
              </div>

              {/* Notification Bell */}
              <div className="flex items-center">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </header>
        )}

        {/* Main Content Area - Render different components based on active tab */}
        {activeTab === 'atlas' ? (
          // Render Atlas component directly without padding or scrolling restrictions
          <Atlas />
        ) : (
          // Main Content Area - Scrollable for other tabs
          <main className="flex-1 p-6 overflow-auto">
            {activeTab === 'home' && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Projects</p>
                        <p className="text-2xl font-bold text-gray-900">12</p>
                        <p className="text-xs text-green-600 mt-1">+2 this month</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Database className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Maps</p>
                        <p className="text-2xl font-bold text-gray-900">8</p>
                        <p className="text-xs text-green-600 mt-1">3 updated today</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Reports Generated</p>
                        <p className="text-2xl font-bold text-gray-900">24</p>
                        <p className="text-xs text-blue-600 mt-1">5 this week</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Alerts</p>
                        <p className="text-2xl font-bold text-gray-900">3</p>
                        <p className="text-xs text-red-600 mt-1">2 need attention</p>
                      </div>
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Dashboard Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Activity */}
                  <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Database className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">New FRA data uploaded</p>
                          <p className="text-xs text-gray-500">Village mapping project updated • 2 hours ago</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Globe className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">Satellite analysis completed</p>
                          <p className="text-xs text-gray-500">Forest cover assessment finished • 5 hours ago</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                        <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <BarChart3 className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">Monthly report generated</p>
                          <p className="text-xs text-gray-500">Land use analysis report ready • 1 day ago</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
                        <Database className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-gray-900">Upload FRA Data</span>
                      </button>

                      <button 
                        onClick={() => setActiveTab('atlas')}
                        className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left"
                      >
                        <Globe className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-gray-900">View Atlas</span>
                      </button>

                      <button className="w-full flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-gray-900">Generate Report</span>
                      </button>

                      <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
                        <Settings className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">Settings</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'archives' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <Archive className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Document Archives</h3>
                  <p className="text-gray-600 mb-8">
                    Access digitized FRA documents, historical records, and processed data from our comprehensive archive system.
                  </p>
                  <button className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg">
                    Browse Archives
                  </button>
                </div>
              </div>
            )}
          </main>
        )}
      </div>
    </div>
  );
};

export default Dashboard;