<script>
  export let label;
  export let id = 'id';

  export let file;

  function handleInput(event) {
    if (event.target.files.length > 0) {
        file = event.target.files[0];
    }
  }

</script>

<div class="flex flex-col">
    {#if label}
        <label
                class="text-md font-semibold text-gray-600"
                for="{id}"
        >
            {label}
        </label>
    {/if}
    <input
            type="file"
            id="{id}"
            on:input={handleInput}
            class="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg"
    >
</div>

