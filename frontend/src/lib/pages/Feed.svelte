<script lang="ts">
  import { config } from '../../configs/config.js';
  import {onMount} from "svelte";
  import {showAlert} from "../stores/alerts.store.js";
  import NewPost from "../modals/EditPost.svelte";
  import {openModal} from "svelte-modals";
  import Input from "../components/form/Input.svelte";
  import Button from "../components/form/Button.svelte";
  import Spinner from "../components/form/Spinner.svelte";
  import Post from "../components/Post.svelte";
  import { setPosts } from "../stores/posts.store";
  import { posts } from "../stores/posts.store";
  import Pagination from "../components/Pagination.svelte";

  let isLoading = false;
  let page = 1;
  let totalPages = 1;

  async function loadPosts() {
    isLoading = true;
    try {
      const postsResponse = await fetch(config.backend_url + '/feed/posts?page=' + page);

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
    loadPosts();
  });
</script>

<div class="flex justify-center mt-10">
    <div class="w-2/3 flex justify-center flex-col">
        <div class="flex mb-6">
            <Input
                    size="sm:text-md"
                    placeholder="Your status"
            />
            <div class="ml-2">
                <Button >Update</Button>
            </div>
        </div>
        <div class="text-center mb-6">
            <Button on:click={newPost}>New Post</Button>
        </div>
        {#if isLoading}
            <div class="text-center">
                <Spinner />
            </div>
        {/if}
        {#each $posts as post}
            <Post {post}/>
        {/each}
        <Pagination bind:page bind:totalPages on:pageChanged={changePage}/>
    </div>
</div>
