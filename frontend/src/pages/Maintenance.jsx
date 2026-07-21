import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Calendar, 
  User, 
  Cpu, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle,
  FileText,
  AlertCircle
} from 'lucide-react';

const Maintenance = () => {
  const { user, isAdmin, isEngineer, isEmployee } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [machines, setMachines] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Views toggle
  const [overdueOnly, setOverdueOnly] = useState(false);

  // Modals state
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  // Engineer update modal
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    machineId: '',
    engineerId: '',
    maintenanceType: '',
    description: '',
    scheduledDate: '',
    status: 'PENDING',
    remarks: ''
  });
  const [formError, setFormError] = useState('');

  const fetchTasks = async (overdue = false) => {
    try {
      const url = overdue ? '/maintenance/overdue' : '/maintenance';
      const response = await api.get(url);
      setTasks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load maintenance tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    if (!isAdmin() && !isEmployee()) return;
    try {
      const [machinesRes, engineersRes] = await Promise.all([
        api.get('/machines'),
        api.get('/auth/engineers')
      ]);
      setMachines(machinesRes.data);
      setEngineers(engineersRes.data);
    } catch (err) {
      console.error('Failed to load dropdown directories', err);
    }
  };

  useEffect(() => {
    fetchTasks(overdueOnly);
    fetchDropdownData();
  }, [overdueOnly]);

  const handleOverdueToggle = (e) => {
    const checked = e.target.checked;
    setOverdueOnly(checked);
    setLoading(true);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setFormError('');
  };

  const handleOpenAddModal = () => {
    setFormData({
      machineId: machines[0]?.id || '',
      engineerId: engineers[0]?.id || '',
      maintenanceType: '',
      description: '',
      scheduledDate: new Date().toISOString().split('T')[0],
      status: 'PENDING',
      remarks: ''
    });
    setIsEdit(false);
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (task) => {
    setFormData({
      machineId: task.machineId,
      engineerId: task.engineerId,
      maintenanceType: task.maintenanceType,
      description: task.description,
      scheduledDate: task.scheduledDate,
      status: task.status,
      remarks: task.remarks || ''
    });
    setCurrentTaskId(task.id);
    setIsEdit(true);
    setFormError('');
    setShowModal(true);
  };

  const handleOpenUpdateModal = (task) => {
    setFormData({
      machineId: task.machineId,
      engineerId: task.engineerId,
      maintenanceType: task.maintenanceType,
      description: task.description,
      scheduledDate: task.scheduledDate,
      status: task.status,
      remarks: task.remarks || ''
    });
    setCurrentTaskId(task.id);
    setFormError('');
    setShowUpdateModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.machineId || !formData.engineerId || !formData.maintenanceType || !formData.description || !formData.scheduledDate) {
      setFormError('Please fill in all mandatory fields.');
      return;
    }

    try {
      if (isEdit) {
        await api.put(`/maintenance/${currentTaskId}`, formData);
        setSuccess('Maintenance schedule updated successfully.');
      } else {
        await api.post('/maintenance', formData);
        setSuccess('Maintenance task scheduled successfully.');
      }
      setShowModal(false);
      fetchTasks(overdueOnly);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error occurred while scheduling');
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/maintenance/${currentTaskId}`, {
        machineId: formData.machineId,
        engineerId: formData.engineerId,
        maintenanceType: formData.maintenanceType,
        description: formData.description,
        scheduledDate: formData.scheduledDate,
        status: formData.status,
        remarks: formData.remarks
      });
      setSuccess('Task status updated successfully.');
      setShowUpdateModal(false);
      fetchTasks(overdueOnly);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update task status');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this scheduled task?')) {
      return;
    }
    try {
      await api.delete(`/maintenance/${id}`);
      setSuccess('Maintenance task deleted successfully.');
      fetchTasks(overdueOnly);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Maintenance Schedules</h1>
          <p className="text-sm text-gray-400 mt-1">Assign, track, and update preventive service logs.</p>
        </div>
        {(isAdmin() || isEmployee()) && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-600/20 transition"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Schedule Task</span>
          </button>
        )}
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          {success}
        </div>
      )}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Controls & Filter */}
      <div className="glass-panel p-4 rounded-2xl border border-gray-800 flex justify-between items-center">
        <label className="flex items-center space-x-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={overdueOnly}
            onChange={handleOverdueToggle}
            className="w-4 h-4 text-indigo-600 border-gray-800 bg-dark-900 rounded focus:ring-indigo-500 focus:ring-offset-dark-900"
          />
          <span className="text-sm text-gray-300 font-medium">Show Overdue Tasks Only</span>
        </label>
        
        <span className="text-xs text-gray-500 font-semibold">
          {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'} Listed
        </span>
      </div>

      {/* List / Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="glass-panel py-16 rounded-2xl border border-gray-800 text-center text-gray-500 text-sm">
          No maintenance tasks scheduled.
        </div>
      ) : (
        <div className="glass-panel border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-800 bg-dark-900/40 text-gray-400 uppercase tracking-wider font-semibold text-[10px]">
                  <th className="p-4">Machine</th>
                  <th className="p-4">Service Type</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Scheduled Date</th>
                  <th className="p-4">Completed Date</th>
                  <th className="p-4">Engineer</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/40">
                {tasks.map((task) => {
                  const isCompleted = task.status === 'COMPLETED';
                  const isInProgress = task.status === 'IN_PROGRESS';
                  return (
                    <tr key={task.id} className="hover:bg-dark-700/10 transition">
                      <td className="p-4 font-semibold text-white">
                        <div className="flex items-center space-x-2">
                          <Cpu className="h-4 w-4 text-gray-500" />
                          <span>{task.machineName}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-normal pl-6 block">{task.machineCode}</span>
                      </td>
                      <td className="p-4 text-gray-300 font-medium">{task.maintenanceType}</td>
                      <td className="p-4 text-gray-400 max-w-xs truncate" title={task.description}>
                        {task.description}
                      </td>
                      <td className="p-4 text-gray-300">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="h-3.5 w-3.5 text-gray-500" />
                          <span>{task.scheduledDate}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-400">
                        {task.completedDate ? (
                          <span className="text-emerald-400 font-semibold">{task.completedDate}</span>
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </td>
                      <td className="p-4 text-gray-300 font-medium">
                        <div className="flex items-center space-x-1.5">
                          <User className="h-3.5 w-3.5 text-gray-500" />
                          <span>{task.engineerName}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`
                          px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider
                          ${isCompleted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
                          ${isInProgress ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : ''}
                          ${task.status === 'PENDING' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : ''}
                        `}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {(isAdmin() || isEmployee()) && (
                            <button
                              onClick={() => handleOpenEditModal(task)}
                              className="p-2 bg-dark-700/60 hover:bg-dark-700 text-gray-400 hover:text-white rounded-lg border border-gray-800 transition"
                              title="Edit Details"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {isAdmin() && (
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-2 bg-dark-700/60 hover:bg-rose-950/20 text-gray-400 hover:text-rose-400 rounded-lg border border-gray-800 hover:border-rose-950/30 transition"
                              title="Delete Task"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {isEngineer() && !isCompleted && (
                            <button
                              onClick={() => handleOpenUpdateModal(task)}
                              className="bg-indigo-600/10 border border-indigo-500/20 hover:bg-indigo-600 text-indigo-400 hover:text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition"
                            >
                              Update Status
                            </button>
                          )}
                          {isCompleted && (
                            <span className="text-[10px] text-gray-500 italic flex justify-end items-center space-x-1">
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                              <span>Done</span>
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-800 border border-gray-800 rounded-3xl p-6 md:p-8 w-full max-w-lg relative shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">
              {isEdit ? 'Modify Scheduled Service' : 'Schedule Preventive Maintenance'}
            </h2>
            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                {formError}
              </div>
            )}
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Select Machine *</label>
                <select
                  name="machineId"
                  value={formData.machineId}
                  onChange={handleInputChange}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
                  required
                >
                  {machines.map(m => (
                    <option key={m.id} value={m.id}>{m.machineName} ({m.machineCode})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Assign Engineer *</label>
                <select
                  name="engineerId"
                  value={formData.engineerId}
                  onChange={handleInputChange}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
                  required
                >
                  {engineers.map(eng => (
                    <option key={eng.id} value={eng.id}>{eng.name} ({eng.email})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Service Type *</label>
                  <input
                    type="text"
                    name="maintenanceType"
                    value={formData.maintenanceType}
                    onChange={handleInputChange}
                    placeholder="Routine Check / Calibration"
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Scheduled Date *</label>
                  <input
                    type="date"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleInputChange}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Description / Instructions *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Detail the instructions or problem to resolve..."
                  rows="3"
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs resize-none"
                  required
                />
              </div>

              {isEdit && (
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Remarks</label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    placeholder="Add engineer notes or completions logs..."
                    rows="2"
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs resize-none"
                  />
                </div>
              )}

              <div className="flex space-x-3 pt-6 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-dark-700 hover:bg-dark-600 text-gray-300 font-semibold py-2.5 rounded-xl text-xs border border-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl text-xs shadow-lg shadow-indigo-600/20 transition"
                >
                  {isEdit ? 'Save Changes' : 'Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Engineer Status Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-800 border border-gray-800 rounded-3xl p-6 md:p-8 w-full max-w-lg relative shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-2">Update Task Progress</h2>
            <p className="text-xs text-gray-500 mb-6">Modify task progress status and write audit logs.</p>
            
            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Progress Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
                  required
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">remarks & notes *</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  placeholder="Describe parts replaced, calibration details, or checklist achievements..."
                  rows="3"
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs resize-none"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-6 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="flex-1 bg-dark-700 hover:bg-dark-600 text-gray-300 font-semibold py-2.5 rounded-xl text-xs border border-gray-800 transition"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl text-xs shadow-lg shadow-indigo-600/20 transition"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Maintenance;
