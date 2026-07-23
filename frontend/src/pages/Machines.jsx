import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Cpu, 
  MapPin, 
  Building,
  Info,
  Download
} from 'lucide-react';

const Machines = () => {
  const { isAdmin } = useAuth();
  
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modals state
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentMachineId, setCurrentMachineId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    machineCode: '',
    machineName: '',
    department: '',
    location: '',
    manufacturer: '',
    installationDate: '',
    runtimeHours: 0,
    status: 'RUNNING',
    lastMaintenanceDate: '',
    nextMaintenanceDate: ''
  });
  const [formError, setFormError] = useState('');

  const fetchMachines = async (searchVal = '') => {
    try {
      const response = await api.get(`/machines?search=${searchVal}`);
      setMachines(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load machines');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    fetchMachines(val);
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
      machineCode: '',
      machineName: '',
      department: '',
      location: '',
      manufacturer: '',
      installationDate: new Date().toISOString().split('T')[0],
      runtimeHours: 0,
      status: 'RUNNING',
      lastMaintenanceDate: '',
      nextMaintenanceDate: ''
    });
    setIsEdit(false);
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (machine) => {
    setFormData({
      machineCode: machine.machineCode,
      machineName: machine.machineName,
      department: machine.department,
      location: machine.location,
      manufacturer: machine.manufacturer,
      installationDate: machine.installationDate,
      runtimeHours: machine.runtimeHours,
      status: machine.status,
      lastMaintenanceDate: machine.lastMaintenanceDate || '',
      nextMaintenanceDate: machine.nextMaintenanceDate || ''
    });
    setCurrentMachineId(machine.id);
    setIsEdit(true);
    setFormError('');
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.machineCode || !formData.machineName || !formData.department || !formData.location || !formData.manufacturer || !formData.installationDate) {
      setFormError('Please fill in all mandatory fields.');
      return;
    }
    if (formData.runtimeHours < 0) {
      setFormError('Runtime hours cannot be negative.');
      return;
    }

    try {
      if (isEdit) {
        await api.put(`/machines/${currentMachineId}`, formData);
        setSuccess('Machine updated successfully.');
      } else {
        await api.post('/machines', formData);
        setSuccess('Machine registered successfully.');
      }
      setShowModal(false);
      fetchMachines(search);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error occurred while saving machine');
    }
  };

  const handleDeleteMachine = async (id) => {
    if (!window.confirm('Are you sure you want to delete this machine? This will also remove associated scheduled maintenance records.')) {
      return;
    }
    try {
      await api.delete(`/machines/${id}`);
      setSuccess('Machine deleted successfully.');
      fetchMachines(search);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete machine');
    }
  };

  // Filter client-side based on status
  const filteredMachines = machines.filter(m => {
    if (!statusFilter) return true;
    return m.status === statusFilter;
  });

  const handleDownloadCSV = () => {
    const headers = [
      'Machine Code',
      'Machine Name',
      'Department',
      'Location',
      'RAM',
      'Processor',
      'Storage',
      'OS',
      'Use case / Software',
      'Installation Date',
      'Runtime Hours',
      'Status',
      'Last Maintenance Date',
      'Next Maintenance Date'
    ];

    const extractParam = (specs, key) => {
      if (!specs) return 'N/A';
      // Match the pattern like "Key: Value" up to the next comma or end of string
      const regex = new RegExp(`${key}:\\s*([^,]+)(?:,|$)`, 'i');
      const match = specs.match(regex);
      return match ? match[1].trim() : 'N/A';
    };

    const rows = machines.map(m => {
      // If it contains "RAM:", we parse it, otherwise we put the full value under "Use case / Software"
      const isConfiguredComputer = m.manufacturer && m.manufacturer.includes('RAM:');
      
      const ram = isConfiguredComputer ? extractParam(m.manufacturer, 'RAM') : 'N/A';
      const processor = isConfiguredComputer ? extractParam(m.manufacturer, 'Processor') : 'N/A';
      const storage = isConfiguredComputer ? extractParam(m.manufacturer, 'Storage') : 'N/A';
      const os = isConfiguredComputer ? extractParam(m.manufacturer, 'OS') : 'N/A';
      const use = isConfiguredComputer ? extractParam(m.manufacturer, 'Use') : (m.manufacturer || 'N/A');

      return [
        `"${m.machineCode.replace(/"/g, '""')}"`,
        `"${m.machineName.replace(/"/g, '""')}"`,
        `"${m.department.replace(/"/g, '""')}"`,
        `"${m.location.replace(/"/g, '""')}"`,
        `"${ram.replace(/"/g, '""')}"`,
        `"${processor.replace(/"/g, '""')}"`,
        `"${storage.replace(/"/g, '""')}"`,
        `"${os.replace(/"/g, '""')}"`,
        `"${use.replace(/"/g, '""')}"`,
        m.installationDate,
        m.runtimeHours,
        m.status,
        m.lastMaintenanceDate || 'N/A',
        m.nextMaintenanceDate || 'N/A'
      ];
    });

    // Add BOM (\uFEFF) for proper UTF-8 Excel mapping
    const csvContent = "\uFEFF" + [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `machines_status_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Machine Directory</h1>
          <p className="text-sm text-gray-400 mt-1">Register, configure, and monitor shopfloor assets.</p>
        </div>
        {isAdmin() && (
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownloadCSV}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-emerald-600/20 transition"
            >
              <Download className="h-4.5 w-4.5" />
              <span>Download CSV</span>
            </button>
            <button
              onClick={handleOpenAddModal}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-600/20 transition"
            >
              <Plus className="h-4.5 w-4.5" />
              <span>Add Machine</span>
            </button>
          </div>
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

      {/* Controls: Search and Filters */}
      <div className="glass-panel p-4 rounded-2xl border border-gray-800 flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
            <Search className="h-4.5 w-4.5" />
          </div>
          <input
            type="text"
            placeholder="Search by code, name, department, location..."
            value={search}
            onChange={handleSearchChange}
            className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
          >
            <option value="">All Statuses</option>
            <option value="RUNNING">Running</option>
            <option value="DOWN">Down</option>
            <option value="UNDER_MAINTENANCE">Under Maintenance</option>
          </select>
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : filteredMachines.length === 0 ? (
        <div className="glass-panel py-16 rounded-2xl border border-gray-800 text-center text-gray-500 text-sm">
          No machines found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMachines.map((machine) => (
            <div 
              key={machine.id} 
              className="glass-panel rounded-2xl border border-gray-800 p-6 flex flex-col justify-between hover:border-indigo-500/20 transition group relative overflow-hidden"
            >
              {/* Overlay pulse indicator */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-bl-full pointer-events-none" />

              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`
                      p-3 rounded-xl border
                      ${machine.status === 'RUNNING' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : ''}
                      ${machine.status === 'DOWN' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 animate-pulse-soft' : ''}
                      ${machine.status === 'UNDER_MAINTENANCE' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : ''}
                    `}>
                      <Cpu className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-indigo-400 transition">{machine.machineName}</h3>
                      <p className="text-[10px] font-semibold text-gray-500 tracking-wider uppercase mt-0.5">{machine.machineCode}</p>
                    </div>
                  </div>

                  <span className={`
                    px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                    ${machine.status === 'RUNNING' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
                    ${machine.status === 'DOWN' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : ''}
                    ${machine.status === 'UNDER_MAINTENANCE' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : ''}
                  `}>
                    {machine.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-2 mt-6 text-xs text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span>Dept: <strong className="text-gray-300">{machine.department}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>Location: <strong className="text-gray-300">{machine.location}</strong></span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-800/40 mt-3 text-[11px]">
                    <span>Runtime Hours:</span>
                    <strong className="text-white">{machine.runtimeHours} hrs</strong>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span>Next Maintenance:</span>
                    <strong className="text-indigo-400">{machine.nextMaintenanceDate || 'Not Scheduled'}</strong>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800/40">
                <Link
                  to={`/machines/${machine.id}`}
                  className="flex items-center space-x-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition"
                >
                  <Info className="h-4 w-4" />
                  <span>Details & History</span>
                </Link>

                {isAdmin() && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(machine)}
                      className="p-2 bg-dark-700/60 hover:bg-dark-700 text-gray-400 hover:text-white rounded-lg border border-gray-800 transition"
                      title="Edit Machine"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMachine(machine.id)}
                      className="p-2 bg-dark-700/60 hover:bg-rose-950/20 text-gray-400 hover:text-rose-400 rounded-lg border border-gray-800 hover:border-rose-950/30 transition"
                      title="Delete Machine"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Machine Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-800 border border-gray-800 rounded-3xl p-6 md:p-8 w-full max-w-lg relative shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">
              {isEdit ? 'Edit Machine Settings' : 'Register New Machine'}
            </h2>
            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                {formError}
              </div>
            )}
            
            <form onSubmit={handleFormSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Machine Code *</label>
                  <input
                    type="text"
                    name="machineCode"
                    value={formData.machineCode}
                    onChange={handleInputChange}
                    placeholder="MAC-101"
                    disabled={isEdit}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs disabled:opacity-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Machine Name *</label>
                  <input
                    type="text"
                    name="machineName"
                    value={formData.machineName}
                    onChange={handleInputChange}
                    placeholder="CNC Milling Machine"
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Department *</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="Assembly Line"
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Bay 3, Floor 1"
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Manufacturer *</label>
                  <input
                    type="text"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                    placeholder="Siemens"
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Installation Date *</label>
                  <input
                    type="date"
                    name="installationDate"
                    value={formData.installationDate}
                    onChange={handleInputChange}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Runtime Hours *</label>
                  <input
                    type="number"
                    name="runtimeHours"
                    value={formData.runtimeHours}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    step="0.1"
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Machine Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
                    required
                  >
                    <option value="RUNNING">Running</option>
                    <option value="DOWN">Down</option>
                    <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                  </select>
                </div>
              </div>

              {isEdit && (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-800/40">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Last Maintenance</label>
                    <input
                      type="date"
                      name="lastMaintenanceDate"
                      value={formData.lastMaintenanceDate}
                      onChange={handleInputChange}
                      className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Next Maintenance</label>
                    <input
                      type="date"
                      name="nextMaintenanceDate"
                      value={formData.nextMaintenanceDate}
                      onChange={handleInputChange}
                      className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
                    />
                  </div>
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
                  {isEdit ? 'Save Changes' : 'Register Machine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Machines;
