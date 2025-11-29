import React from "react";

const AdminDashboard = () => {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Admin Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Admin Stats */}
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Total Users</h3>
          <p className="text-3xl">1,234</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Active Projects</h3>
          <p className="text-3xl">567</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Bugs Reported</h3>
          <p className="text-3xl">89</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
