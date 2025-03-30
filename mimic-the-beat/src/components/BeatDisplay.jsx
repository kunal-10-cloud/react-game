import { useState, useEffect, useRef } from 'react';
import '../styles/BeatDisplay.css';

function BeatDisplay({ sequence, playerSequence, isDisplaying, feverMode }) {
  const [activeBeats, setActiveBeats] = useState([false, false, false, false]);
  const keyMap = { A: 0, S: 1, D: 2, F: 3 };
  const animationRef = useRef(null);
  
  // Handle beat animation during sequence display
  useEffect(() => {
    if (!isDisplaying) {
      setActiveBeats([false, false, false, false]);
      return;
    }
    
    // We don't animate here anymore - the animation is now driven by the parent
    // This prevents the timing mismatch
  }, [isDisplaying]);
  
  // Explicitly activate a beat - called by the parent component
  const activateBeat = (key) => {
    if (!key) return;
    
    const keyIndex = keyMap[key];
    if (keyIndex === undefined) return;
    
    // Clear any previous animations
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    
    // Set the active beat
    const newActiveBeats = [false, false, false, false];
    newActiveBeats[keyIndex] = true;
    setActiveBeats(newActiveBeats);
    
    // Clear the beat after animation time
    animationRef.current = setTimeout(() => {
      setActiveBeats([false, false, false, false]);
    }, 200);
  };
  
  // Show active beat based on player input
  useEffect(() => {
    if (isDisplaying || playerSequence.length === 0) return;
    
    const lastKey = playerSequence[playerSequence.length - 1];
    activateBeat(lastKey);
    
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [playerSequence]);
  
  // Expose the activateBeat method to parent component
  useEffect(() => {
    // Make the activateBeat function available to the parent (Game component)
    if (window.gameControls) {
      window.gameControls.activateBeat = activateBeat;
    } else {
      window.gameControls = { activateBeat };
    }
    
    return () => {
      if (window.gameControls) {
        window.gameControls.activateBeat = null;
      }
    };
  }, []);

  return (
    <div className={`beat-display ${feverMode ? 'fever-mode' : ''}`}>
      <div className="track-container">
        <div className="beat-tracks">
          {['A', 'S', 'D', 'F'].map((key, index) => (
            <div 
              key={key}
              className={`beat-track ${activeBeats[index] ? 'active' : ''}`}
            >
              <div className={`beat ${activeBeats[index] ? 'pulse' : ''}`}>
                {key}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="sequence-indicator">
        {isDisplaying ? (
          <div className="watching">Watch the sequence...</div>
        ) : (
          <div className="your-turn">Your turn!</div>
        )}
      </div>
    </div>
  );
}

export default BeatDisplay; 