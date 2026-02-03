'use client';

import { MessageSquare } from 'lucide-react';

export default function ExpectationsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Expectations</h1>
        <p className="text-gray-600">User expectations from landing page</p>
      </div>

      <div className="card text-center py-12">
        <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          This page will display user expectations collected from the landing page.
          Add API endpoint integration to fetch and display expectations data.
        </p>
      </div>
    </div>
  );
}
