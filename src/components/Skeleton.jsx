import React from 'react';

export default function Skeleton({ width = '100%', height = '1rem', borderRadius = '0.5rem', className = '', style = {}, ...props }) {
  return (
    <div
      className={`skeleton-loader animate-pulse bg-gray-200 ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style,
        opacity: 0,
        animation: 'fadeInOut 1.2s ease-in-out infinite',
      }}
      {...props}
    />
  );
}

// Add fade in/out animation
const styleSheet = document.createElement('style');
styleSheet.innerText = `
@keyframes fadeInOut {
  0% { opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; }
}
`;
document.head.appendChild(styleSheet);
