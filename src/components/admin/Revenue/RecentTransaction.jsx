'use client';

import { CheckCircleIcon } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function RecentTransactions() {
  const { revenueRecords } = useSelector((store) => store.auth);
  const transactions = revenueRecords?.recentTransactions || [];

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-medium text-gray-900">
          Recent Transactions
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Transaction ID', 'User', 'Plan', 'Amount', 'Date', 'Status'].map(
                (header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <tr key={t.transactionId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    #{t.transactionId?.slice(-6)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {t.fullName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {t.email}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {t.planType === "propertyPlan" ? "Property" : "Service"} (
                    {t.planDuration})
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ₹{t.amount}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(t.date).toLocaleDateString("en-IN")}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1.5" />
                      <span className="text-sm text-green-800 font-medium">
                        Paid
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-6 text-center text-sm text-gray-500"
                >
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
