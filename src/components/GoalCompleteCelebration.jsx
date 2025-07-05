import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';
import confettiSound from '../assets/Celebration.wav'; // Place in /public or /src/sounds
import confettiGif from '../assets/Confetti.json'; // Optional GIF fallback

const GoalCompleteCelebration = ({ show, onClose }) => {
  useEffect(() => {
    if (show) {
      const sound = new Howl({
        src: [confettiSound],
        volume: 0.7,
      });
      sound.play();
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative p-8 text-center bg-white shadow-xl rounded-2xl"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <img src={confettiGif} alt="Confetti" className="w-40 h-40 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600">🎉 Goal Completed!</h2>
            <p className="mt-2 text-gray-700">Awesome job hitting your savings target.</p>
            <button
              onClick={onClose}
              className="px-4 py-2 mt-4 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Nice!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GoalCompleteCelebration;
