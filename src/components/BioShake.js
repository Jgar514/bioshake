'use client';

import { useEffect, useState } from 'react';

export default function BioShake() {
  const [link, setLink] = useState(null);

  const getRandomLink = async () => {
    try {
      const res = await fetch('/data/bioengineering_links.json');
      const links = await res.json();
      const random = links[Math.floor(Math.random() * links.length)];
      setLink(random);
    } catch (err) {
      console.error('Failed to load link:', err);
    }
  };

  useEffect(() => {
    getRandomLink(); // Load a site on first render

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
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* 🌐 Embedded site (fully interactive) */}
      {link && (
        <iframe
          src={link.url}
          title={link.name}
          className="absolute inset-0 w-full h-full z-0 pointer-events-auto"
          frameBorder="0"
        />
      )}

      {/* 🔄 Floating refresh button */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
        <button
          onClick={getRandomLink}
          className="w-14 h-14 rounded-full bg-green-600 text-white text-2xl flex items-center justify-center shadow hover:bg-green-700 transition backdrop-blur-md backdrop-opacity-80"
        >
          🔄
        </button>
      </div>
    </div>
  );
}
