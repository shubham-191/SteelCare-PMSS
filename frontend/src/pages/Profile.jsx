import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Phone, CheckSquare } from 'lucide-react';

const Profile = () => {
  const { user, isAdmin } = useAuth();

  const permissions = user?.role === 'ADMIN' 
    ? [
        'Full administrative override across all modules',
        'Add, modify, and delete shopfloor machinery details',
        'Schedule preventive maintenance activities',
        'Assign engineers to pending maintenance tasks',
        'View global analytics and performance trends',
        'Manage and read system alerts'
      ]
    : user?.role === 'EMPLOYEE'
    ? [
        'Schedule preventive maintenance activities',
        'Assign engineers to pending maintenance tasks',
        'View shopfloor machinery details (read-only)',
        'View global analytics and performance trends',
        'Manage and read system alerts'
      ]
    : [
        'View and track assigned maintenance schedule items',
        'Update progress status (Pending, In Progress, Completed)',
        'Submit completion remarks and service log entries',
        'Access machine specifications and history directories',
        'Receive system alerts and updates'
      ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">My Profile</h1>
        <p className="text-sm text-gray-400 mt-1">Manage and view your user profile and security access parameters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="glass-panel border border-gray-800 rounded-3xl p-6 text-center space-y-4 md:col-span-1">
          <div className="h-20 w-20 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-3xl mx-auto">
            {user?.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{user?.name}</h3>
            <span className={`
              inline-block text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider mt-1
              ${user?.role === 'ADMIN' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : ''}
              ${user?.role === 'ENGINEER' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
              ${user?.role === 'EMPLOYEE' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : ''}
            `}>
              {user?.role}
            </span>
          </div>
        </div>

        {/* Profile Details & Permissions */}
        <div className="md:col-span-2 space-y-6">
          {/* Details */}
          <div className="glass-panel border border-gray-800 rounded-3xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-white border-b border-gray-800 pb-3">Account Details</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-center space-x-3 p-3 bg-dark-700/20 rounded-xl border border-gray-800/40">
                <Mail className="h-4.5 w-4.5 text-gray-500" />
                <div>
                  <span className="block text-[9px] text-gray-500 uppercase font-semibold">Email Address</span>
                  <span className="text-gray-200 font-medium">{user?.email}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-dark-700/20 rounded-xl border border-gray-800/40">
                <Phone className="h-4.5 w-4.5 text-gray-500" />
                <div>
                  <span className="block text-[9px] text-gray-500 uppercase font-semibold">Phone Number</span>
                  <span className="text-gray-200 font-medium">{user?.phoneNumber || 'Not Provided'}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-dark-700/20 rounded-xl border border-gray-800/40">
                <Shield className="h-4.5 w-4.5 text-gray-500" />
                <div>
                  <span className="block text-[9px] text-gray-500 uppercase font-semibold">Access Level</span>
                  <span className="text-gray-200 font-medium">
                    {user?.role === 'ADMIN' ? 'Administrator' : user?.role === 'EMPLOYEE' ? 'Scheduler Employee' : 'Field Engineer'}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-dark-700/20 rounded-xl border border-gray-800/40">
                <User className="h-4.5 w-4.5 text-gray-500" />
                <div>
                  <span className="block text-[9px] text-gray-500 uppercase font-semibold">Unique Employee ID</span>
                  <span className="text-gray-200 font-medium">EMP-{1000 + user?.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Permissions Checklist */}
          <div className="glass-panel border border-gray-800 rounded-3xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-white border-b border-gray-800 pb-3">Authorized Scope</h4>
            <ul className="space-y-3">
              {permissions.map((perm, idx) => (
                <li key={idx} className="flex items-start space-x-2.5 text-xs text-gray-300">
                  <CheckSquare className="h-4.5 w-4.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span>{perm}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
