'use client'
import { useState } from 'react'

export default function ItineraryDay({ day, onRegenerate, onAddActivity, onRemoveActivity }) {
  const [showRegenerate, setShowRegenerate] = useState(false)
  const [regenerateRequest, setRegenerateRequest] = useState('')
  const [showAddActivity, setShowAddActivity] = useState(false)
  const [newActivity, setNewActivity] = useState({
    time: '09:00',
    activity: '',
    location: '',
    cost: 0
  })

  const handleRegenerate = () => {
    onRegenerate(regenerateRequest)
    setShowRegenerate(false)
    setRegenerateRequest('')
  }

  const handleAddActivity = () => {
    onAddActivity(newActivity)
    setShowAddActivity(false)
    setNewActivity({ time: '09:00', activity: '', location: '', cost: 0 })
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-primary-600">Day {day.day}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowRegenerate(!showRegenerate)}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            🔄 Regenerate
          </button>
          <button
            onClick={() => setShowAddActivity(!showAddActivity)}
            className="text-sm text-green-600 hover:text-green-700"
          >
            ＋ Add Activity
          </button>
        </div>
      </div>

      {showRegenerate && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <input
            type="text"
            value={regenerateRequest}
            onChange={(e) => setRegenerateRequest(e.target.value)}
            placeholder="e.g., More outdoor activities"
            className="input-field mb-2"
          />
          <div className="flex gap-2">
            <button onClick={handleRegenerate} className="btn-primary text-sm">
              Regenerate
            </button>
            <button onClick={() => setShowRegenerate(false)} className="btn-secondary text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      {showAddActivity && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-2">
          <input
            type="time"
            value={newActivity.time}
            onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
            className="input-field"
          />
          <input
            type="text"
            value={newActivity.activity}
            onChange={(e) => setNewActivity({ ...newActivity, activity: e.target.value })}
            placeholder="Activity description"
            className="input-field"
          />
          <input
            type="text"
            value={newActivity.location}
            onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
            placeholder="Location"
            className="input-field"
          />
          <input
            type="number"
            value={newActivity.cost}
            onChange={(e) => setNewActivity({ ...newActivity, cost: parseInt(e.target.value) })}
            placeholder="Estimated cost"
            className="input-field"
          />
          <div className="flex gap-2">
            <button onClick={handleAddActivity} className="btn-primary text-sm">
              Add
            </button>
            <button onClick={() => setShowAddActivity(false)} className="btn-secondary text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {day.activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-mono text-gray-500 whitespace-nowrap">
              {activity.time}
            </div>
            <div className="flex-grow">
              <p className="font-medium">{activity.activity}</p>
              {activity.location && (
                <p className="text-sm text-gray-500">📍 {activity.location}</p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              {activity.cost > 0 && (
                <span className="text-sm font-medium text-green-600">
                  ${activity.cost}
                </span>
              )}
              <button
                onClick={() => onRemoveActivity(index)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}