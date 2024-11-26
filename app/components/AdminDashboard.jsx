import { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    inProgress: 0,
    completed: 0,
    open: 0
  });

  useEffect(() => {
    // Fetch ticket statistics from your API
    const fetchTicketStats = async () => {
      try {
        const response = await fetch('/api/tickets/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching ticket stats:', error);
      }
    };

    fetchTicketStats();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Open Tickets Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm">Open Tickets</h3>
          <p className="text-3xl font-bold">{stats.open}</p>
        </div>

        {/* In Progress Tickets Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h3 className="text-gray-500 text-sm">In Progress</h3>
          <p className="text-3xl font-bold">{stats.inProgress}</p>
        </div>

        {/* Completed Tickets Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm">Completed</h3>
          <p className="text-3xl font-bold">{stats.completed}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 