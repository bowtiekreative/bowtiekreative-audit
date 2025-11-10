import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

function AdminDashboard({ onLogout }) {
  const [audits, setAudits] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedAudit, setSelectedAudit] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [auditsRes, statsRes] = await Promise.all([
        axios.get('/api/audits/admin/all', { headers }),
        axios.get('/api/audits/admin/stats', { headers })
      ]);

      setAudits(auditsRes.data.audits || []);
      setStats(statsRes.data.stats || {});
    } catch (error) {
      console.error('Failed to fetch data:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage and review all audits</p>
            </div>
            <button
              onClick={onLogout}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Audits</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total || 0}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Today</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.today || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">This Week</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.thisWeek || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Score</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.averageScore || 0}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Audits Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Audits</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {audits.map((audit) => (
                  <tr key={audit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{audit.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {audit.business_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {audit.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-lg font-bold ${getScoreColor(audit.overall_score)}`}>
                        {audit.overall_score || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(audit.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {audit.report_generated ? (
                        <a
                          href={`/pdfs/${audit.pdf_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-800 font-medium"
                        >
                          View PDF
                        </a>
                      ) : (
                        <span className="text-gray-400">Not generated</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedAudit(audit)}
                        className="text-primary-600 hover:text-primary-800 font-medium"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {audits.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No audits found</p>
            </div>
          )}
        </div>
      </div>

      {/* Audit Detail Modal */}
      {selectedAudit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8"
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Audit Details - #{selectedAudit.id}
              </h2>
              <button
                onClick={() => setSelectedAudit(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Business Information</h3>
                <p className="text-sm text-gray-600"><strong>Name:</strong> {selectedAudit.business_name}</p>
                <p className="text-sm text-gray-600"><strong>Contact:</strong> {selectedAudit.contact_name}</p>
                <p className="text-sm text-gray-600"><strong>Email:</strong> {selectedAudit.email}</p>
                <p className="text-sm text-gray-600"><strong>Phone:</strong> {selectedAudit.phone || 'N/A'}</p>
                <p className="text-sm text-gray-600"><strong>Website:</strong> {selectedAudit.website || 'N/A'}</p>
                <p className="text-sm text-gray-600"><strong>Industry:</strong> {selectedAudit.industry}</p>
                <p className="text-sm text-gray-600"><strong>Size:</strong> {selectedAudit.business_size}</p>
                <p className="text-sm text-gray-600"><strong>Location:</strong> {selectedAudit.location || 'N/A'}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Scores</h3>
                <p className="text-sm text-gray-600"><strong>Website:</strong> {selectedAudit.website_score}/100</p>
                <p className="text-sm text-gray-600"><strong>Social:</strong> {selectedAudit.social_score}/100</p>
                <p className="text-sm text-gray-600"><strong>Marketing:</strong> {selectedAudit.marketing_score}/100</p>
                <p className="text-sm text-gray-600"><strong>Automation:</strong> {selectedAudit.automation_score}/100</p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Overall:</strong>{' '}
                  <span className={`text-lg font-bold ${getScoreColor(selectedAudit.overall_score)}`}>
                    {selectedAudit.overall_score}/100
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-2">Goals & Challenges</h3>
              <p className="text-sm text-gray-600 mb-2"><strong>Goals:</strong></p>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{selectedAudit.marketing_goals || 'N/A'}</p>
              <p className="text-sm text-gray-600 mt-3 mb-2"><strong>Challenges:</strong></p>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{selectedAudit.biggest_challenges || 'N/A'}</p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedAudit(null)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
