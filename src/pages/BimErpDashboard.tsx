import React from 'react';

const BimErpDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-600 text-white">
      <header className="py-6 px-4">
        <h1 className="text-4xl font-bold text-center">Welcome to BIM ERP Dashboard</h1>
      </header>
      <main className="container mx-auto p-4">
        <section className="bg-white text-gray-800 rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-lg">
            This is the central dashboard for managing ERP-related tasks. Explore your projects, monitor analytics, and manage your workflow.
          </p>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Marketplace</h3>
            <p className="text-base">
              Find opportunities and bids in the marketplace.
            </p>
          </div>
          <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-2">CRM</h3>
            <p className="text-base">
              Manage customer relationships and projects with ease.
            </p>
          </div>
        </section>
      </main>
      <footer className="py-4 text-center">
        <p className="text-sm">&copy; 2025 BIM ERP. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BimErpDashboard;
