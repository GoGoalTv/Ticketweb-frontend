import React from 'react';

interface LoaderProps {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
}

export const ClipLoader: React.FC<LoaderProps> = ({
  size = 24,
  color = 'currentColor',
  strokeWidth = 4,
}) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        style={{ animation: 'rotate 1s linear infinite' }}
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray="80, 200"
        />
      </svg>
      <style>{`
        @keyframes rotate {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};