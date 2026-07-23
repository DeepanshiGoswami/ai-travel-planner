export default function BudgetDisplay({ budget }) {
  const categories = [
    { key: 'flights', label: '✈️ Flights', color: 'text-blue-600' },
    { key: 'accommodation', label: '🏨 Accommodation', color: 'text-purple-600' },
    { key: 'food', label: '🍽️ Food', color: 'text-orange-600' },
    { key: 'activities', label: '🎯 Activities', color: 'text-green-600' }
  ]

  return (
    <div className="card bg-gradient-to-r from-blue-50 to-purple-50">
      <h2 className="text-2xl font-bold mb-4">💰 Estimated Budget</h2>
      <div className="space-y-3">
        {categories.map(({ key, label, color }) => (
          <div key={key} className="flex justify-between items-center">
            <span className={color}>{label}</span>
            <span className="font-semibold">${budget[key] || 0}</span>
          </div>
        ))}
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">Total</span>
            <span className="font-bold text-lg text-primary-600">
              ${budget.total || Object.values(budget).reduce((a, b) => a + (b || 0), 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}