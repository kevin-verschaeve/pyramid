<script>
    import { getContext } from 'svelte';
    import { push } from 'svelte-spa-router';

    const db = getContext('firebase').firestore();

    let name;
    const createGame = () => {
        if (!name) {
            return;
        }

        const gameId = name + '-' + Math.random().toString(36).substr(2, 6);
        db.doc(`games/${gameId}`).set({started: false});
        push(`/game/${gameId}/config`);
    }
</script>

Create a game
<input type="text" bind:value={name}>
<button on:click={createGame}>Create</button>
