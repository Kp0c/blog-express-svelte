<script lang="ts">
  import { config } from '../../configs/config.js';
  import { onMount } from "svelte";
  import { showAlert } from "../stores/alerts.store.js";
  import NewPost from "../modals/EditPost.svelte";
  import { openModal } from "svelte-modals";
  import Button from "../components/form/Button.svelte";
  import Spinner from "../components/form/Spinner.svelte";
  import Post from "../components/Post.svelte";
  import { posts, setPosts } from "../stores/posts.store";
  import Pagination from "../components/Pagination.svelte";
  import { get } from "svelte/store";
  import { token } from "../stores/auth-token.store";
  import { push } from "svelte-spa-router";
  import Status from "../components/Status.svelte";

  let isLoading = false;
  let page = 1;
  let totalPages = 1;

  async function loadPosts() {
    isLoading = true;
    try {
      const graphqlQuery = `
      query FetchPosts($page: Int!) {
        posts(page: $page) {
          posts {
            _id
            title
            creator {
              _id
              name
            }
            content
            createdAt
          }
          totalPages
        }
      }`;

      const postsResponse = await fetch(config.backend_url + '/graphql', {
        headers: {
          Authorization: 'Bearer ' + get(token),
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          query: graphqlQuery,
          variables: { page }
        })
      });

      if (postsResponse.status !== 200) {
        throw new Error('Error loading posts');
      }

      const postsObj = await postsResponse.json();

      setPosts(postsObj.data['posts']['posts']);
      totalPages = postsObj.data['posts']['totalPages'];
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
    <Status/>
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
    {#if $posts.length === 0 && !isLoading}
      <div class="text-center">
        <p class="text-gray-600">No posts yet</p>
      </div>
    {/if}
    <Pagination bind:page bind:totalPages on:pageChanged={changePage}/>
  </div>
</div>
