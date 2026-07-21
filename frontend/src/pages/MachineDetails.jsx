import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  ArrowLeft, 
  Cpu, 
  Settings, 
  Calendar, 
  User, 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

const MachineDetails = () => {
  const { id } = useParams();
  
  const [machine, setMachine] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMachineDetailsAndHistory = async () => {
      try {
        const [machineRes, historyRes] = await Promise.all([
          api.get(`/machines/${id}`),
          api.get(`/maintenance/machine/${id}`)
        ]);
        setMachine(machineRes.data);
        setHistory(historyRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load machine details');
      } finally {
        setLoading(false);
      }
    };
    fetchMachineDetailsAndHistory();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[65vh]">
        <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !machine) {
    return (
      <div className="space-y-4">
        <Link to="/machines" className="text-sm font-semibold text-gray-400 hover:text-white flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to directory</span>
        </Link>
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
          {error || 'Machine details not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header / Back Navigation */}
      <div className="flex items-center justify-between">
        <Link 
          to="/machines" 
          className="text-xs font-semibold text-gray-400 hover:text-white flex items-center space-x-1.5 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Directory</span>
        </Link>
        
        <span className={`
          px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
          ${machine.status === 'RUNNING' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
          ${machine.status === 'DOWN' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse-soft' : ''}
          ${machine.status === 'UNDER_MAINTENANCE' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : ''}
        `}>
          {machine.status.replace('_', ' ')}
        </span>
      </div>

      {/* Title */}
      <div className="flex items-center space-x-4">
        <div className="p-4 bg-indigo-600/10 rounded-2xl border border-indigo-500/20 text-indigo-400">
          <Cpu className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{machine.machineName}</h1>
          <p className="text-sm text-gray-500 mt-0.5">Asset Code: {machine.machineCode}</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Machine Details Card */}
        <div className="glass-panel rounded-2xl border border-gray-800 p-6 space-y-6 h-fit lg:col-span-1">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Activity className="h-4.5 w-4.5 text-indigo-400" />
            <span>Specifications</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex justify-between py-2 border-b border-gray-800/40">
              <span className="text-gray-400">Manufacturer</span>
              <strong className="text-white">{machine.manufacturer}</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800/40">
              <span className="text-gray-400">Department</span>
              <strong className="text-white">{machine.department}</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800/40">
              <span className="text-gray-400">Location</span>
              <strong className="text-white">{machine.location}</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800/40">
              <span className="text-gray-400">Installation Date</span>
              <strong className="text-white">{machine.installationDate}</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800/40">
              <span className="text-gray-400">Runtime Hours</span>
              <strong className="text-white">{machine.runtimeHours} hrs</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800/40">
            <div className="bg-dark-700/20 border border-gray-800 p-4 rounded-xl text-center">
              <span className="block text-[10px] text-gray-500 uppercase font-semibold">Last Service</span>
              <span className="text-xs text-white font-bold block mt-1">
                {machine.lastMaintenanceDate || 'None'}
              </span>
            </div>
            <div className="bg-dark-700/20 border border-gray-800 p-4 rounded-xl text-center">
              <span className="block text-[10px] text-gray-500 uppercase font-semibold">Next Service</span>
              <span className="text-xs text-indigo-400 font-bold block mt-1">
                {machine.nextMaintenanceDate || 'Not Set'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Maintenance History Timeline */}
        <div className="glass-panel rounded-2xl border border-gray-800 p-6 lg:col-span-2 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Settings className="h-4.5 w-4.5 text-indigo-400" />
            <span>Maintenance Timeline & History</span>
          </h3>

          <div className="relative border-l border-gray-800 pl-6 ml-3 space-y-8">
            {history.length === 0 ? (
              <div className="text-xs text-gray-500 py-4 pl-2">
                No maintenance history recorded for this machinery.
              </div>
            ) : (
              history.map((record) => {
                const isCompleted = record.status === 'COMPLETED';
                const isInProgress = record.status === 'IN_PROGRESS';
                
                return (
                  <div key={record.id} className="relative">
                    
                    {/* Timeline Dot */}
                    <span className={`
                      absolute -left-[35px] top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full ring-4 ring-dark-900
                      ${isCompleted ? 'bg-emerald-500 text-white' : ''}
                      ${isInProgress ? 'bg-amber-500 text-white animate-pulse' : ''}
                      ${record.status === 'PENDING' ? 'bg-indigo-600 text-white' : ''}
                    `}>
                      {isCompleted && <CheckCircle2 className="h-3 w-3" />}
                      {isInProgress && <Clock className="h-3 w-3" />}
                      {!isCompleted && !isInProgress && <Calendar className="h-3 w-3" />}
                    </span>

                    {/* Timeline Card */}
                    <div className="bg-dark-700/20 border border-gray-800 p-4 rounded-2xl space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                        <div>
                          <h4 className="text-sm font-bold text-white">{record.maintenanceType}</h4>
                          <span className="text-[10px] text-gray-400 font-medium">Scheduled: {record.scheduledDate}</span>
                          {record.completedDate && (
                            <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">Completed: {record.completedDate}</span>
                          )}
                        </div>

                        <span className={`
                          self-start px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                          ${isCompleted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
                          ${isInProgress ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : ''}
                          ${record.status === 'PENDING' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : ''}
                        `}>
                          {record.status.replace('_', ' ')}
                        </span>
                      </div>

                      <p className="text-xs text-gray-300 leading-normal">{record.description}</p>

                      <div className="flex items-center space-x-2 text-[10px] text-gray-400 border-t border-gray-800/40 pt-2">
                        <User className="h-3.5 w-3.5 text-gray-500" />
                        <span>Engineer: <strong className="text-gray-300">{record.engineerName}</strong></span>
                      </div>

                      {record.remarks && (
                        <div className="p-2.5 bg-dark-900/50 border border-gray-800/30 rounded-lg text-xs text-gray-400 italic">
                          <strong>Remarks:</strong> "{record.remarks}"
                        </div>
                      )}
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

export default MachineDetails;
