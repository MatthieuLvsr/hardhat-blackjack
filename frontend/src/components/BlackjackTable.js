import React, { useState, useEffect } from 'react';
import Hand from './Hands';
import Card from './Card';
import Button from './Button';  // Importez le composant Bet
import '../style/BlackjackTable.css';
import { Bet } from './Bet'; 
import { Dapp } from './Dapp';



const CARDS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const SUITS = ['♠', '♣', '♦', '♥'];

function BlackjackTable({betTokens,winTokens,drawTokens,loseTokens,tokenSymbol}) {

  // console.log(betTokens);
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [splitHand1, setSplitHand1] = useState([]);
  const [splitHand2, setSplitHand2] = useState([]);
  const [dealerCardHidden, setDealerCardHidden] = useState(true);
  const [hasBet, setHasBet] = useState(true);
  const [newBetPlaced, setNewBetPlaced] = useState(false);


  useEffect(() => {
    startGame();
  }, []);

  // Les fonctions de logique de jeu ont été légèrement modifiées pour fonctionner avec React
  // (par exemple, en utilisant des états et des mises à jour d'état)

  const createDeck = () => {
    let deck = [];
    for (let suit of SUITS) {
      for (let card of CARDS) {
        deck.push({ card, suit, value: getValue(card) });
      }
    }
    return deck;
  };

  const getValue = (card) => {
    if (card === 'A') return 11;
    if (['K', 'Q', 'J'].includes(card)) return 10;
    return parseInt(card);
  };

  const shuffleDeck = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  };

  const drawCard = (deck) => {
    return deck.pop();
  };

  const getHandValue = (hand) => {
    let value = 0;
    let aces = 0;

    for (let card of hand) {
      value += card.value;
      if (card.card === 'A') aces++;
    }

    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }

    return value;
  };

  const getResult = (playerValue, dealerValue) => {
    if (playerValue > 21) {
      return "Perdu";
    }
    if (dealerValue > 21 || playerValue > dealerValue) {
      return "Gagné";
    }
    if (dealerValue === playerValue) {
      return "Égalité";
    }
    return "Perdu";
  };

  const startGame = () => {
    const shuffledDeck = shuffleDeck(createDeck());
    const initialPlayerHand = [drawCard(shuffledDeck), drawCard(shuffledDeck)];
    const initialDealerHand = [drawCard(shuffledDeck), drawCard(shuffledDeck)];

    setDeck(shuffledDeck);
    setPlayerHand(initialPlayerHand);
    setDealerHand(initialDealerHand);
    setGameOver(false);
    setResultMessage('');
    setDealerCardHidden(true);
    setSplitHand1([]);
    setSplitHand2([]);
  };

  const handleBetPlaced = () => {
    setNewBetPlaced(true);
    setHasBet(true);
  };  

  const handleDrawCard = () => {
    const newPlayerHand = [...playerHand, drawCard(deck)];
    const handValue = getHandValue(newPlayerHand);

    if (handValue > 21) {
      setGameOver(true);
      setResultMessage('Vous avez dépassé 21, vous avez perdu.');
    } else {
      setPlayerHand(newPlayerHand);
    }
  };

  const handleStay = () => {
    dealerTurn();
  };

  const dealerTurn = () => {
    setDealerCardHidden(false);

    let newDealerHand = [...dealerHand];

    while (getHandValue(newDealerHand) < 17) {
      newDealerHand.push(drawCard(deck));
    }

    setDealerHand(newDealerHand);
    endGame();
  };

  const canSplit = () => {
    return (
      playerHand.length === 2 &&
      playerHand[0].value === playerHand[1].value
    );
  };  

  const handleSplit = () => {
    const newSplitHand1 = [playerHand[0], drawCard(deck)];
    const newSplitHand2 = [playerHand[1], drawCard(deck)];
  
    setSplitHand1(newSplitHand1);
    setSplitHand2(newSplitHand2);
  
    // Remplacez la main du joueur par la première main splittée
    setPlayerHand(newSplitHand1);
  };  

  const endGame = () => {
    const playerValue = getHandValue(playerHand);
    const dealerValue = getHandValue(dealerHand);
    let result = '';
  
    if (splitHand1.length > 0 && splitHand2.length > 0) {
      const splitHand1Value = getHandValue(splitHand1);
      const splitHand2Value = getHandValue(splitHand2);
      result += `Main 1: ${getResult(splitHand1Value, dealerValue)}\n`;
      result += `Main 2: ${getResult(splitHand2Value, dealerValue)}`;
    } else {
      result = getResult(playerValue, dealerValue);
    }
    if (playerValue > 21) {
      loseTokens()
    }else if (dealerValue > 21 || playerValue > dealerValue) {
      winTokens()
    }else if (dealerValue === playerValue) {
      drawTokens()
    }else loseTokens();
  
    setResultMessage(result);
    setGameOver(true);
  };
  
  const handleRestart = () => {
    if (newBetPlaced) {
      startGame();
      setNewBetPlaced(false);
    } else {
      setHasBet(false);
    }
  };
  

  return (
    <div className="blackjack-table">
      <h1>Bienvenue au Blackjack !</h1>

        <><h2>Dealer</h2>
        <Hand hand={dealerHand} hideFirstCard={dealerCardHidden} />
        <h2>Player</h2>
        <Hand hand={playerHand} />
    
        {splitHand1.length > 0 && splitHand2.length > 0 && (
          <>
            <h2>Split Hand 1</h2>
            <Hand hand={splitHand1} />
            <h2>Split Hand 2</h2>
            <Hand hand={splitHand2} />
          </>
        )}
        {!gameOver ? (
          <>
            <div className="buttons">
              <Button onClick={handleDrawCard}>Tirer une carte</Button>
              {canSplit() && <Button onClick={handleSplit}>Split</Button>}
              <Button onClick={handleStay}>Rester</Button>
            </div>
          </>
        ) : (
          <>
            <p className="result-message">{resultMessage}</p>
            <Button onClick={handleRestart}>Rejouer</Button>
          </>
        )}</>

{!hasBet ? (<Bet betTokens={betTokens} tokenSymbol={tokenSymbol} onBetPlaced={handleBetPlaced} />) :""}
      
    </div>
  );
}


export default BlackjackTable;