'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleStart = async () => {
    if (
      typeof window !== 'undefined' &&
      typeof window.DeviceMotionEvent === 'function' &&
      typeof window.DeviceMotionEvent.requestPermission === 'function'
    ) {
      try {
        const res = await window.DeviceMotionEvent.requestPermission();
        if (res !== 'granted') {
          alert('Shake permission was denied.');
          return;
        }
      } catch (err) {
        alert('Could not request motion permission.');
        return;
      }
    }
    // ✅ Navigate to the main app
    router.push('/shake');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">🔬 BioShake</h1>
      <p className="mb-4 text-center">Shake to discover a random bioengineering startup</p>
      <button
        onClick={handleStart}
        className="bg-green-600 text-white px-6 py-3 rounded-full text-lg shadow hover:bg-green-700 transition"
      >
        Enable Shake & Start
      </button>
    </div>
  );
}
