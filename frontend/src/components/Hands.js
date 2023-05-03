import React from 'react';
import Card from './Card';
import '../style/hand.css';

function Hand({ hand, hideFirstCard, className }) {
  return (
    <div className={`hand ${className}`}>
      {hand.map((card, index) => (
        <Card key={index} card={card.card} suit={card.suit} hide={hideFirstCard && index === 0} />
      ))}
    </div>
  );
}

export default Hand;
