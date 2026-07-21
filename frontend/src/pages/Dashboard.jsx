import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Cpu, 
  Settings, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  ArrowRight
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { Link } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard');
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600/20 rounded-full" />
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
        {error}
      </div>
    );
  }

  const {
    totalMachines,
    runningMachines,
    pendingMaintenance,
    completedMaintenance,
    overdueMaintenance,
    machineStatusDistribution,
    monthlyMaintenanceTrend,
    recentActivities
  } = data;

  // Filter upcoming maintenance tasks from recentActivities (status is PENDING or IN_PROGRESS and scheduledDate is future/today)
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingMaintenanceTasks = recentActivities
    .filter(act => act.status !== 'COMPLETED' && act.scheduledDate >= todayStr)
    .slice(0, 5);

  // Cards Configuration
  const cards = [
    { name: 'Total Machines', value: totalMachines, icon: Cpu, color: 'text-indigo-400', bg: 'bg-indigo-600/10 border-indigo-500/20' },
    { name: 'Running Machines', value: runningMachines, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-600/10 border-emerald-500/20' },
    { name: 'Pending Maintenance', value: pendingMaintenance, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-600/10 border-amber-500/20' },
    { name: 'Completed Tasks', value: completedMaintenance, icon: CheckCircle, color: 'text-sky-400', bg: 'bg-sky-600/10 border-sky-500/20' },
    { name: 'Overdue Warnings', value: overdueMaintenance, icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-600/10 border-rose-500/20 animate-pulse-soft' },
  ];

  // Pie Chart Configuration: Machine Status Distribution
  const pieData = {
    labels: ['Running', 'Down', 'Under Maintenance'],
    datasets: [
      {
        data: [
          machineStatusDistribution?.RUNNING || 0,
          machineStatusDistribution?.DOWN || 0,
          machineStatusDistribution?.UNDER_MAINTENANCE || 0
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.85)', // Emerald
          'rgba(244, 63, 94, 0.85)',  // Rose
          'rgba(245, 158, 11, 0.85)'   // Amber
        ],
        borderColor: [
          '#10B981',
          '#F43F5E',
          '#F59E0B'
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#9CA3AF',
          font: { family: 'Outfit', size: 12 }
        }
      },
      tooltip: {
        backgroundColor: '#1F293D',
        titleFont: { family: 'Outfit' },
        bodyFont: { family: 'Outfit' }
      }
    }
  };

  // Bar Chart Configuration: Monthly Maintenance Trend
  const barData = {
    labels: monthlyMaintenanceTrend?.map(t => t.month) || [],
    datasets: [
      {
        label: 'Completed',
        data: monthlyMaintenanceTrend?.map(t => t.completed) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)', // Blue
        borderColor: '#3B82F6',
        borderRadius: 4,
      },
      {
        label: 'Pending',
        data: monthlyMaintenanceTrend?.map(t => t.pending) || [],
        backgroundColor: 'rgba(245, 158, 11, 0.8)', // Amber
        borderColor: '#F59E0B',
        borderRadius: 4,
      },
      {
        label: 'Overdue',
        data: monthlyMaintenanceTrend?.map(t => t.overdue) || [],
        backgroundColor: 'rgba(239, 68, 68, 0.8)', // Red
        borderColor: '#EF4444',
        borderRadius: 4,
      }
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#9CA3AF', font: { family: 'Outfit', size: 11 } }
      },
      tooltip: {
        backgroundColor: '#1F293D',
        titleFont: { family: 'Outfit' },
        bodyFont: { family: 'Outfit' }
      }
    },
    scales: {
      x: {
        ticks: { color: '#9CA3AF', font: { family: 'Outfit' } },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      },
      y: {
        ticks: { color: '#9CA3AF', font: { family: 'Outfit' }, precision: 0 },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Overview</h1>
        <p className="text-sm text-gray-400 mt-1">Real-time equipment performance and scheduling analytics.</p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className={`glass-panel p-5 rounded-2xl border ${card.bg} flex flex-col justify-between h-32`}>
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{card.name}</span>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <span className="text-3xl font-bold text-white tracking-tight">{card.value}</span>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 lg:col-span-2">
          <h3 className="text-base font-bold text-white mb-4">Maintenance Activities Trend</h3>
          <div className="h-72 relative">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Status Distribution Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-gray-800">
          <h3 className="text-base font-bold text-white mb-4">Machine Status Distribution</h3>
          <div className="h-72 relative">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Upcoming Maintenance */}
        <div className="glass-panel p-6 rounded-2xl border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Calendar className="h-4.5 w-4.5 text-indigo-400" />
              <span>Upcoming Maintenance</span>
            </h3>
            <Link to="/maintenance" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1">
              <span>View all</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400">
                  <th className="pb-3 font-semibold">Machine</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Scheduled</th>
                  <th className="pb-3 font-semibold">Engineer</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/40">
                {upcomingMaintenanceTasks.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-gray-500">
                      No upcoming tasks scheduled
                    </td>
                  </tr>
                ) : (
                  upcomingMaintenanceTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-dark-700/10">
                      <td className="py-3 font-medium text-white">
                        <div>{task.machineName}</div>
                        <span className="text-[10px] text-gray-500">{task.machineCode}</span>
                      </td>
                      <td className="py-3 text-gray-300">{task.maintenanceType}</td>
                      <td className="py-3 text-gray-300">{task.scheduledDate}</td>
                      <td className="py-3 text-gray-300">{task.engineerName}</td>
                      <td className="py-3">
                        <span className={`
                          px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase
                          ${task.status === 'IN_PROGRESS' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}
                        `}>
                          {task.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="glass-panel p-6 rounded-2xl border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Clock className="h-4.5 w-4.5 text-indigo-400" />
              <span>Recent Activities Feed</span>
            </h3>
          </div>
          <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
            {recentActivities.length === 0 ? (
              <div className="py-6 text-center text-xs text-gray-500">
                No recent activity recorded
              </div>
            ) : (
              recentActivities.map((act) => {
                const isCompleted = act.status === 'COMPLETED';
                return (
                  <div key={act.id} className="flex items-start space-x-3 p-3 bg-dark-700/20 rounded-xl border border-gray-800/40">
                    <div className={`
                      p-2 rounded-lg mt-0.5
                      ${isCompleted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}
                    `}>
                      {isCompleted ? <CheckCircle className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-white">
                        {isCompleted 
                          ? `Maintenance Completed for ${act.machineName}`
                          : `Maintenance Scheduled for ${act.machineName}`
                        }
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Type: {act.maintenanceType} | Engineer: {act.engineerName}
                      </p>
                      {act.remarks && (
                        <p className="text-[11px] text-gray-500 italic mt-1 bg-dark-900/50 p-2 rounded-lg border border-gray-800/30">
                          Remarks: "{act.remarks}"
                        </p>
                      )}
                      <p className="text-[9px] text-gray-500 mt-2 font-medium">
                        {isCompleted ? `Completed: ${act.completedDate}` : `Scheduled: ${act.scheduledDate}`}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
