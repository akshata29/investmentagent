import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Brand bar that shows a Fisher Investments styled logo when the 'customer' theme is active.
 * The logo is an inline SVG approximation to avoid licensing/shipping trademarked assets.
 */
export const Brand: React.FC = () => {
  const { theme } = useTheme();
  const [imgOk, setImgOk] = useState(true);
  const [src, setSrc] = useState('/fi.png');

  if (theme !== 'customer') return null;

  return (
    <div className="brand-bar">
    {/* Try to load customer logo from public root (/fi.png) or common image. Fallback to inline mark if missing. */}
      {imgOk ? (
        <img
          className="brand-img"
          src={src}
          alt="Customer logo"
          onError={() => {
            if (src === '/fi.png') setSrc('common/images/fi.png');
            else setImgOk(false);
          }}
        />
      ) : (
        <svg className="brand-logo" viewBox="0 0 64 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <g fill="none" fillRule="evenodd">
            <rect width="64" height="24" rx="4" fill="transparent" />
            <g transform="translate(8,4)">
              <path d="M8 14c6-2 10-6 12-12-6 2-10 6-12 12z" fill="var(--color-primary)"/>
              <circle cx="28" cy="8" r="5" stroke="var(--color-primary)" strokeWidth="2" fill="none"/>
            </g>
          </g>
        </svg>
      )}
    </div>
  );
};
