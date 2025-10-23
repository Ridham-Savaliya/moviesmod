import { useState, useEffect } from 'react';
import Layout from '@/components/Layout/Layout';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { adSlotsAPI } from '@/lib/api';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';

export default function AdSlots() {
  const { user } = useAuth();
  const [adSlots, setAdSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: 'header',
    adCode: '',
    width: '',
    height: '',
    displayOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Access denied. Admin only.');
      return;
    }
    fetchAdSlots();
  }, [user]);

  const fetchAdSlots = async () => {
    setLoading(true);
    try {
      const response = await adSlotsAPI.getAll();
      if (response.data.success) {
        setAdSlots(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch ad slots');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingSlot) {
        await adSlotsAPI.update(editingSlot._id, formData);
        toast.success('Ad slot updated successfully');
      } else {
        await adSlotsAPI.create(formData);
        toast.success('Ad slot created successfully');
      }
      
      setShowModal(false);
      resetForm();
      fetchAdSlots();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (slot) => {
    setEditingSlot(slot);
    setFormData({
      name: slot.name,
      position: slot.position,
      adCode: slot.adCode,
      width: slot.width || '',
      height: slot.height || '',
      displayOrder: slot.displayOrder,
      isActive: slot.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this ad slot?')) return;

    try {
      await adSlotsAPI.delete(id);
      toast.success('Ad slot deleted successfully');
      fetchAdSlots();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete ad slot');
    }
  };

  const resetForm = () => {
    setEditingSlot(null);
    setFormData({
      name: '',
      position: 'header',
      adCode: '',
      width: '',
      height: '',
      displayOrder: 0,
      isActive: true,
    });
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  if (user?.role !== 'admin') {
    return (
      <Layout title="Ad Slots">
        <div className="text-center py-12">
          <p className="text-red-500">Access denied. Admin only.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Ad Slots">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Ad Slots</h1>
            <p className="text-gray-600">Manage Google AdSense placements</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FiPlus size={20} />
            <span>Add Ad Slot</span>
          </button>
        </div>

        {/* Ad Slots Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : adSlots.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No ad slots found</p>
              <button
                onClick={openCreateModal}
                className="mt-4 text-primary-500 hover:text-primary-600"
              >
                Create your first ad slot
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dimensions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {adSlots.map((slot) => (
                  <tr key={slot._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {slot.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 capitalize">
                        {slot.position}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {slot.width && slot.height ? `${slot.width}x${slot.height}` : 'Auto'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {slot.displayOrder}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        slot.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {slot.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(slot)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(slot._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl m-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingSlot ? 'Edit Ad Slot' : 'Create Ad Slot'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Homepage Header"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position *
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="header">Header</option>
                    <option value="sidebar">Sidebar</option>
                    <option value="footer">Footer</option>
                    <option value="content">Content</option>
                    <option value="between-posts">Between Posts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Width (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.width}
                    onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 728"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 90"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded text-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AdSense Code *
                </label>
                <textarea
                  value={formData.adCode}
                  onChange={(e) => setFormData({ ...formData, adCode: e.target.value })}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                  placeholder="Paste your Google AdSense code here..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Paste the complete AdSense ad code from your Google AdSense account
                </p>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
                >
                  {editingSlot ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
