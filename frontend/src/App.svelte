<script lang="ts">
  import Router, {link} from 'svelte-spa-router';
  import Alerts from "./lib/components/common/Alerts.svelte";
  import {closeModal, Modals} from "svelte-modals";
  import {routes} from "./routes";
  import { dropToken, token } from "./lib/stores/auth-token.store";
  import { clearPosts } from "./lib/stores/posts.store";

  function logout(): void {
    clearPosts();
    dropToken();
  }
</script>

<nav class="flex items-center justify-between flex-wrap bg-blue-500 p-3">
  <div class="flex items-center flex-shrink-0 text-white mr-6 text-xl">
    <a href="/">Express + Svelte blog</a>
  </div>
  <ul class="flex items-center flex-shrink-0 text-white mr-6">
    {#if $token === null}
      <li class="mr-3">
        <a href="/login" use:link>Login</a>
      </li>
      <li class="mr-3">
        <a href="/signup" use:link>Signup</a>
      </li>
    {:else}
      <li class="mr-3">
        <a href="/" use:link>Feed</a>
      </li>
      <li class="mr-3">
        <a on:click={logout} href="/login" use:link>Logout</a>
      </li>
    {/if}
  </ul>
</nav>

<Router {routes}/>

<div class="absolute right-4 bottom-4 z-20">
  <Alerts/>
</div>

<Modals>
  <div
    class="fixed top-0 left-0 bottom-0 right-0 bg-gray-900 opacity-50 z-10"
    on:click={closeModal}
    slot="backdrop"></div>
</Modals>
