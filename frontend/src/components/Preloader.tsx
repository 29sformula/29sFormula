'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import styles from './Preloader.module.css';

const ONES = Array.from({ length: 101 }, (_, i) => i % 10);
const TENS = ['\u00A0', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const HUNDREDS = ['\u00A0', '1'];

export default function Preloader() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isExpanding, setIsExpanding] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      setLoading(false);
      return;
    }

    // Reset state for new page load or route change
    setLoading(true);
    setProgress(0);
    setIsExpanding(false);
    setIsFadingOut(false);

    let currentProgress = 0;
    let isLoaded = false;
    let interval: NodeJS.Timeout;

    const checkActualLoad = async () => {
      const waitWindowLoad = new Promise((resolve) => {
        if (document.readyState === 'complete') {
          resolve(true);
        } else {
          window.addEventListener('load', resolve);
        }
      });

      const waitFonts = document.fonts ? document.fonts.ready : Promise.resolve();

      // Wait for both the DOM/Assets and the Web Fonts to completely load
      await Promise.all([waitWindowLoad, waitFonts]);
      isLoaded = true;
    };

    checkActualLoad();

    interval = setInterval(() => {
      if (!isLoaded && currentProgress < 99) {
        // Smoothly increase, slowing down slightly near the end
        const increment = currentProgress > 80 ? 0.15 : 0.8;
        currentProgress += increment;
      } else if (isLoaded) {
        // Fast finish when resources are loaded (or during soft navigation)
        currentProgress += 2.5;
      }

      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        clearInterval(interval);

        // Wait 300ms for the 100% slide animation to finish, plus 400ms of rest time (700ms total)
        setTimeout(() => {
          setIsExpanding(true);

          // Wait for the full expand animation (700ms) to complete before fading out the container
          setTimeout(() => {
            setIsFadingOut(true);

            // Wait for fade out to complete before removing from DOM
            setTimeout(() => {
              setLoading(false);
            }, 800); // Matches .fadeOut transition duration
          }, 800);
        }, 700);
      } else {
        setProgress(currentProgress);
      }
    }, 16); // ~60fps for smooth counter

    // Fallback just in case load events fail
    const fallbackTimeout = setTimeout(() => {
      isLoaded = true;
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(fallbackTimeout);
    };
  }, [pathname, isAdmin]);

  if (!loading || isAdmin) return null;

  const displayProgress = Math.floor(progress);

  const getExitStyle = (reverseIndex: number) => {
    if (!isExpanding) return {};
    const duration = 0.4 + reverseIndex * 0.25;
    return {
      transition: `transform ${duration}s cubic-bezier(0.55, 0.085, 0.68, 0.53), opacity ${duration * 0.8}s ease`,
      transform: 'translateY(120px)',
      opacity: 0
    };
  };

  return (
    <div className={`${styles.preloaderContainer} ${isFadingOut ? styles.fadeOut : ''}`}>
      <div className={`${styles.centerWrapper} ${isExpanding ? styles.expand : ''}`}>
        <div className={styles.rectangleOutline}>
          <div
            className={styles.rectangleFill}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className={styles.bottomLeftText}>
        {/* HUNDREDS */}
        <div style={{
          opacity: displayProgress >= 100 ? 1 : 0,
          overflow: 'hidden',
          height: '1.2em',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          ...getExitStyle(2)
        }}>
          <div style={{
            transform: `translateY(calc(-${Math.floor(displayProgress / 100)}em + 0.1em))`,
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            {HUNDREDS.map((val, i) => (
              <div key={i} style={{ height: '1em' }}>{val}</div>
            ))}
          </div>
        </div>

        {/* TENS */}
        <div style={{
          opacity: displayProgress >= 10 ? 1 : 0,
          overflow: 'hidden',
          height: '1.2em',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          ...getExitStyle(1)
        }}>
          <div style={{
            transform: `translateY(calc(-${Math.floor(displayProgress / 10)}em + 0.1em))`,
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            {TENS.map((val, i) => (
              <div key={i} style={{ height: '1em' }}>{val}</div>
            ))}
          </div>
        </div>

        {/* ONES */}
        <div style={{
          overflow: 'hidden',
          height: '1.2em',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          ...getExitStyle(0)
        }}>
          <div style={{
            transform: `translateY(calc(-${displayProgress}em + 0.1em))`,
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            {ONES.map((val, i) => (
              <div key={i} style={{ height: '1em' }}>{val}</div>
            ))}
          </div>
        </div>

        <span
          className={styles.percentSymbol}
          style={isExpanding ? {
            transition: `transform 0.25s cubic-bezier(0.55, 0.085, 0.68, 0.53), opacity 0.2s ease`,
            transform: 'translateY(120px)',
            opacity: 0
          } : {}}
        >
          %
        </span>
      </div>
    </div>
  );
}
