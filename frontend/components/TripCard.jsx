import Link from 'next/link'

export default function TripCard({ trip, onDelete }) {
  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    generating: 'bg-yellow-100 text-yellow-700',
    generated: 'bg-green-100 text-green-700',
    modified: 'bg-blue-100 text-blue-700',
    error: 'bg-red-100 text-red-700'
  }

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{trip.destination}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[trip.status]}`}>
          {trip.status}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <p>{trip.days} days • {trip.budget} budget</p>
        <p>{trip.interests.join(', ')}</p>
      </div>
      
      <div className="mt-4 flex gap-2">
        <Link
          href={`/trips/${trip._id}`}
          className="btn-primary text-sm flex-1 text-center"
        >
          View Trip
        </Link>
        <button
          onClick={() => onDelete(trip._id)}
          className="btn-secondary text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  )
}