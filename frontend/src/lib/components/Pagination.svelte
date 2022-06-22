<script lang="ts">

  import { createEventDispatcher } from "svelte";
  import Button from "./form/Button.svelte";

  const dispatch = createEventDispatcher();
  export let page = 1;
  export let totalPages = 1;

  function changePage(page: number) {
    dispatch('pageChanged', {page});
  }

  function previousPage() {
    changePage(page - 1);
  }

  function nextPage() {
    changePage(page + 1);
  }
</script>

<div class="flex justify-center">
  {#if page > 1}
    <Button type="outline" on:click={previousPage}>&lAarr;</Button>
  {/if}

  {#if page !== 1}
    <Button type="outline" on:click={() => changePage(1)}>1</Button>
  {/if}

  <Button>{page}</Button>

  {#if page !== totalPages}
    <Button type="outline" on:click={() => changePage(totalPages)}>{totalPages}</Button>
  {/if}

  {#if page < totalPages}
    <Button type="outline" on:click={nextPage}>&rAarr;</Button>
  {/if}
</div>
