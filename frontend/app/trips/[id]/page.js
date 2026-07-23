'use client'
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from '@/lib/axios';
import CurrencyConverter from '@/components/CurrencyConverter';

export default function TripDetailPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      const res = await axios.get('/api/trips/' + id);
      setTrip(res.data.trip);
    } catch (err) {
      console.error('Failed to load trip');
    } finally {
      setLoading(false);
    }
  };

  const generateItinerary = async () => {
    setGenerating(true);
    try {
      const res = await axios.post('/api/itinerary/' + id + '/generate');
      setTrip(res.data.trip);
    } catch (err) {
      alert('Failed to generate itinerary');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!trip) return <div className="text-center py-12">Trip not found</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">{trip.destination}</h1>
      <p className="text-gray-600 mb-8">
        {trip.days} days | {trip.budget} budget | {trip.interests.join(', ')}
      </p>

      {trip.status === 'draft' && (
        <button onClick={generateItinerary} disabled={generating}
          className="bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700 disabled:opacity-50">
          {generating ? 'Generating...' : 'Generate Itinerary'}
        </button>
      )}

      {(trip.status === 'generated' || trip.status === 'modified') && (
        <div className="space-y-8">
          {trip.budgetEstimation && (
            <div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Budget Estimation (Local Currency)</h2>
                <div className="space-y-2">
                  <div className="flex justify-between"><span>Flights</span><span>{'$'}{trip.budgetEstimation.flights}</span></div>
                  <div className="flex justify-between"><span>Accommodation</span><span>{'$'}{trip.budgetEstimation.accommodation}</span></div>
                  <div className="flex justify-between"><span>Food</span><span>{'$'}{trip.budgetEstimation.food}</span></div>
                  <div className="flex justify-between"><span>Activities</span><span>{'$'}{trip.budgetEstimation.activities}</span></div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span><span>{'$'}{trip.budgetEstimation.total}</span>
                  </div>
                </div>
              </div>

              <CurrencyConverter tripId={trip._id} originalBudget={trip.budgetEstimation} />
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold mb-4">Itinerary</h2>
            {trip.itinerary?.map(day => (
              <div key={day.day} className="bg-white rounded-lg shadow-md p-6 mb-4">
                <h3 className="text-xl font-bold text-blue-600 mb-4">Day {day.day}</h3>
                {day.activities?.map((activity, i) => (
                  <div key={i} className="flex gap-4 p-3 bg-gray-50 rounded mb-2">
                    <span className="text-sm text-gray-500 w-16">{activity.time}</span>
                    <div className="flex-grow">
                      <p className="font-medium">{activity.activity}</p>
                      {activity.location && <p className="text-sm text-gray-500">{activity.location}</p>}
                    </div>
                    {activity.cost > 0 && <span className="text-green-600 font-medium">{'$'}{activity.cost}</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
