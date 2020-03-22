const suits = ["spades", "diamonds", "clubs", "hearts"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const buildDeck = () => {
  const deck = [];
  let i = 0;

  for (i; i < suits.length; i++) {
    for (let x = 0; x < values.length; x++) {
      deck.push({value: values[x], suit: suits[i], discovered: false, forceShow: false});
    }
  }

  return deck;
};

const shuffle = (deck) => {
  let location1, location2, tmp, i = 0;
  // for 1000 turns
  // switch the values of two random cards
  for (i; i < 1000; i++) {
    location1 = Math.floor((Math.random() * deck.length));
    location2 = Math.floor((Math.random() * deck.length));
    tmp = deck[location1];

    deck[location1] = deck[location2];
    deck[location2] = tmp;
  }
};

export function getDeck() {
  let deck = buildDeck();
  shuffle(deck);

  return deck;
}

export function getPlayerCards(deck) {
  let i = 0;
  const cards = [];

  for (i; i < 4; i++) {
    cards.push(deck.pop());
  }

  return cards;
}
