export default function HotelCard({ hotel }) {
  const categoryColors = {
    'Budget': 'bg-green-100 text-green-700',
    'Mid-range': 'bg-blue-100 text-blue-700',
    'Luxury': 'bg-purple-100 text-purple-700'
  }

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold">{hotel.name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs ${categoryColors[hotel.category]}`}>
          {hotel.category}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <p>💰 {hotel.priceRange}</p>
        <p>⭐ {hotel.rating}/5</p>
        <p>📍 {hotel.location}</p>
      </div>
    </div>
  )
}