'use client'
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import axios from '@/lib/axios';
import FeaturedDestinations from '@/components/FeaturedDestinations';

export default function DashboardPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => { fetchTrips(); }, []);

  const fetchTrips = async () => {
    try {
      const res = await axios.get('/api/trips');
      setTrips(res.data.trips);
    } catch (err) {
      console.error('Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (id) => {
    if (confirm('Delete this trip?')) {
      await axios.delete('/api/trips/' + id);
      fetchTrips();
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
          <p className="text-gray-600 mt-1">Manage your trips or explore featured destinations</p>
        </div>
        <Link href="/trips/create" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold">
          + Plan New Trip
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-4">My Trips</h2>
      
      {loading ? (
        <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div>
      ) : trips.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm mb-8">
          <p className="text-gray-500 text-lg mb-2">No trips yet</p>
          <p className="text-gray-400 mb-4">Choose from featured destinations below or create your own</p>
          <Link href="/trips/create" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-block">Create First Trip</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {trips.map(trip => (
            <div key={trip._id} className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold">{trip.destination}</h3>
                <span className={'px-2 py-1 rounded-full text-xs font-medium ' + (trip.status === 'generated' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600')}>
                  {trip.status}
                </span>
              </div>
              <div className="text-sm text-gray-600 space-y-1 mb-3">
                <p>{trip.days} days | {trip.budget} budget</p>
                <p>{trip.interests?.join(', ')}</p>
              </div>
              <div className="flex gap-2">
                <Link href={'/trips/' + trip._id} className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700 flex-1 text-center">View</Link>
                <button onClick={() => deleteTrip(trip._id)} className="bg-red-100 text-red-600 px-3 py-1.5 rounded text-sm hover:bg-red-200">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-2">Featured Destinations</h2>
        <p className="text-gray-500 mb-6">These destinations have detailed, hand-crafted itineraries with real activities & hotels</p>
        <FeaturedDestinations />
      </div>
    </div>
  );
}
