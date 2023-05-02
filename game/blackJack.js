import { createInterface } from 'readline';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

const CARDS = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
const SUITS = ['♠', '♣', '♦', '♥'];
let playerHand;
let dealerHand;
let splitHand1;
let splitHand2;
let deck;

function createDeck() {
  let deck = [];
  for (let suit of SUITS) {
    for (let card of CARDS) {
      deck.push({card, suit, value: getValue(card)});
    }
  }
  return deck;
}

function getValue(card) {
  if (card === 'A') return 11;
  if (['K', 'Q', 'J'].includes(card)) return 10;
  return parseInt(card);
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function drawCard(deck) {
  return deck.pop();
}

function getHandValue(hand) {
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
}

function displayHand(hand) {
  return hand.map(card => `${card.card}${card.suit}`).join(' ');
}

function displayDealerHand(hand) {
  return `${hand[0].card}${hand[0].suit} X`;
}



function playGame() {
  deck = shuffleDeck(createDeck());

  playerHand = [drawCard(deck), drawCard(deck)];
  dealerHand = [drawCard(deck), drawCard(deck)];

  console.log("Bienvenue au Blackjack!");
  playerTurn();
}

  function playerTurn() {
    console.log(`La main du dealer: ${displayDealerHand(dealerHand)}`);
    console.log(`Votre main: ${displayHand(playerHand)} (Valeur: ${getHandValue(playerHand)})`);

    const canSplit = playerHand.length === 2 && playerHand[0].value === playerHand[1].value;
    const question = canSplit
      ? 'Souhaitez-vous tirer une carte (h), rester (s) ou split (p) ?'
      : 'Souhaitez-vous tirer une carte (h) ou rester (s) ?';

    rl.question(question, (answer) => {
      if (answer.toLowerCase() === 'h') {
        playerHand.push(drawCard(deck));
        const handValue = getHandValue(playerHand);
        if (handValue > 21) {
          console.log(`Votre main: ${displayHand(playerHand)} (Valeur: ${handValue})`);
          console.log("Vous avez dépassé 21, vous avez perdu.");
          rl.close();
          } else {
          playerTurn();
          }
          } else if (answer.toLowerCase() === 'p' && canSplit) {
          splitTurn();
          } else {
          dealerTurn();
          }
          });
  }


        
        function splitTurn() {
        const hand1 = [playerHand[0], drawCard(deck)];
        const hand2 = [playerHand[1], drawCard(deck)];
        
        console.log("Vous avez choisi de split.");
        console.log(`Main 1: ${displayHand(hand1)} (Valeur: ${getHandValue(hand1)})`);
        console.log(`Main 2: ${displayHand(hand2)} (Valeur: ${getHandValue(hand2)})`);
        splitHand1 = hand1;
        splitHand2 = hand2;
        
        // Gérer chaque main séparée
        handleSplitHand(hand1, 1, () => {
        handleSplitHand(hand2, 2, dealerTurn);
        });
        }
        
        function handleSplitHand(hand, handNumber, callback) {
        console.log('Tour de la main ${handNumber}: ${displayHand(hand)} (Valeur: ${getHandValue(hand)})');
        
        rl.question('Souhaitez-vous tirer une carte (h) ou rester (s) ?', (answer) => {
        if (answer.toLowerCase() === 'h') {
        hand.push(drawCard(deck));
        const handValue = getHandValue(hand);
        if (handValue > 21) {
          console.log(`Main ${handNumber}: ${displayHand(hand)} (Valeur: ${handValue})`);
          console.log(`La main ${handNumber} a dépassé 21, vous avez perdu.`);
          callback();
        } else {
        handleSplitHand(hand, handNumber, callback);
        }
        } else {
        callback();
        }
        });
        }
        
        function dealerTurn() {
          console.log(`La main du dealer: ${displayHand(dealerHand)} (Valeur: ${getHandValue(dealerHand)})`);
        
        if (getHandValue(dealerHand) < 17) {
        console.log("Le dealer tire une carte.");
        dealerHand.push(drawCard(deck));
        dealerTurn();
        } else {
        endGame();
        }
        }
        
        function endGame() {
          const playerValue = getHandValue(playerHand);
          const dealerValue = getHandValue(dealerHand);
        
          console.log(`Votre main: ${displayHand(playerHand)} (Valeur: ${playerValue})`);
          console.log(`La main du dealer: ${displayHand(dealerHand)} (Valeur: ${dealerValue})`);
        
          if (dealerValue > 21 || playerValue > dealerValue) {
            console.log("Vous avez gagné !");
          } else if (dealerValue === playerValue) {
            console.log("Égalité !");
          } else {
            console.log("Le dealer a gagné.");
          }
        
          if (splitHand1 && splitHand2) {
            const splitHand1Value = getHandValue(splitHand1);
            const splitHand2Value = getHandValue(splitHand2);
        
            console.log(`Main 1: ${displayHand(splitHand1)} (Valeur: ${splitHand1Value})`);
            console.log(`Main 2: ${displayHand(splitHand2)} (Valeur: ${splitHand2Value})`);
        
            const results1 = getResult(splitHand1Value, dealerValue);
            const results2 = getResult(splitHand2Value, dealerValue);
        
            console.log(`Résultat de la main 1: ${results1}`);
            console.log(`Résultat de la main 2: ${results2}`);
          }
        
          rl.question('Voulez-vous rejouer ? (y/n) ', (answer) => {
            if (answer.toLowerCase() === 'y') {
              playGame();
            } else {
              console.log("Merci d'avoir joué !");
              rl.close();
            }
          });
        }


        
        function getResult(playerValue, dealerValue) {
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
        }
        playGame();
