import React from 'react';

interface TachometerGaugeProps {
  value: number; // 0 to 100 or current seconds
  maxValue: number;
  label?: string;
  unit?: string;
  size?: number;
  showRedline?: boolean;
}

export const TachometerGauge: React.FC<TachometerGaugeProps> = ({
  value,
  maxValue,
  label = 'RPM x 1000',
  unit = '',
  size = 180,
  showRedline = true
}) => {
  // Angle range: -120 deg (0) to +120 deg (max)
  const percentage = Math.min(Math.max(value / maxValue, 0), 1);
  const needleAngle = -120 + percentage * 240;
  const isRedline = showRedline && percentage >= 0.75;

  return (
    <div
      className="relative flex flex-col items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 200 200" className="overflow-visible">
        {/* Outer Bezel with gold rim */}
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="#121215"
          stroke="#D4AF37"
          strokeWidth="2.5"
          strokeOpacity="0.4"
        />
        <circle
          cx="100"
          cy="100"
          r="86"
          fill="none"
          stroke="#222228"
          strokeWidth="1"
        />

        {/* Gauge Arc Track */}
        <path
          d="M 36.36 163.64 A 90 90 0 1 1 163.64 163.64"
          fill="none"
          stroke="#222228"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Normal Arc (Gold) */}
        <path
          d="M 36.36 163.64 A 90 90 0 1 1 145 50"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="10"
          strokeLinecap="round"
          strokeOpacity="0.85"
        />

        {/* Redline Arc (Red danger) */}
        {showRedline && (
          <path
            d="M 145 50 A 90 90 0 0 1 163.64 163.64"
            fill="none"
            stroke="#C62828"
            strokeWidth="10"
            strokeLinecap="round"
          />
        )}

        {/* Tick marks */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((tick) => {
          const tickAngle = -120 + (tick / 8) * 240;
          const rad = (tickAngle - 90) * (Math.PI / 180);
          const x1 = 100 + 72 * Math.cos(rad);
          const y1 = 100 + 72 * Math.sin(rad);
          const x2 = 100 + 82 * Math.cos(rad);
          const y2 = 100 + 82 * Math.sin(rad);
          const isDangerTick = tick >= 6;

          return (
            <line
              key={tick}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isDangerTick ? '#C62828' : '#D4AF37'}
              strokeWidth={tick % 2 === 0 ? '2.5' : '1.5'}
              strokeOpacity={isDangerTick ? 1 : 0.75}
            />
          );
        })}

        {/* Needle */}
        <g
          transform={`rotate(${needleAngle} 100 100)`}
          className="transition-transform duration-200 ease-out"
        >
          {/* Needle shadow */}
          <line
            x1="100"
            y1="110"
            x2="100"
            y2="28"
            stroke="rgba(0,0,0,0.6)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Glowing Red/Gold needle tip */}
          <line
            x1="100"
            y1="110"
            x2="100"
            y2="26"
            stroke={isRedline ? '#FF3D00' : '#D4AF37'}
            strokeWidth="3"
            strokeLinecap="round"
            filter="drop-shadow(0 0 4px rgba(212,175,55,0.8))"
          />
        </g>

        {/* Center Hub */}
        <circle cx="100" cy="100" r="14" fill="#0C0C0E" stroke="#D4AF37" strokeWidth="2" />
        <circle cx="100" cy="100" r="6" fill="#D4AF37" />
      </svg>

      {/* Numerical readout display */}
      <div className="absolute bottom-5 flex flex-col items-center justify-center">
        <span
          className={`font-gauge text-2xl font-bold tracking-wider ${
            isRedline ? 'text-red-500 animate-pulse' : 'text-[#F4F4F6]'
          }`}
        >
          {Math.round(value)}
          {unit && <span className="text-xs text-[#D4AF37] ml-1">{unit}</span>}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-[#9A9A9F] font-semibold">
          {label}
        </span>
      </div>
    </div>
  );
};
