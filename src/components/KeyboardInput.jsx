import { useState, useEffect, useRef } from 'react';
import '../styles/KeyboardInput.css';

function KeyboardInput({ onKeyPress, playerTurn, feverMode }) {
  const [activeKeys, setActiveKeys] = useState({
    A: false,
    S: false,
    D: false,
    F: false
  });
  
  const keyTimersRef = useRef({});

  // Clear any active key timers
  const clearKeyTimers = () => {
    Object.keys(keyTimersRef.current).forEach(key => {
      if (keyTimersRef.current[key]) {
        clearTimeout(keyTimersRef.current[key]);
        keyTimersRef.current[key] = null;
      }
    });
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();
      
      if (!playerTurn) return;
      
      if (['A', 'S', 'D', 'F'].includes(key)) {
        // Update active key visual
        setActiveKeys(prev => ({ ...prev, [key]: true }));
        
        // Pass key press to parent
        onKeyPress(key);
      }
    };
    
    const handleKeyUp = (e) => {
      const key = e.key.toUpperCase();
      
      if (['A', 'S', 'D', 'F'].includes(key)) {
        // Clear any existing timer to prevent conflicts
        if (keyTimersRef.current[key]) {
          clearTimeout(keyTimersRef.current[key]);
        }
        
        // Set a short timeout to ensure the animation is visible
        // This helps synchronize with the sound duration
        keyTimersRef.current[key] = setTimeout(() => {
          setActiveKeys(prev => ({ ...prev, [key]: false }));
        }, 150);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearKeyTimers();
    };
  }, [playerTurn, onKeyPress]);

  // Reset keys when player turn changes
  useEffect(() => {
    if (!playerTurn) {
      // Reset all keys when it's not player's turn
      setActiveKeys({
        A: false,
        S: false,
        D: false,
        F: false
      });
    }
  }, [playerTurn]);
  
  // Handle button clicks (for mobile/touch support)
  const handleButtonClick = (key) => {
    if (!playerTurn) return;
    
    // Clear any existing timers for this key
    if (keyTimersRef.current[key]) {
      clearTimeout(keyTimersRef.current[key]);
    }
    
    // Simulate key press
    setActiveKeys(prev => ({ ...prev, [key]: true }));
    onKeyPress(key);
    
    // Reset after animation time - slightly longer for better visual feedback
    keyTimersRef.current[key] = setTimeout(() => {
      setActiveKeys(prev => ({ ...prev, [key]: false }));
    }, 150);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearKeyTimers();
    };
  }, []);

  return (
    <div className={`keyboard-input ${playerTurn ? 'active' : 'inactive'} ${feverMode ? 'fever-mode' : ''}`}>
      <div className="keyboard-instructions">
        {playerTurn ? 'Press keys to repeat the sequence' : 'Wait for your turn...'}
      </div>
      
      <div className="keyboard-keys">
        {['A', 'S', 'D', 'F'].map(key => (
          <button
            key={key}
            className={`key-button ${activeKeys[key] ? 'active' : ''}`}
            onClick={() => handleButtonClick(key)}
            disabled={!playerTurn}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}

export default KeyboardInput; 