import { useState, useEffect } from 'react';
import './App.css';
import Game from './components/Game';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedSoundPack, setSelectedSoundPack] = useState('piano');
  
  return (
    <div className="app-container">
      <h1>Mimic the Beat</h1>
      
      {!gameStarted ? (
        <div className="start-screen">
          <h2>Ready to test your rhythm skills?</h2>
          <p>Listen to the beat sequence and repeat it using your keyboard.</p>
          <p>Use keys: <span className="key">A</span> <span className="key">S</span> <span className="key">D</span> <span className="key">F</span></p>
          <p>You have 3 lives. Good luck!</p>
          
          <div className="sound-pack-selection">
            <h3>Choose your sound pack:</h3>
            <div className="sound-buttons">
              <button 
                className={`sound-button ${selectedSoundPack === 'piano' ? 'active' : ''}`} 
                onClick={() => setSelectedSoundPack('piano')}
              >
                Piano
              </button>
              <button 
                className={`sound-button ${selectedSoundPack === 'drums' ? 'active' : ''}`} 
                onClick={() => setSelectedSoundPack('drums')}
              >
                Drums
              </button>
              <button 
                className={`sound-button ${selectedSoundPack === 'electronic' ? 'active' : ''}`} 
                onClick={() => setSelectedSoundPack('electronic')}
              >
                Electronic
              </button>
            </div>
          </div>
          
          <button 
            className="start-button" 
            onClick={() => setGameStarted(true)}
          >
            Start Game
          </button>
        </div>
      ) : (
        <Game 
          onGameEnd={() => setGameStarted(false)} 
          initialSoundPack={selectedSoundPack} 
        />
      )}
      
      <footer>
        <p>Created with React | Press ESC to exit the game</p>
      </footer>
    </div>
  );
}

export default App;
