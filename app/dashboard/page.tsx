'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import {
  DashboardSummary,
  DashboardReport,
  CategoryReportSummary,
  TagReportSummary,
} from '@/lib/types';
import {
  formatNumber,
  formatDate,
  getStatusColor,
  getStatusLabel,
  truncate,
} from '@/lib/utils';

const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentReports, setRecentReports] = useState<DashboardReport[]>([]);
  const [categories, setCategories] = useState<CategoryReportSummary[]>([]);
  const [tags, setTags] = useState<TagReportSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [summaryRes, reportsRes, categoriesRes, tagsRes] = await Promise.all([
        apiClient.getDashboardSummary(),
        apiClient.getRecentReports(7, 5),
        apiClient.getReportsByCategory(undefined, 1, 10),
        apiClient.getReportsByTag(undefined, 1, 10),
      ]);

      if (summaryRes.success) setSummary(summaryRes.data);
      if (reportsRes.success) setRecentReports(reportsRes.data.reports || []);
      if (categoriesRes.success) setCategories(categoriesRes.data.categories || []);
      if (tagsRes.success) setTags(tagsRes.data.tags || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statusDistribution = summary
    ? [
        { name: 'Pending', value: summary.pending_count },
        { name: 'Resolved', value: summary.resolved_count },
        {
          name: 'Others',
          value: Math.max(0, summary.total_reports - summary.pending_count - summary.resolved_count),
        },
      ]
    : [];

  const tagChartData = tags.map((tag) => ({
    name: tag.label,
    count: tag.report_count,
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to Balungpisah Admin Dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white animate-slide-up">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 opacity-75" />
          </div>
          <p className="text-blue-100 text-sm mb-1">Total Reports</p>
          <p className="text-3xl font-bold">{formatNumber(summary?.total_reports || 0)}</p>
        </div>

        <div className="card bg-gradient-to-br from-yellow-500 to-orange-600 text-white animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
            <AlertTriangle className="w-5 h-5 opacity-75" />
          </div>
          <p className="text-yellow-100 text-sm mb-1">Pending</p>
          <p className="text-3xl font-bold">{formatNumber(summary?.pending_count || 0)}</p>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-emerald-600 text-white animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <CheckCircle className="w-6 h-6" />
            </div>
            <TrendingDown className="w-5 h-5 opacity-75" />
          </div>
          <p className="text-green-100 text-sm mb-1">Resolved</p>
          <p className="text-3xl font-bold">{formatNumber(summary?.resolved_count || 0)}</p>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-pink-600 text-white animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <p className="text-purple-100 text-sm mb-1">This Week</p>
          <p className="text-3xl font-bold">{formatNumber(summary?.reports_this_week || 0)}</p>
          <p className="text-xs text-purple-100 mt-1">
            {formatNumber(summary?.reports_this_month || 0)} this month
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="card animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Categories */}
        <div className="card animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categories.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="report_count" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Report Types */}
      <div className="card animate-slide-up" style={{ animationDelay: '0.6s' }}>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Report Types Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={tagChartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={100} />
            <Tooltip />
            <Bar dataKey="count" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Reports */}
      <div className="card animate-slide-up" style={{ animationDelay: '0.7s' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
          <Link
            href="/dashboard/reports"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-4">
          {recentReports.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No recent reports</p>
          ) : (
            recentReports.map((report) => (
              <Link
                key={report.id}
                href={`/dashboard/reports/${report.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 mb-1">{report.title}</h4>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {truncate(report.description, 150)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className={`badge ${getStatusColor(report.status)}`}>
                        {getStatusLabel(report.status)}
                      </span>
                      {report.categories.map((cat) => (
                        <span
                          key={cat.category_id}
                          className="badge bg-gray-100 text-gray-700"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-500">{formatDate(report.created_at)}</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
