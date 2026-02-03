'use client';

import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { CategoryReportSummary } from '@/lib/types';
import { formatNumber } from '@/lib/utils';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryReportSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getReportsByCategory();

      if (response.success) {
        setCategories(response.data.categories || []);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
        <p className="text-gray-600">Report categories and their distribution</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                {category.icon && (
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                    style={{ backgroundColor: category.color + '20' || '#e5e7eb' }}
                  >
                    {category.icon}
                  </div>
                )}
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">
                    {formatNumber(category.report_count)}
                  </p>
                  <p className="text-sm text-gray-500">reports</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
              {category.description && (
                <p className="text-sm text-gray-600">{category.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
