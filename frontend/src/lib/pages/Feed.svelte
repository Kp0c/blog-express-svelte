<script lang="ts">
  import { config } from '../../configs/config.js';
  import { onMount } from "svelte";
  import { showAlert } from "../stores/alerts.store.js";
  import NewPost from "../modals/EditPost.svelte";
  import { openModal } from "svelte-modals";
  import Input from "../components/form/Input.svelte";
  import Button from "../components/form/Button.svelte";
  import Spinner from "../components/form/Spinner.svelte";
  import Post from "../components/Post.svelte";
  import { posts, setPosts } from "../stores/posts.store";
  import Pagination from "../components/Pagination.svelte";
  import { get } from "svelte/store";
  import { token } from "../stores/auth-token.store";
  import { push } from "svelte-spa-router";

  let isLoading = false;
  let page = 1;
  let totalPages = 1;

  async function loadPosts() {
    isLoading = true;
    try {
      const postsResponse = await fetch(config.backend_url + '/feed/posts?page=' + page, {
        headers: {
          Authorization: 'Bearer ' + get(token)
        }
      });

      if (postsResponse.status !== 200) {
        throw new Error('Error loading posts');
      }

      const postsObj = await postsResponse.json();

      setPosts(postsObj['posts']);
      totalPages = postsObj['totalPages'];
    } catch (error) {
      showAlert('error', 'Error loading posts');
      console.error(error);
    }
    isLoading = false;
  }

  function newPost() {
    openModal(NewPost);
  }

  function changePage(newPage: CustomEvent) {
    page = newPage.detail.page;
    loadPosts();
  }

  onMount(() => {
    if (!get(token)) {
      showAlert('error', 'You must be logged in to view this page');
      push('/login');
    } else {
      loadPosts();
    }
  });
</script>

<div class="flex justify-center mt-10">
  <div class="w-2/3 flex justify-center flex-col">
    <div class="flex mb-6">
      <Input
        placeholder="Your status"
        size="sm:text-md"
      />
      <div class="ml-2">
        <Button>Update</Button>
      </div>
    </div>
    <div class="text-center mb-6">
      <Button on:click={newPost}>New Post</Button>
    </div>
    {#if isLoading}
      <div class="text-center">
        <Spinner/>
      </div>
    {/if}
    {#each $posts as post}
      <Post {post}/>
    {/each}
    <Pagination bind:page bind:totalPages on:pageChanged={changePage}/>
  </div>
</div>
