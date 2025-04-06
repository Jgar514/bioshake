'use client';

import { useEffect, useState } from 'react';

export default function BioShake() {
  const [link, setLink] = useState(null);
  const [iframeInteractive, setIframeInteractive] = useState(false);

  const getRandomLink = async () => {
    try {
      const res = await fetch('/data/bioengineering_links.json');
      const links = await res.json();
      const random = links[Math.floor(Math.random() * links.length)];
      setLink(random);
      setIframeInteractive(false);
    } catch (err) {
      console.error('Error loading site:', err);
    }
  };

  useEffect(() => {
    getRandomLink();

    let lastShake = Date.now();

    const handleMotion = (event) => {
      const { x, y, z } = event.accelerationIncludingGravity || {};
      const total = Math.abs(x) + Math.abs(y) + Math.abs(z);
      if (total > 30 && Date.now() - lastShake > 1000) {
        lastShake = Date.now();
        getRandomLink();
      }
    };

    if (
      typeof window !== 'undefined' &&
      typeof window.DeviceMotionEvent !== 'undefined'
    ) {
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* 🔬 Full-screen iframe */}
      {link && (
        <iframe
          src={link.url}
          title={link.name}
          className={`absolute inset-0 w-full h-full z-0 ${iframeInteractive ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
          frameBorder="0"
        />
      )}

      {/* 👆 Tap to unlock */}
      {!iframeInteractive && (
        <div
          onClick={() => setIframeInteractive(true)}
          className="fixed inset-0 z-10 flex items-center justify-center text-white text-sm bg-transparent"
        >
          <div className="bg-black/60 px-4 py-2 rounded-full shadow-md">
            👆 Tap to unlock and interact
          </div>
        </div>
      )}

      {/* 🔄 Floating button */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
        <button
          onClick={getRandomLink}
          className="w-14 h-14 rounded-full bg-green-600 text-white shadow-xl flex items-center justify-center text-2xl font-bold hover:bg-green-700 transition backdrop-blur-md backdrop-opacity-80"
        >
          🔄
        </button>
      </div>
    </div>
  );
}
