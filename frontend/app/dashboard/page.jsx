'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import TripCard from '@/components/TripCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import axios from '@/lib/axios'

export default function DashboardPage() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    try {
      const response = await axios.get('/api/trips')
      setTrips(response.data.trips || [])
    } catch (error) {
      console.error('Error fetching trips:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-gray-600 mt-1">Manage your travel plans</p>
        </div>
        <button
          onClick={() => router.push('/trips/create')}
          className="btn-primary"
        >
          Plan New Trip
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No trips yet</p>
          <p className="text-gray-400 mt-2">Create your first trip to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map(trip => (
            <TripCard key={trip._id} trip={trip} onDelete={fetchTrips} />
          ))}
        </div>
      )}
    </div>
  )
}