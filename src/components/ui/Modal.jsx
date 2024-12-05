import React, { useEffect } from 'react';

const Modal = ({ 
  text, 
  description, 
  rightBtn, 
  leftBtn, 
  functionSubmit, 
  handleClose, 
  isOpen 
}) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle keyboard events for accessibility
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, handleClose]);

  // Prevent click propagation to stop closing when clicking inside modal
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div 
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
    onClick={handleClose}
    role="dialog"
    aria-modal="true"
  >
    <div 
      className="border border-neutral-50/30 border-1 bg-neutral-900 w-[400px] max-w-[90%] rounded-2xl shadow-2xl border border-neutral-800 transform transition-all duration-300 ease-in-out origin-center hover:scale-[1.02] focus:scale-[1.02]"
      onClick={stopPropagation}
    >
      <div className="p-6 relative">
        {/* Close button */}
        <button 
          onClick={handleClose}
          className="absolute top-2 right-2 text-neutral-400 hover:text-white transition-colors rounded-full p-2 hover:bg-neutral-700"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Content */}
        <h2 
          className="text-2xl font-semibold text-white mb-3 pb-3 border-b border-neutral-800"
          aria-label={text}
        >
          {text}
        </h2>
        
        <p className="text-neutral-400 mb-6 text-sm leading-relaxed">
          {description}
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-md transition-all duration-200 border border-neutral-700"
            aria-label={leftBtn}
          >
            {leftBtn}
          </button>
          <button
            onClick={functionSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
            aria-label={rightBtn}
          >
            {rightBtn}
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Modal;
