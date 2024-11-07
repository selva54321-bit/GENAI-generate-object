'use client';

import { useState } from 'react';

export default function Home() {
  const [workout, setWorkout] = useState(null);
  const [muscle, setMuscle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateWorkout = async () => {
    if (!muscle) {
      setError('Please provide a muscle name');
      return;
    }

    setError('');
    setLoading(true);
    setWorkout(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ muscle }),  // Send muscle to backend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch workout');
      }

      const data = await response.json();
      console.log("API response data:", data);  // Log the API response

      if (data && data.workout) {
        setWorkout(data.workout);  // Update the state with the workout
      } else {
        setError('No workout generated');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="p-6 max-w-md w-full bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">AI Workout Generator</h1>

        {error && <div className="error mb-6">{error}</div>}

        <div className="mb-6">
          <label className="block text-lg text-gray-800 mb-2">Enter Muscle Name</label>
          <input
            type="text"
            value={muscle}
            onChange={(e) => setMuscle(e.target.value)}
            className="p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 transition-all"
            placeholder="e.g., chest, abs"
          />
        </div>

        <button
          onClick={handleGenerateWorkout}
          disabled={loading}
          className="p-3 bg-blue-500 text-white rounded-lg mb-6 hover:bg-blue-600 disabled:bg-gray-300 transition-all"
        >
          {loading ? 'Generating Workout...' : 'Generate Workout'}
        </button>

        <div className="mt-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Generated Workout</h2>
          {workout ? (
            <div className="card">
              <h3 className="text-lg font-semibold text-white">Workout for {muscle}</h3>
              {workout.name && workout.name.length > 0 ? (
                workout.name.map((item, index) => (
                  <div key={index} className="mb-2">
                    <p className="text-lg font-semibold text-white"><strong>Workout Name:</strong> {item.name}</p>
                    <p className="text-lg font-semibold text-white"><strong>Sets:</strong> {workout.sets}</p>
                  </div>
                ))
              ) : (
                <p className="text-white">No specific workouts generated for this muscle</p>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500">No workout generated yet. Click the button to generate one!</p>
          )}
        </div>
      </div>
    </div>
  );
}
