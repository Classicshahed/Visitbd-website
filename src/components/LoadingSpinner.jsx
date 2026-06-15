// src/components/LoadingSpinner.jsx
import React from 'react';

function LoadingSpinner({ size = 'md', text = 'Loading...', fullPage = false }) {
  const sizes = { sm: 24, md: 44, lg: 70 };
  const px = sizes[size] || sizes.md;

  const spinner = (
    <div className="d-flex flex-column align-items-center justify-content-center gap-3">
      <div
        style={{
          width: px,
          height: px,
          border: `3px solid rgba(0,106,78,0.2)`,
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {text && (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
          {text}
        </p>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (fullPage) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: '60vh', background: 'var(--dark)' }}
      >
        {spinner}
      </div>
    );
  }

  return spinner;
}

export default LoadingSpinner;
