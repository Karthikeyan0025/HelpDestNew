"use client"
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js'; // Import Supabase client

const supabaseUrl = 'https://ppxqubzckpfavasxgrla.supabase.co'; // Your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBweHF1Ynpja3BmYXZhc3hncmxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyODA5NjgsImV4cCI6MjA0Nzg1Njk2OH0.IaIWsx7btp-yrGYyCRcjkiQE4wzeJmZBC9DGKn9okug'; // Replace with your Supabase key
const supabase = createClient(supabaseUrl, supabaseKey); // Create Supabase client

const AdminDashboard = () => {
  const { user } = supabase.auth; // Get the user from Supabase auth context
  const userId = user?.id; // Use the user's ID from the authentication context
  const [stats, setStats] = useState({
    inProgress: 0,
    completed: 0,
    open: 0
  });

  useEffect(() => {
    // Fetch ticket statistics from your Supabase table
    const fetchTicketStats = async () => {
      try {
        const { data, error } = await supabase
          .from('tickets') // Specify the table name
          .select('*')
          .eq('user_id', userId); // Filter by user ID

        if (error) throw error; // Handle error

        console.log("555555555555555555555", data);
        // Assuming the data structure matches your stats object
        setStats({
          inProgress: data.filter(ticket => ticket.status?.toLowerCase() === 'inprogress').length,
          completed: data.filter(ticket => ticket.status?.toLowerCase() === 'closed').length,
          open: data.filter(ticket => ticket.status?.toLowerCase() === 'open').length
        });
      } catch (error) {
        console.error('Error fetching ticket stats:', error);
      }
    };

    fetchTicketStats();
  }, [userId]); // Add userId as a dependency

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <div className="flex justify-around items-center p-4">
        {/* Open Tickets Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 w-1/4 transform transition-transform duration-200 hover:scale-105">
          <svg className="h-8 w-8 mb-2" viewBox="0 0 100 100">
            {/* <circle cx="50" cy="50" r="40" fill="#3b82f6" /> */}
            <text x="50" y="55" fontSize="20" textAnchor="middle" fill="white">Logo</text>
          </svg>
          <h3 className="text-gray-500 text-sm">Open Tickets</h3>
          <p className="text-3xl font-bold">{stats.open}</p>
        </div>

        {/* In Progress Tickets Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500 w-1/4 transform transition-transform duration-200 hover:scale-105">
          <svg className="h-8 w-8 mb-2" viewBox="0 0 100 100">
            {/* <circle cx="50" cy="50" r="40" fill="#fbbf24" /> */}
            <text x="50" y="55" fontSize="20" textAnchor="middle" fill="white">Logo</text>
          </svg>
          <h3 className="text-gray-500 text-sm">In Progress</h3>
          <p className="text-3xl font-bold">{stats.inProgress}</p>
        </div>

        {/* Completed Tickets Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 w-1/4 transform transition-transform duration-200 hover:scale-105">
          <svg className="h-8 w-8 mb-2" viewBox="0 0 100 100">
            {/* <circle cx="50" cy="50" r="40" fill="#22c55e" /> */}
            <text x="50" y="55" fontSize="20" textAnchor="middle" fill="white">Logo</text>
          </svg>
          <h3 className="text-gray-500 text-sm">Solved</h3>
          <p className="text-3xl font-bold">{stats.completed}</p>
        </div>
      </div>
      {/* Render your dashboard components here */}
    </div>
  );
};

export default AdminDashboard;  