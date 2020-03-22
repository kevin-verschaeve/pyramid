<script>
    import { getContext } from 'svelte';
    import { Doc } from "sveltefire";
    import Card from './Card.svelte';
    export let gameId;

    const db = getContext('firebase').firestore();


    const next = (pyramid, current) => {
        let [row, column] = current.split('-');
        let newPyramid = [];
        let newRow;

        for (let rowIndex in pyramid) {
            newRow = [];
            if (row == rowIndex) {
                let cards = JSON.parse(pyramid[rowIndex]);
                for (let colIndex in cards) {
                    if (column === colIndex) {
                        cards[colIndex].discovered = true;
                        column++;
                    }

                    if (column == cards.length) {
                        row++;
                        column = 0;
                    }

                    newRow.push(cards[colIndex]);
                }
                newRow = JSON.stringify(newRow);
            } else {
                newRow = pyramid[rowIndex];
            }
            newPyramid.push(newRow);
        }

        db.doc(`games/${gameId}`).update({pyramid: newPyramid, current: `${row}-${column}`});
    };
</script>

<div id="pyramid">
    <Doc path={`games/${gameId}`} let:data={game} let:ref={gameRef}>
        {#each game.pyramid.slice().reverse() as row}
            <div class="pyramid-row">
                <div></div>
                {#each JSON.parse(row) as card}
                    {#if card.discovered}
                        <Card {card}/>
                    {:else}
                        <div class="card card-hidden"></div>
                    {/if}
                {/each}
                <div></div>
            </div>
        {/each}
        <button id="btn-next-card" on:click={next(game.pyramid, game.current)}>Next card</button>
    </Doc>
</div>
