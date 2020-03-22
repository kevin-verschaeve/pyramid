<script>
    import { Collection } from "sveltefire";
    import { getContext } from 'svelte';
    import { push } from 'svelte-spa-router';
    import Pyramid from './Pyramid.svelte';
    import Card from './Card.svelte';
    export let params;

    const db = getContext('firebase').firestore();

    db.doc(`games/${params.game}`).get().then((doc) => {
        if (!doc.exists || !doc.data().started) {
            push('/');
        }
    });

    let choosed = false;
    let myCards;
    let me = localStorage.getItem('me');
    let ready = false;
    const setPlayer = (player) => {
        localStorage.setItem('me', player.name);
        me = player.name;
        choosed = true;
        db.doc(`games/${params.game}/players/${player.ref.id}`).get().then((doc) => {
            myCards = doc.data().cards;
        });
    };

    const discover = (player, card) => {
        if (player.name != me) {
            return;
        }

        for (let c in player.cards) {
            if (player.cards[c] == card) {
                player.cards[c].discovered = true;
            }
        }
        player.ref.update({cards: player.cards});
    };

    const isPlayer = (players, name) => {
        return players.findIndex((p) => p.name == name) > -1;
    };

    const changeCard = (player, card) => {
        if (player.name != me) {
            return;
        }

        db.doc(`games/${params.game}`).get().then((doc) => {
            let deck = doc.data().deck;
            const newCard = deck.shift();
            for (let c in player.cards) {
                if (player.cards[c] == card) {
                    newCard.forceShow = true;
                    player.cards[c] = newCard;
                    card.discovered = false;
                    deck.push(card);
                }
            }

            db.doc(`games/${params.game}`).update({deck});
            player.ref.update({cards: player.cards}).then(() => {
                setTimeout(() => {
                    for (let c in player.cards) {
                        if (player.cards[c] == newCard) {
                            newCard.forceShow = false;
                            player.cards[c] = newCard;
                        }
                    }
                    player.ref.update({cards: player.cards});
                }, 5000);
            });
        });
    };
</script>

<Collection path={`games/${params.game}/players`} let:data={players} let:ref={playersRef}>
{#if me && ready && isPlayer(players, me)}
    <div id="game">
        <div id="players">
            {#each players as player}
                <p class="player-name">{player.name}</p>
                <div class="player-cards">
                    {#each player.cards as card}
                        <div class="card-wrapper">
                            {#if card.discovered || (card.forceShow && me == player.name)}
                                <Card {card}/>
                                {#if card.discovered && me == player.name}
                                    <button class="btn-change-card" on:click={changeCard(player, card)}>Change</button>
                                {/if}
                            {:else}
                                <div class="card card-hidden" class:discoverable={me == player.name} on:click={discover(player, card)}></div>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
        <Pyramid gameId={params.game}/>
    </div>
{:else}
    {#if !choosed}
        Who are you ?
        {#each players as player}
            <button on:click={setPlayer(player)}>{player.name}</button>
        {/each}
    {/if}

    {#if myCards}
        <div class="player-cards">
            {#each myCards as card}
                <Card {card}/>
            {/each}
        </div>
        <button on:click={() => {ready = true}}>Ready !</button>
    {/if}
{/if}
</Collection>
