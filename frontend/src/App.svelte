<script>
  import Layout from "./Layout.svelte";
  import Feed from "./lib/Feed.svelte";
  import Alerts from "./lib/components/Alerts.svelte";
  import {closeModal, Modals} from "svelte-modals";
</script>

<Layout>
  <Feed/>
</Layout>

<div class="absolute right-4 bottom-4 z-20">
    <Alerts/>
</div>

<Modals>
    <div
            slot="backdrop"
            class="fixed top-0 left-0 bottom-0 right-0 bg-gray-900 opacity-50 z-10"
            on:click={closeModal}></div>
</Modals>
