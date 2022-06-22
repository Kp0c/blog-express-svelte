<script lang="ts">
  import type { Post } from "../models/Post";
  import Button from "./form/Button.svelte";
  import { push } from "svelte-spa-router";
  import { openModal } from "svelte-modals";
  import EditPost from "../modals/EditPost.svelte";
  import { showAlert } from "../stores/alerts.store";
  import { config } from "../../configs/config";
  import { deletePost as deletePostFromStore } from "../stores/posts.store";
  import { get } from "svelte/store";
  import { token } from "../stores/auth-token.store";

  export let post: Post;

  $: formattedDate = post ? new Date(post.createdAt).toLocaleDateString() : 'Unknown';

  function viewPost(): void {
    push('/feed/posts/' + post._id);
  }

  function editPost(): void {
    openModal(EditPost, {post});
  }

  async function deletePost(): Promise<void> {
    try {
      const responst = await fetch(config.backend_url + '/feed/posts/' + post._id, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + get(token)
        }
      });

      if (responst.status === 200) {
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
    <Button on:click={editPost}>Edit</Button>
    <Button color="danger" on:click={deletePost} type="outline">Delete</Button>
  </div>

</div>
