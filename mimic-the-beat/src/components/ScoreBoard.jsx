import React from 'react';
import '../styles/ScoreBoard.css';

function ScoreBoard({ score, lives, level, combo, feverMode }) {
  // Render heart icons for lives
  const renderLives = () => {
    const hearts = [];
    
    for (let i = 0; i < 3; i++) {
      if (i < lives) {
        hearts.push(<span key={i} className="heart">❤️</span>);
      } else {
        hearts.push(<span key={i} className="heart empty">🖤</span>);
      }
    }
    
    return hearts;
  };

  return (
    <div className={`score-board ${feverMode ? 'fever-mode' : ''}`}>
      <div className="score-container">
        <div className="score-item">
          <span className="score-label">Score</span>
          <span className="score-value">{score}</span>
        </div>
        
        <div className="score-item">
          <span className="score-label">Level</span>
          <span className="score-value">{level}</span>
        </div>
        
        <div className="score-item">
          <span className="score-label">Lives</span>
          <span className="score-value lives-container">
            {renderLives()}
          </span>
        </div>
        
        <div className="score-item">
          <span className="score-label">Combo</span>
          <span className={`score-value ${combo >= 5 ? 'combo-highlight' : ''}`}>
            {combo}x
            {feverMode && <span className="fever-badge">FEVER!</span>}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ScoreBoard; 