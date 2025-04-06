// src/app/page.js

'use client';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleStart = async () => {
    // iOS Safari requires permission request
    if (
      typeof window !== 'undefined' &&
      typeof window.DeviceMotionEvent?.requestPermission === 'function'
    ) {
      try {
        const result = await window.DeviceMotionEvent.requestPermission();
        if (result !== 'granted') {
          alert('Shake permission denied.');
          return;
        }
      } catch (err) {
        alert('Error requesting motion permission.');
        return;
      }
    }

    // Navigate to main app
    router.push('/shake');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white text-center px-6">
      <h1 className="text-3xl font-bold mb-4">🔬 Welcome to BioShake</h1>
      <p className="mb-6">Shake your phone to discover bioengineering startups</p>
      <button
        onClick={handleStart}
        className="bg-green-600 px-6 py-3 rounded-full text-lg hover:bg-green-700 transition"
      >
        Enable Shake & Start
      </button>
    </div>
  );
}
