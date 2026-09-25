import React, { useState, useEffect } from 'react';
import { Play, Sparkles } from 'lucide-react';
import { TachometerGauge } from '../ui/TachometerGauge';
import { GoldButton } from '../ui/GoldButton';
import { soundManager } from '../../utils/audio';

interface SplashScreenProps {
  onStart: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  const [rpm, setRpm] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Tachometer rev up animation sequence
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      if (frame <= 12) {
        // Rev up to 7500 RPM
        setRpm((prev) => Math.min(prev + 650, 7800));
      } else if (frame <= 20) {
        // Drop to idle around 1100 RPM
        setRpm((prev) => Math.max(prev - 700, 1100));
      } else {
        clearInterval(interval);
        setReady(true);
      }
    }, 70);

    return () => clearInterval(interval);
  }, []);

  const handleLaunch = () => {
    soundManager.playEngineRev();
    onStart();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center bg-[#0C0C0E] overflow-hidden px-6 py-12 select-none">
      {/* Background sports car with 3-stop vertical gradient scrim */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/17092455/pexels-photo-17092455.png')`,
        }}
      />
      {/* 3-stop vertical gradient scrim for high contrast readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0C0C0E] via-[#0C0C0E]/75 to-[#0C0C0E] pointer-events-none" />

      {/* Decorative ambient radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Tag */}
      <div className="relative z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16161A]/80 border border-[#D4AF37]/30 backdrop-blur-md">
        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37]">
          Automotive Trivia Arena
        </span>
      </div>

      {/* Center Branding & Tachometer */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto w-full max-w-sm">
        {/* Tachometer needle gauge */}
        <div className="relative mb-6 transform hover:scale-105 transition-transform duration-300">
          <TachometerGauge
            value={rpm}
            maxValue={8000}
            label="IDLE RPM"
            unit="RPM"
            size={190}
            showRedline={true}
          />
        </div>

        {/* Cinematic Title */}
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-none mb-3">
          CAR <span className="gold-gradient-text">QUIZ</span> CHALLENGE
        </h1>

        {/* Subtitle */}
        <p className="text-xs md:text-sm text-[#9A9A9F] max-w-xs font-normal leading-relaxed mb-6">
          A cinematic, high-octane automotive quiz arena draped in deep obsidian and burnished gold.
        </p>

        {/* Feature Pills */}
        <div className="grid grid-cols-3 gap-2 w-full mb-4">
          <div className="bg-[#16161A]/80 border border-[#D4AF37]/20 p-2 rounded-xl text-center">
            <div className="text-[10px] text-[#9A9A9F] uppercase">Categories</div>
            <div className="text-sm font-bold text-[#D4AF37]">6 Tracks</div>
          </div>
          <div className="bg-[#16161A]/80 border border-[#D4AF37]/20 p-2 rounded-xl text-center">
            <div className="text-[10px] text-[#9A9A9F] uppercase">Timer</div>
            <div className="text-sm font-bold text-white">15s Lap</div>
          </div>
          <div className="bg-[#16161A]/80 border border-[#D4AF37]/20 p-2 rounded-xl text-center">
            <div className="text-[10px] text-[#9A9A9F] uppercase">Trophies</div>
            <div className="text-sm font-bold text-[#D4AF37]">Global</div>
          </div>
        </div>
      </div>

      {/* Bottom Ignition Button */}
      <div className="relative z-10 w-full max-w-sm flex flex-col gap-3">
        <GoldButton
          size="lg"
          fullWidth
          onClick={handleLaunch}
          icon={<Play className="w-5 h-5 fill-black" />}
        >
          START ENGINE
        </GoldButton>

        <button
          type="button"
          onClick={onStart}
          className="text-xs uppercase tracking-widest text-[#9A9A9F] hover:text-[#D4AF37] transition-colors py-2"
        >
          Skip Intro & Enter Garage
        </button>
      </div>
    </div>
  );
};
