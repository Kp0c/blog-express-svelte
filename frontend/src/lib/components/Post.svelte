<script lang="ts">
  import type { Post } from "../models/Post";
  import Button from "./form/Button.svelte";
  import { push } from "svelte-spa-router";
  import { openModal } from "svelte-modals";
  import EditPost from "../modals/EditPost.svelte";
  import { showAlert } from "../stores/alerts.store";
  import { config } from "../../configs/config";
  import { get } from "svelte/store";
  import { token } from "../stores/auth-token.store";
  import { deletePost as deletePostFromStore } from "../stores/posts.store";
  import jwtDecode from "jwt-decode";

  export let post: Post;

  $: formattedDate = post ? new Date(+post.createdAt).toLocaleDateString() : 'Unknown';
  $: isMyPost = post ? post.creator._id === jwtDecode(get(token)).userId : false;

  function viewPost(): void {
    push('/feed/posts/' + post._id);
  }

  function editPost(): void {
    openModal(EditPost, {post});
  }

  async function deletePost(): Promise<void> {
    try {
      const graphqlQuery = `
        mutation DeletePost($id: ID!) {
          deletePost(id: $id)
        }
      `;

      const response = await fetch(config.backend_url + '/graphql', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + get(token),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: graphqlQuery,
          variables: {
            id: post._id
          }
        })
      });

      if (response.status === 200) {
        deletePostFromStore(post._id);
        showAlert('success', 'Post deleted successfully');
      } else {
        showAlert('error', 'Error deleting post');
      }
    } catch (e) {
      showAlert('error', 'Error deleting post');
      console.error(e);
    }
  }
</script>

<div
  class="p-3 border-b border-gray-100 border-solid border-2 shadow-lg rounded-lg m-2"
>
    <span
      class="text-gray-300 font-bold text-xs"
    >
        Posted by {post.creator.name} on {formattedDate}
    </span>
  <h2
    class="text-gray-700 font-bold text-xl"
  >
    {post.title}
  </h2>
  <div
    class="flex justify-end gap-2"
  >
    <Button on:click={viewPost}>View</Button>
    {#if isMyPost}
      <Button on:click={editPost}>Edit</Button>
      <Button color="danger" on:click={deletePost} type="outline">Delete</Button>
    {/if}
  </div>

</div>
