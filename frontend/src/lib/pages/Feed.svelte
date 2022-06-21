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

  let isLoading = false;

  async function loadPosts() {
    isLoading = true;
    try {
      const postsResponse = await fetch(config.backend_url + '/feed/posts');

      if (postsResponse.status !== 200) {
        throw new Error('Error loading posts');
      }

      const postsObj = await postsResponse.json();

      setPosts(postsObj.posts);
    } catch (error) {
      showAlert('error', 'Error loading posts');
      console.error(error);
    }
    isLoading = false;
  }

  function newPost() {
    openModal(NewPost);
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
    </div>
</div>
