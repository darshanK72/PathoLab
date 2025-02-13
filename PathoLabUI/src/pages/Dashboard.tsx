import React from 'react';
import { Users, FlaskRound as Flask, FileText, Clock } from 'lucide-react';

const DashboardCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const recentPatients = [
    { id: 1, name: 'John Doe', test: 'Blood Test', status: 'Pending', time: '2h ago' },
    { id: 2, name: 'Jane Smith', test: 'COVID-19', status: 'Completed', time: '3h ago' },
    { id: 3, name: 'Mike Johnson', test: 'Urinalysis', status: 'In Progress', time: '5h ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Patients"
          value="1,234"
          icon={Users}
          color="bg-blue-500"
        />
        <DashboardCard
          title="Tests Today"
          value="48"
          icon={Flask}
          color="bg-green-500"
        />
        <DashboardCard
          title="Pending Reports"
          value="12"
          icon={FileText}
          color="bg-yellow-500"
        />
        <DashboardCard
          title="Processing"
          value="8"
          icon={Clock}
          color="bg-purple-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800">Recent Patients</h2>
          <div className="mt-4">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500">
                  <th className="pb-3">Patient Name</th>
                  <th className="pb-3">Test</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentPatients.map((patient) => (
                  <tr key={patient.id} className="border-t">
                    <td className="py-3">{patient.name}</td>
                    <td>{patient.test}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          patient.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : patient.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {patient.status}
                      </span>
                    </td>
                    <td>{patient.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;