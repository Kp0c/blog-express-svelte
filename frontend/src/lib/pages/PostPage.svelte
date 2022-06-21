<script lang="ts">
  import { onMount } from "svelte";
  import { config } from "../../configs/config";
  import { showAlert } from "../stores/alerts.store";
  import type { Post } from "../models/Post";
  import Spinner from "../components/form/Spinner.svelte";

  export let params: Record<string, string> = {}

  let isLoading = true;
  let post: Post;

  $: postId = params?.postId ?? null

  $: formattedDate = post ? new Date(post.createdAt).toLocaleDateString() : 'Unknown';
  $: imageSrc = config.backend_url + '/' + post?.imageUrl ?? '';

  async function loadPost() {
      isLoading = true;
      try {
          const postsResponse = await fetch(config.backend_url + '/feed/posts/' + postId);

          if (postsResponse.status !== 200) {
              throw new Error('Error loading post');
          }

          const postsObh = await postsResponse.json();

          post = postsObh['post'];
      } catch (error) {
          showAlert('error', 'Error loading post');
          console.error(error);
      }
      isLoading = false;
  }

  onMount(() => {
      loadPost();
  });
</script>

<div class="p-4">
    {#if isLoading}
        <div class="text-center">
            <Spinner/>
        </div>
    {:else}
        <h1
            class="text-center text-4xl font-bold mb-4 text-gray-800"
        >
            { post.title }
        </h1>
        <div class="text-center">
            <span
                    class="text-gray-400"
            >
                Create by { post.creator.name } on {formattedDate}
            </span>
        </div>
        <hr>
        <div class="flex justify-center">
            <img src={ imageSrc } alt="post" class="w-2/3 h-auto p-4"/>
        </div>
        <div class="p-2 text-center">
            <p>{ post.content }</p>
        </div>
    {/if}
</div>
