'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from '@/lib/axios'
import toast from 'react-hot-toast'

const INTERESTS = ['Food', 'Culture', 'Adventure', 'Shopping', 'Nature', 'Relaxation']

export default function CreateTripPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    destination: '',
    days: 3,
    budget: 'Medium',
    interests: []
  })
  const [loading, setLoading] = useState(false)

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.interests.length) {
      toast.error('Please select at least one interest')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post('/api/trips', formData)
      toast.success('Trip created! Generating itinerary...')
      router.push(`/trips/${response.data.trip._id}`)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create trip')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Plan Your Trip</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Destination</label>
          <input
            type="text"
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            className="input-field"
            placeholder="e.g., Tokyo, Japan"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Number of Days: {formData.days}
          </label>
          <input
            type="range"
            min="1"
            max="14"
            value={formData.days}
            onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1 day</span>
            <span>14 days</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Budget</label>
          <div className="grid grid-cols-3 gap-3">
            {['Low', 'Medium', 'High'].map(budget => (
              <button
                key={budget}
                type="button"
                onClick={() => setFormData({ ...formData, budget })}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  formData.budget === budget
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {budget}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Interests</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {INTERESTS.map(interest => (
              <button
                key={interest}
                type="button"
                onClick={() => handleInterestToggle(interest)}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  formData.interests.includes(interest)
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !formData.interests.length}
          className="btn-primary w-full py-3 text-lg"
        >
          {loading ? 'Creating...' : 'Generate Itinerary'}
        </button>
      </form>
    </div>
  )
}