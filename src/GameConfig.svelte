<script>
    import { getContext } from 'svelte';
    import { Collection } from "sveltefire";
    import { push } from 'svelte-spa-router'
    import { getDeck, getPlayerCards } from './Services/DeckManager';
    export let params;

    const db = getContext('firebase').firestore();

    let name = '';
    const addPlayer = (playersRef) => {
        playersRef.add({name});
        name = '';
    };

    const deck = getDeck();

    const setGame = (deck) => {
        const batch = db.batch();

        db.collection(`games/${params.game}/players`).get().then((snapshot) => {
            snapshot.forEach((doc) => {
                batch.update(doc.ref, {cards: getPlayerCards(deck)});
            });
            batch.commit().then(() => {
                let i = 5;
                let pyramid = [];
                let row;
                for (i; i > 0; i--) {
                    row = [];
                    for (let j = 0; j < i; j++) {
                        row.push(deck.pop());
                    }
                    pyramid.push(JSON.stringify(row));
                }

                db.doc(`games/${params.game}`).update({deck: deck, pyramid: pyramid, started: true, current: '0-0'});
            });
        });
    };

    const start = () => {
        setGame(deck);
        push(`/game/${params.game}/play`);
    };

    const getGameLink = () => {
        return window.location.href.replace('config', 'play');
    };
</script>

<Collection path={`games/${params.game}/players`} let:data={players} let:ref={playersRef}>
    <ul>
      {#each players as player}
          <li>{player.name}</li>
      {/each}
    </ul>

    Add player
    <input type="text" bind:value={name}>
    <button on:click={addPlayer(playersRef)}>Add</button>
</Collection>

<p>
    Copy link: {getGameLink()}
</p>
<div>
    <button on:click={start}>Start</button>
</div>
