import React from 'react';
import '../style/card.css';

function Card({ card, suit, hide }) {
  return (
    <div className={`card${hide ? ' hidden' : ''}`}>
      {!hide && (
        <>
          <div className="top">
            <span className="value">{card}</span>
            <span className="suit">{suit}</span>
          </div>
          <div className="bottom">
            <span className="suit">{suit}</span>
            <span className="value">{card}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default Card;