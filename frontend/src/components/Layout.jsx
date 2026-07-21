import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  LayoutDashboard, 
  Cpu, 
  Wrench, 
  User, 
  LogOut, 
  Bell, 
  Check, 
  Menu, 
  X 
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications?unreadOnly=true');
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Machines', path: '/machines', icon: Cpu },
    { name: 'Maintenance', path: '/maintenance', icon: Wrench },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 flex flex-col md:flex-row">
      
      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-dark-800 border-b border-gray-800 px-4 py-3 flex justify-between items-center z-20">
        <div className="flex items-center space-x-2">
          <Wrench className="h-6 w-6 text-indigo-500 animate-pulse-soft" />
          <span className="text-xl font-bold tracking-wider text-white">SteelCare</span>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowNotifications(!showNotifications)} 
            className="relative p-1 text-gray-400 hover:text-white"
          >
            <Bell className="h-6 w-6" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-dark-800" />
            )}
          </button>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 text-gray-400 hover:text-white">
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 transition duration-200 ease-in-out
        w-64 bg-dark-800 border-r border-gray-800 flex flex-col justify-between z-30
      `}>
        <div>
          {/* Logo */}
          <div className="hidden md:flex items-center space-x-3 px-6 py-6 border-b border-gray-800">
            <div className="p-2 bg-indigo-600/20 rounded-lg">
              <Wrench className="h-6 w-6 text-indigo-500" />
            </div>
            <span className="text-xl font-bold tracking-wider text-white">SteelCare</span>
          </div>

          {/* Navigation links */}
          <nav className="mt-8 px-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                              (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-xl transition duration-150
                    ${isActive 
                      ? 'bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-600/20' 
                      : 'text-gray-400 hover:bg-dark-700 hover:text-gray-100'}
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3 px-2 py-2 mb-4 bg-dark-900/40 rounded-xl">
            <div className="h-10 w-10 rounded-lg bg-indigo-600/10 flex items-center justify-center border border-indigo-500/20">
              <User className="h-5 w-5 text-indigo-400" />
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <span className={`
                inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase mt-0.5
                ${user?.role === 'ADMIN' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : ''}
                ${user?.role === 'ENGINEER' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
                ${user?.role === 'EMPLOYEE' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : ''}
              `}>
                {user?.role}
              </span>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border border-gray-800 hover:bg-rose-600/10 hover:border-rose-600/20 hover:text-rose-400 transition duration-150 text-gray-400 font-medium"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Desktop Header */}
        <header className="hidden md:flex justify-end items-center px-8 py-4 bg-dark-800 border-b border-gray-800 z-10">
          <div className="flex items-center space-x-6">
            
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)} 
                className="p-2 text-gray-400 hover:text-white bg-dark-700/50 hover:bg-dark-700 rounded-lg border border-gray-800 transition relative"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 block h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-dark-800" />
                )}
              </button>

              {/* Notification Overlay Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-dark-800 border border-gray-800 rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-800 flex justify-between items-center bg-dark-900/40">
                    <span className="font-semibold text-white">System Alerts</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
                      {notifications.length} Unread
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-800">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm text-gray-500">
                        No new notifications
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.id} className="p-4 hover:bg-dark-700/30 flex justify-between items-start space-x-3">
                          <p className="text-xs text-gray-300 leading-normal">{notif.message}</p>
                          <button 
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="p-1 hover:bg-indigo-600/20 rounded text-indigo-400 hover:text-white transition"
                            title="Mark as read"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Brief */}
            <div className="flex items-center space-x-3 pl-6 border-l border-gray-800">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">{user?.name}</p>
                <p className="text-[11px] text-gray-500 uppercase font-semibold">{user?.role}</p>
              </div>
              <div className="h-9 w-9 rounded-lg bg-indigo-600/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400 font-bold">
                {user?.name.charAt(0)}
              </div>
            </div>

          </div>
        </header>

        {/* Mobile Notification Panel Dropdown */}
        {showNotifications && (
          <div className="md:hidden bg-dark-800 border-b border-gray-800 px-4 py-3 max-h-60 overflow-y-auto divide-y divide-gray-800 z-10">
            <div className="py-1 font-semibold text-sm text-white flex justify-between items-center">
              <span>Unread Alerts</span>
              <span className="text-xs text-rose-400 font-bold">{notifications.length}</span>
            </div>
            {notifications.length === 0 ? (
              <div className="py-4 text-center text-xs text-gray-500">No new notifications</div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="py-3 flex justify-between items-start space-x-2">
                  <p className="text-[11px] text-gray-300 leading-normal flex-1">{notif.message}</p>
                  <button 
                    onClick={() => handleMarkAsRead(notif.id)}
                    className="p-1 text-indigo-400 hover:text-white rounded"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
