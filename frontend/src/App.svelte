<script>
  import Router, { link } from 'svelte-spa-router';
  import Alerts from "./lib/components/common/Alerts.svelte";
  import {closeModal, Modals} from "svelte-modals";
  import {routes} from "./routes";
</script>

<nav class="flex items-center justify-between flex-wrap bg-blue-500 p-3">
    <div class="flex items-center flex-shrink-0 text-white mr-6 text-xl">
        <a href="/">Express + Svelte blog</a>
    </div>
    <ul class="flex items-center flex-shrink-0 text-white mr-6">
        <li class="mr-3">
            <a href="/" use:link>Feed</a>
        </li>
<!--        <li class="mr-3">-->
<!--            <a href="/feed" use:link>Logout</a>-->
<!--        </li>-->
    </ul>
</nav>
<Router {routes} />

<div class="absolute right-4 bottom-4 z-20">
    <Alerts/>
</div>

<Modals>
    <div
            slot="backdrop"
            class="fixed top-0 left-0 bottom-0 right-0 bg-gray-900 opacity-50 z-10"
            on:click={closeModal}></div>
</Modals>
