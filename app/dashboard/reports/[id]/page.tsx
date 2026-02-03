'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Tag,
  FileText,
  Save,
  Clock,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { ReportDetail, ReportStatus } from '@/lib/types';
import {
  formatDateTime,
  formatRelativeTime,
  getStatusColor,
  getStatusLabel,
  getSeverityColor,
  getSeverityLabel,
} from '@/lib/utils';

const statusOptions: ReportStatus[] = [
  'draft',
  'pending',
  'verified',
  'in_progress',
  'resolved',
  'rejected',
];

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<ReportStatus>('pending');
  const [resolutionNotes, setResolutionNotes] = useState('');

  useEffect(() => {
    if (params.id) {
      loadReport(params.id as string);
    }
  }, [params.id]);

  const loadReport = async (id: string) => {
    try {
      setLoading(true);
      const response = await apiClient.getReport(id);

      if (response.success && response.data) {
        setReport(response.data);
        setNewStatus(response.data.status);
        setResolutionNotes(response.data.resolution_notes || '');
      }
    } catch (error) {
      console.error('Failed to load report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!report) return;

    try {
      setUpdating(true);
      const response = await apiClient.updateReportStatus(
        report.id,
        newStatus,
        resolutionNotes || undefined
      );

      if (response.success) {
        await loadReport(report.id);
        alert('Status updated successfully!');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Report not found</p>
        <Link href="/dashboard/reports" className="btn-primary">
          Back to Reports
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link
          href="/dashboard/reports"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{report.title}</h1>
          <div className="flex flex-wrap gap-2">
            <span className={`badge ${getStatusColor(report.status)}`}>
              {getStatusLabel(report.status)}
            </span>
            {report.categories.map((cat) => (
              <span
                key={cat.category_id}
                className={`badge ${getSeverityColor(cat.severity)}`}
              >
                {cat.name} - {getSeverityLabel(cat.severity)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Description
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">{report.description}</p>
          </div>

          {/* Timeline */}
          {report.timeline && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Timeline
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">{report.timeline}</p>
            </div>
          )}

          {/* Impact */}
          {report.impact && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Impact</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{report.impact}</p>
            </div>
          )}

          {/* Location */}
          {report.location && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location
              </h2>
              <div className="space-y-2 text-gray-700">
                <p>
                  <span className="font-medium">Display Name:</span>{' '}
                  {report.location.display_name || '-'}
                </p>
                <p>
                  <span className="font-medium">Province:</span>{' '}
                  {report.location.province_name || '-'}
                </p>
                <p>
                  <span className="font-medium">Regency:</span>{' '}
                  {report.location.regency_name || '-'}
                </p>
                {report.location.lat && report.location.lon && (
                  <p>
                    <span className="font-medium">Coordinates:</span>{' '}
                    {report.location.lat.toFixed(6)}, {report.location.lon.toFixed(6)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Update */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ReportStatus)}
                  className="input"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {getStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resolution Notes (Optional)
                </label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  rows={4}
                  className="input"
                  placeholder="Add notes about the resolution..."
                />
              </div>

              <button
                onClick={handleUpdateStatus}
                disabled={updating || newStatus === report.status}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update Status
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Metadata */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Information</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Report ID</p>
                <p className="font-mono text-xs text-gray-900">{report.id}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Ticket ID</p>
                <p className="font-mono text-xs text-gray-900">{report.ticket_id}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Created</p>
                <p className="text-gray-900">{formatDateTime(report.created_at)}</p>
                <p className="text-xs text-gray-500">{formatRelativeTime(report.created_at)}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Last Updated</p>
                <p className="text-gray-900">{formatDateTime(report.updated_at)}</p>
                <p className="text-xs text-gray-500">{formatRelativeTime(report.updated_at)}</p>
              </div>
              {report.verified_at && (
                <div>
                  <p className="text-gray-500 mb-1">Verified</p>
                  <p className="text-gray-900">{formatDateTime(report.verified_at)}</p>
                </div>
              )}
              {report.resolved_at && (
                <div>
                  <p className="text-gray-500 mb-1">Resolved</p>
                  <p className="text-gray-900">{formatDateTime(report.resolved_at)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Tag Type */}
          {report.tag_type && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Type
              </h2>
              <span className="badge bg-primary-100 text-primary-800 text-sm">
                {report.tag_type}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
