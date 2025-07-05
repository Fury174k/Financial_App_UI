import React, { useEffect, useState, useRef } from 'react';
import notificationBellAnimation from '../assets/NotificationBell.json';
import notificationPopSound from '../assets/NotificationPop.wav';
import Lottie from 'lottie-react';

const Alert = ({ 
  message, 
  type = 'info', 
  onClose, 
  enableSound = true,
  enableAnimation = true,
  position = 'top-right', // default to top-right for best compatibility
  duration = 3000 
}) => {
  const [show, setShow] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  // Create audio elements for different notification types
  useEffect(() => {
    if (enableSound) {
      audioRef.current = new Audio(notificationPopSound);
    }
  }, [enableSound]);

  useEffect(() => {
    if (message) {
      setShow(true);
      // Small delay to trigger entrance animation
      setTimeout(() => setIsVisible(true), 50);
      
      // Play notification sound
      if (enableSound && audioRef.current) {
        try {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        } catch (error) {
          console.log('Audio play failed:', error);
        }
      }
      // Haptic feedback for mobile
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([40, 30, 40]); // short vibration pattern
      }
      // Auto-hide timer
      timerRef.current = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    } else {
      setShow(false);
      setIsVisible(false);
    }
  }, [message, duration, enableSound]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShow(false);
      if (onClose) onClose();
    }, 300); // Wait for exit animation
  };

  if (!message || !show) return null;

  // Alert type configurations
  const alertConfigs = {
    success: {
      color: 'bg-green-50 text-green-800 border-green-200 shadow-green-100',
      icon: '✓',
      iconBg: 'bg-green-500'
    },
    error: {
      color: 'bg-red-50 text-red-800 border-red-200 shadow-red-100',
      icon: '⚠',
      iconBg: 'bg-red-500'
    },
    warning: {
      color: 'bg-yellow-50 text-yellow-800 border-yellow-200 shadow-yellow-100',
      icon: '!',
      iconBg: 'bg-yellow-500'
    },
    info: {
      color: 'bg-blue-50 text-blue-800 border-blue-200 shadow-blue-100',
      icon: 'i',
      iconBg: 'bg-blue-500'
    }
  };

  const config = alertConfigs[type] || alertConfigs.info;

  // Position classes
  const positionClasses = {
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className={`fixed inset-0 z-40 bg-black/10 transition-opacity duration-300 md:hidden ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
      />
      
      {/* Alert Container */}
      <div
        className={`
          fixed z-50 
          ${positionClasses[position] || positionClasses['top-right']}
          transition-all duration-300 ease-out
          ${isVisible 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
          }
          w-[calc(100vw-2rem)] max-w-sm mx-4
          sm:w-auto sm:min-w-80 sm:max-w-md sm:mx-0
          ${position.includes('top') ? 'top-4 sm:top-8' : ''}
          ${position.includes('bottom') ? 'bottom-4 sm:bottom-8' : ''}
        `}
        role="alert"
        aria-live="polite"
        aria-atomic="true"
      >
        <div
          className={`
            ${config.color}
            border rounded-xl shadow-lg backdrop-blur-sm
            px-4 py-3 sm:px-6 sm:py-4
            flex items-start gap-3
            relative overflow-hidden
            transform transition-transform duration-200 hover:scale-[1.02]
          `}
        >
          {/* Background Gradient Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-white/20 to-transparent" />
          
          {/* Icon/Animation Container */}
          <div className="relative z-10 flex-shrink-0">
            {enableAnimation ? (
              <Lottie
                animationData={notificationBellAnimation}
                loop={false}
                autoplay={true}
                style={{ width: 24, height: 24 }}
              />
            ) : (
              <div className={`
                w-6 h-6 rounded-full ${config.iconBg} 
                flex items-center justify-center text-white text-sm font-bold
                animate-pulse
              `}>
                {config.icon}
              </div>
            )}
          </div>
          
          {/* Message Content */}
          <div className="relative z-10 flex-1 min-w-0">
            <p className="text-sm font-medium leading-relaxed break-words sm:text-base">
              {message}
            </p>
          </div>
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className={`
              flex-shrink-0 relative z-10
              w-6 h-6 rounded-full 
              flex items-center justify-center
              text-current opacity-60 hover:opacity-100
              transition-all duration-200
              hover:bg-current/10 focus:bg-current/10
              focus:outline-none focus:ring-2 focus:ring-current/20
              active:scale-95
            `}
            aria-label="Close notification"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
          
          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden bg-current/10">
            <div 
              className="h-full transition-all ease-linear bg-current/30"
              style={{
                width: '100%',
                animation: `shrink ${duration}ms linear forwards`
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        /* Mobile touch improvements */
        @media (max-width: 640px) {
          button {
            min-height: 44px;
            min-width: 44px;
          }
        }
        
        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
};

export default Alert;