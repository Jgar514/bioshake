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
      setIframeInteractive(false); // reset unlock
    } catch (err) {
      console.error('Failed to load link:', err);
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
        console.log('🚨 SHAKE DETECTED');
        getRandomLink();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {link && (
        <iframe
          src={link.url}
          title={link.name}
          className={`absolute inset-0 w-full h-full z-0 ${iframeInteractive ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
          frameBorder="0"
        />
      )}

      {!iframeInteractive && (
        <div
          onClick={() => setIframeInteractive(true)}
          className="fixed inset-0 z-10 flex items-center justify-center text-white"
        >
          <div className="bg-black/60 px-4 py-2 rounded-full text-sm">
            👆 Tap to unlock the site
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={getRandomLink}
          className="w-14 h-14 rounded-full bg-green-600 text-white text-2xl flex items-center justify-center shadow hover:bg-green-700 transition"
        >
          🔄
        </button>
      </div>
    </div>
  );
}
