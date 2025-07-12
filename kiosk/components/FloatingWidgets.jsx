import React, { useState } from 'react';
import AppointmentBot from './AppointmentBot';
import DiseasePredictor from './DiseasePredictor';

const FloatingWidgets = () => {
  const [showPredictor, setShowPredictor] = useState(false);
  const [showBot, setShowBot] = useState(false);

  return (
    <>
      {/* Floating Buttons Row */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-row gap-4">
        {/* Disease Predictor Button */}
        {!showPredictor && (
          <button
            onClick={() => setShowPredictor(true)}
            className="bg-emerald-700 text-white rounded-full shadow px-5 py-3 font-semibold text-base hover:bg-emerald-800 focus:outline-none flex items-center gap-2 border-4 border-emerald-900"
            style={{ boxShadow: '0 2px 8px #0002' }}
            aria-label="Open Disease Predictor"
          >
            🧬 Disease Predictor
          </button>
        )}
        {/* AppointmentBot Button (only show if not open) */}
        {!showBot && (
          <button
            onClick={() => setShowBot(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center text-2xl focus:outline-none border-4 border-emerald-900"
            aria-label="Open Appointment Chatbot"
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3C6.477 3 2 6.797 2 11c0 1.61.67 3.11 1.85 4.36-.13.98-.53 2.09-1.36 3.13a1 1 0 0 0 1.11 1.56c2.13-.37 3.77-1.13 4.91-1.8A13.6 13.6 0 0 0 12 18c5.523 0 10-3.797 10-7s-4.477-8-10-8Z"/></svg>
          </button>
        )}
      </div>

      {/* Disease Predictor Side Panel */}
      {showPredictor && (
        <div className="fixed inset-0 z-50 flex justify-end items-stretch">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowPredictor(false)}
          />
          {/* Side Panel */}
          <div className="relative h-full w-full max-w-xs sm:max-w-sm md:max-w-md bg-transparent flex flex-col">
            <div className="absolute right-0 top-0 h-full flex flex-col">
              <div className="mt-8 mr-4">
                <button
                  onClick={() => setShowPredictor(false)}
                  className="text-emerald-400 hover:text-emerald-200 text-2xl bg-transparent rounded-full focus:outline-none absolute top-2 right-2 z-10"
                  aria-label="Close Disease Predictor"
                >
                  ×
                </button>
                <DiseasePredictor isPanel />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AppointmentBot Floating Panel */}
      {showBot && (
        <div className="fixed bottom-6 right-6 z-50">
          <AppointmentBot openFromParent={showBot} setOpenFromParent={setShowBot} />
        </div>
      )}
    </>
  );
};

export default FloatingWidgets; 