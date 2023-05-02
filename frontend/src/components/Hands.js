import React from 'react';
import Card from './Card';

function Hand({ hand, hideFirstCard }) {
  return (
    <div>
      {hand.map((card, index) => (
        <Card key={index} card={card.card} suit={card.suit} hide={hideFirstCard && index === 0} />
      ))}
    </div>
  );
}

export default Hand;
