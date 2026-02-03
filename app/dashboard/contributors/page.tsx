'use client';

import { Users } from 'lucide-react';

export default function ContributorsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contributors</h1>
        <p className="text-gray-600">Manage contributor registrations</p>
      </div>

      <div className="card text-center py-12">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          This page will display contributors who have registered through the platform.
          Add API endpoint integration to fetch and manage contributor data.
        </p>
      </div>
    </div>
  );
}
