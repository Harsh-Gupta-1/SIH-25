import React, { useState } from 'react';
import { 
  TreePine, LogOut, Database, Globe, BarChart3, Settings, Bell, Home, Archive, ChevronLeft, ChevronRight
} from 'lucide-react';
import Atlas from '../components/Atlas';

const Dashboard = () => {
  // Static user object to replace API call
  const [user] = useState({
    name: 'Test User',
    email: 'test@example.com'
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const sidebarItems = [
    { id: 'home', icon: Home, label: 'Home', active: activeTab === 'home' },
    { id: 'atlas', icon: Globe, label: 'Atlas', active: activeTab === 'atlas' },
    { id: 'archives', icon: Archive, label: 'Archives', active: activeTab === 'archives' }
  ];

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <div className={`bg-white shadow-lg border-r border-gray-200 transition-all duration-300 flex flex-col ${isSidebarCollapsed ? 'w-16' : 'w-64'} h-screen flex-shrink-0`}>
        <div className="p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
              <TreePine className="w-6 h-6 text-white" />
            </div>
            {!isSidebarCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-gray-900">VanDarpan</h1>
                <p className="text-sm text-gray-500">Dashboard</p>
              </div>
            )}
          </div>
        </div>
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
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && (
              <span className="font-medium">Logout</span>
            )}
          </button>
        </div>
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute top-1/2 -right-3 bg-white rounded-full border border-gray-200 p-1 shadow-sm hover:bg-gray-50 transition-all duration-200"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900 capitalize">{activeTab}</h2>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {activeTab === 'home' && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Welcome, {user?.name || 'User'}</h2>
                <p className="text-gray-600">Access your forest resource assessment tools and data.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
          {activeTab === 'atlas' && (
            <Atlas />
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
                <a
                  href="https://odishaforestgis.in/ofms/uploads/fra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Browse Archives
                </a>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;