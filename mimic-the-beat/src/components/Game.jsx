import { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import BeatDisplay from './BeatDisplay';
import KeyboardInput from './KeyboardInput';
import ScoreBoard from './ScoreBoard';
import '../styles/Game.css';

// Sound packs - frequency settings for different sound types
const SOUND_FREQUENCIES = {
  piano: {
    A: 261.63, // C4
    S: 293.66, // D4
    D: 329.63, // E4
    F: 349.23, // F4
  },
  drums: {
    A: 200,    // Lower drum-like tone
    S: 150,    // Bass drum-like tone
    D: 400,    // Higher snare-like tone
    F: 300,    // Mid tom-like tone
  },
  electronic: {
    A: 440,    // A4
    S: 493.88, // B4
    D: 523.25, // C5
    F: 587.33, // D5
  }
};

// Sound types - different oscillator types for each sound pack
const OSCILLATOR_TYPES = {
  piano: 'sine',
  drums: 'triangle',
  electronic: 'sawtooth'
};

// Audio context for sound generation
let audioContext = null;

// Creating synthesized sounds for demo purposes since we don't have actual audio files
const createTone = (frequency, soundPack) => {
  try {
    // Lazy initialize audio context on first user interaction
    if (!audioContext) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioContext = new AudioContext();
      } else {
        console.error('Web Audio API is not supported in this browser');
        return { play: () => {} };
      }
    }
    
    return {
      play: () => {
        try {
          // Create new oscillator for each play call
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          // Use different oscillator types for different sound packs
          oscillator.type = OSCILLATOR_TYPES[soundPack] || 'sine';
          oscillator.frequency.value = frequency;
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          // Adjust envelope based on sound pack
          if (soundPack === 'drums') {
            // Shorter, punchier envelope for drums
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.8, audioContext.currentTime + 0.01);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.2);
          } else if (soundPack === 'electronic') {
            // More pronounced attack and longer release for electronic
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.7, audioContext.currentTime + 0.02);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.4);
          } else {
            // Default envelope for piano
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
          }
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + (soundPack === 'drums' ? 0.2 : 0.4));
        } catch (error) {
          console.error('Error playing tone:', error);
        }
      }
    };
  } catch (error) {
    console.error('Web Audio API not supported or other audio error:', error);
    return { play: () => {} };
  }
};

const KEYS = ['A', 'S', 'D', 'F'];
const INITIAL_LIVES = 3;
const FEVER_THRESHOLD = 5;

function Game({ onGameEnd, initialSoundPack = 'piano' }) {
  // Game state
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [displaySequence, setDisplaySequence] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [feverMode, setFeverMode] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentSoundPack, setCurrentSoundPack] = useState(initialSoundPack);
  
  // Timeout references
  const timeoutRef = useRef(null);
  const beatDisplayRef = useRef(null);
  
  // Initialize game
  useEffect(() => {
    // Start audio context on first interaction
    const initAudio = () => {
      if (!audioContext) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          audioContext = new AudioContext();
        }
      }
      document.removeEventListener('click', initAudio);
      document.removeEventListener('keydown', initAudio);
    };
    
    document.addEventListener('click', initAudio);
    document.addEventListener('keydown', initAudio);
    
    // Play a sample sound of the selected sound pack when game starts
    setTimeout(() => {
      if (audioContext) {
        const demoKey = 'A';
        playAndAnimateKey(demoKey);
      }
    }, 500);
    
    startNewRound();
    
    // Listen for Escape key to exit game
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onGameEnd();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', initAudio);
      document.removeEventListener('keydown', initAudio);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
  
  // Watch for game over
  useEffect(() => {
    if (lives <= 0) {
      setGameOver(true);
    }
  }, [lives]);

  // Generate a new sequence for the round
  const generateSequence = () => {
    const sequenceLength = 2 + Math.floor(level / 2);
    const newSequence = [];
    
    for (let i = 0; i < sequenceLength; i++) {
      const randomKey = KEYS[Math.floor(Math.random() * KEYS.length)];
      newSequence.push(randomKey);
    }
    
    return newSequence;
  };

  // Start a new round
  const startNewRound = () => {
    const newSequence = generateSequence();
    setSequence(newSequence);
    setPlayerSequence([]);
    setDisplaySequence(true);
    setPlayerTurn(false);
    
    // Demonstrate sequence to player
    playSequence(newSequence);
  };
  
  // Synchronized sound and animation for a key
  const playAndAnimateKey = (key) => {
    // Play the sound
    const frequency = SOUND_FREQUENCIES[currentSoundPack][key];
    createTone(frequency, currentSoundPack).play();
    
    // Trigger the animation through the shared beatDisplay control
    if (window.gameControls && window.gameControls.activateBeat) {
      window.gameControls.activateBeat(key);
    }
  };
  
  // Play the sequence for the player to watch/listen
  const playSequence = (seq) => {
    // Display/play each beat with delay between them
    let delay = 0;
    const displaySpeed = Math.max(600 - (level * 20), 300); // Gets faster as level increases
    
    seq.forEach((key, index) => {
      timeoutRef.current = setTimeout(() => {
        // Synchronize sound and animation
        playAndAnimateKey(key);
        
        // If last beat in sequence, switch to player's turn
        if (index === seq.length - 1) {
          timeoutRef.current = setTimeout(() => {
            setDisplaySequence(false);
            setPlayerTurn(true);
          }, displaySpeed);
        }
      }, delay);
      
      delay += displaySpeed;
    });
  };

  // Play a sound for a key
  const playSound = (key) => {
    const frequency = SOUND_FREQUENCIES[currentSoundPack][key];
    createTone(frequency, currentSoundPack).play();
  };

  // Handle player key input
  const handleKeyPress = (key) => {
    if (!playerTurn || gameOver) return;
    
    const newPlayerSequence = [...playerSequence, key];
    setPlayerSequence(newPlayerSequence);
    
    // Use the synchronized method instead of just playSound
    playAndAnimateKey(key);
    
    // Check if player input matches the sequence so far
    const correctSoFar = sequence.slice(0, newPlayerSequence.length).every(
      (seqKey, index) => seqKey === newPlayerSequence[index]
    );
    
    if (!correctSoFar) {
      // Player made a mistake
      setLives(lives - 1);
      setCombo(0);
      setFeverMode(false);
      
      // Small delay then start a new round
      timeoutRef.current = setTimeout(() => {
        if (lives - 1 > 0) startNewRound();
      }, 1000);
      
      return;
    }
    
    // If player has completed the sequence correctly
    if (newPlayerSequence.length === sequence.length) {
      const newCombo = combo + 1;
      const pointsEarned = feverMode ? 10 * level * 2 : 10 * level;
      
      setScore(score + pointsEarned);
      setCombo(newCombo);
      
      // Check if player enters fever mode
      if (newCombo >= FEVER_THRESHOLD && !feverMode) {
        setFeverMode(true);
      }
      
      // Move to next level after short delay
      timeoutRef.current = setTimeout(() => {
        setLevel(level + 1);
        startNewRound();
      }, 1000);
    }
  };

  // Retry the game
  const handleRetry = () => {
    setScore(0);
    setLevel(1);
    setLives(INITIAL_LIVES);
    setCombo(0);
    setFeverMode(false);
    setGameOver(false);
    startNewRound();
  };

  // Change sound pack
  const changeSoundPack = (pack) => {
    setCurrentSoundPack(pack);
    
    // Play a sample of each sound in the new pack
    setTimeout(() => {
      // Play a short demo of the new sound pack using the synchronized method
      const demoKey = 'A';
      playAndAnimateKey(demoKey);
    }, 100);
  };

  return (
    <div className="game-container">
      {gameOver ? (
        <div className="game-over">
          <h2>Game Over</h2>
          <p>Your final score: {score}</p>
          <p>You reached level: {level}</p>
          <div className="game-over-buttons">
            <button onClick={handleRetry}>Play Again</button>
            <button onClick={onGameEnd}>Exit</button>
          </div>
        </div>
      ) : (
        <>
          <ScoreBoard 
            score={score} 
            lives={lives} 
            level={level} 
            combo={combo} 
            feverMode={feverMode}
          />
          
          <BeatDisplay 
            ref={beatDisplayRef}
            sequence={sequence} 
            playerSequence={playerSequence} 
            isDisplaying={displaySequence} 
            feverMode={feverMode} 
          />
          
          <KeyboardInput 
            onKeyPress={handleKeyPress} 
            playerTurn={playerTurn}
            feverMode={feverMode}
          />
          
          <div className="sound-packs">
            <p>Sound Pack:</p>
            <div className="sound-buttons">
              <button 
                className={currentSoundPack === 'piano' ? 'active' : ''} 
                onClick={() => changeSoundPack('piano')}
              >
                Piano
              </button>
              <button 
                className={currentSoundPack === 'drums' ? 'active' : ''} 
                onClick={() => changeSoundPack('drums')}
              >
                Drums
              </button>
              <button 
                className={currentSoundPack === 'electronic' ? 'active' : ''} 
                onClick={() => changeSoundPack('electronic')}
              >
                Electronic
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Game; 