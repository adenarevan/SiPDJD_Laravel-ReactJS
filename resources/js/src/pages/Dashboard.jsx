import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  // Dummy data for road conditions
  const roadConditionData = [
    { 
      name: 'Kabupaten A', 
      severelyDamaged: 75, 
      moderatelyDamaged: 125, 
      goodCondition: 300, 
      totalLength: 500 
    },
    { 
      name: 'Kabupaten B', 
      severelyDamaged: 50, 
      moderatelyDamaged: 100, 
      goodCondition: 350, 
      totalLength: 500 
    },
    { 
      name: 'Kabupaten C', 
      severelyDamaged: 100, 
      moderatelyDamaged: 150, 
      goodCondition: 200, 
      totalLength: 450 
    },
    { 
      name: 'Kabupaten D', 
      severelyDamaged: 80, 
      moderatelyDamaged: 120, 
      goodCondition: 400, 
      totalLength: 600 
    },
    { 
      name: 'Kabupaten E', 
      severelyDamaged: 60, 
      moderatelyDamaged: 90, 
      goodCondition: 250, 
      totalLength: 400 
    }
  ];

  // Data for administrative road distribution
  const administrativeRoadData = [
    { name: 'Jalan Provinsi', value: 1250 },
    { name: 'Jalan Kabupaten', value: 2100 },
    { name: 'Jalan Kota', value: 1800 }
  ];

  // Summary data
  const summaryData = {
    totalRoadLength: 5150,
    severelyDamaged: 365,
    moderatelyDamaged: 585,
    goodCondition: 4200
  };

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  // Calculate percentages for summary
  const severePercentage = ((summaryData.severelyDamaged / summaryData.totalRoadLength) * 100).toFixed(1);
  const moderatePercentage = ((summaryData.moderatelyDamaged / summaryData.totalRoadLength) * 100).toFixed(1);
  const goodPercentage = ((summaryData.goodCondition / summaryData.totalRoadLength) * 100).toFixed(1);

  return (
    <div className="w-full max-w-full min-h-screen flex flex-col pt-8 px-4 pb-16 bg-gray-50 overflow-hidden">


      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard </h1>
        <p className="text-gray-600">Statistik dan visualisasi kondisi  di seluruh wilayah</p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Panjang Jalan</h3>
          <p className="text-3xl font-bold text-blue-600">{summaryData.totalRoadLength} km</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Rusak Berat</h3>
          <p className="text-3xl font-bold text-red-600">{summaryData.severelyDamaged} km</p>
          <p className="text-sm text-gray-500">{severePercentage}% dari total</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Rusak Sedang</h3>
          <p className="text-3xl font-bold text-amber-500">{summaryData.moderatelyDamaged} km</p>
          <p className="text-sm text-gray-500">{moderatePercentage}% dari total</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Kondisi Baik</h3>
          <p className="text-3xl font-bold text-green-600">{summaryData.goodCondition} km</p>
          <p className="text-sm text-gray-500">{goodPercentage}% dari total</p>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Road Condition Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Kondisi Jalan Per Kabupaten</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={roadConditionData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="severelyDamaged" name="Rusak Berat" fill="#EF4444" />
              <Bar dataKey="moderatelyDamaged" name="Rusak Sedang" fill="#F59E0B" />
              <Bar dataKey="goodCondition" name="Kondisi Baik" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Administrative Road Distribution Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Distribusi Jalan Berdasarkan Administrasi</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={administrativeRoadData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {administrativeRoadData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} km`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Road Condition Table */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Detail Kondisi Jalan</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kabupaten</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Panjang (km)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rusak Berat (km)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rusak Sedang (km)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kondisi Baik (km)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roadConditionData.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.totalLength}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.severelyDamaged}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.moderatelyDamaged}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.goodCondition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}