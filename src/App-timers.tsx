'use client'

import { useState } from 'react'
import { useTimerStore } from './store/useTimerStore'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

import type { TimerId } from './store/useTimerStore'

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function MultiTimer() {
  const [visibleTimer, setVisibleTimer] = useState<TimerId>('A')
  const timers = useTimerStore(state => state.timers)
  const start = useTimerStore(state => state.start)
  const stop = useTimerStore(state => state.stop)
  const reset = useTimerStore(state => state.reset)
  const updateDuration = useTimerStore(state => state.updateDuration)

  const [modalOpen, setModalOpen] = useState(false)
  const [formValues, setFormValues] = useState<Record<TimerId, string>>({
    A: (timers.A.duration / 60).toString(),
    B: (timers.B.duration / 60).toString(),
    C: (timers.C.duration / 60).toString(),
  })

  const handleOpenModal = () => {
    setFormValues({
      A: (timers.A.duration / 60).toString(),
      B: (timers.B.duration / 60).toString(),
      C: (timers.C.duration / 60).toString(),
    })
    setModalOpen(true)
  }

  const handleSaveDurations = () => {
    (['A', 'B', 'C'] as TimerId[]).forEach(id => {
      const newMinutes = parseInt(formValues[id], 10)
      if (!isNaN(newMinutes)) {
        updateDuration(id, newMinutes)
      }
    })
    setModalOpen(false)
  }

  const timer = timers[visibleTimer]
  const progress =
    timer.remainingTime > 0
      ? ((timer.duration - timer.remainingTime) / timer.duration) * 100
      : 100

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-6 relative min-h-screen bg-c_b85">

      {/* Switch Timer Buttons */}
      <div className="flex space-x-4">
        {(['A', 'B', 'C'] as const).map(id => (
          <button
            key={id}
            onClick={() => setVisibleTimer(id)}
            className={`px-4 py-2 rounded ${visibleTimer === id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
              }`}
          >
            Timer {id}
          </button>
        ))}
      </div>

      {/* Circular Timer Display */}
      <div className="w-56 h-56">
        <CircularProgressbar
          value={progress}
          text={formatTime(timer.remainingTime)}
          styles={buildStyles({
            pathColor: '#1E3A8A',
            textColor: '#1E3A8A',
            trailColor: '#E0E7FF',
            textSize: '16px',
          })}
        />
      </div>

      {/* Timer Controls */}
      <div className="flex space-x-4">
        <button
          onClick={() => start(visibleTimer)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Start
        </button>
        <button
          onClick={() => stop(visibleTimer)}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Stop
        </button>
        <button
          onClick={() => reset(visibleTimer)}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>

      {/* Asterisk Button for Modal */}
      <button
        onClick={handleOpenModal}
        className="fixed bottom-6 right-6 text-3xl text-gray-700"
      >
        *
      </button>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80 space-y-4">
            <h2 className="text-lg font-semibold mb-2">Set Timer Durations (minutes)</h2>
            {(['A', 'B', 'C'] as TimerId[]).map(id => (
              <div key={id} className="flex flex-col">
                <label className="font-medium">Timer {id}</label>
                <input
                  type="number"
                  min="1"
                  value={formValues[id]}
                  onChange={e =>
                    setFormValues(prev => ({
                      ...prev,
                      [id]: e.target.value,
                    }))
                  }
                  className="border rounded px-2 py-1"
                />
              </div>
            ))}

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDurations}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
