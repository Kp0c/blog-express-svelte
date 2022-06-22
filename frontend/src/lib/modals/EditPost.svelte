<script lang="ts">
  import Input from "../components/form/Input.svelte";
  import TextArea from "../components/form/TextArea.svelte";
  import { closeModal } from "svelte-modals";
  import FileInput from "../components/form/FileInput.svelte";
  import { showAlert } from "../stores/alerts.store.js";
  import { config } from "../../configs/config.js";
  import Button from "../components/form/Button.svelte";
  import { addPost, replacePost } from "../stores/posts.store";
  import { onMount } from "svelte";
  import type { Post } from "../models/Post";
  import { get } from "svelte/store";
  import { token } from "../stores/auth-token.store";

  export let isOpen: boolean;

  export let post: Post;

  $: isEditing = !!post?._id;

  let title = '';
  let content = '';
  let image;

  $: imageSrc = image ? URL.createObjectURL(image) : '';

  async function save() {
    if (!validate()) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('image', image);

      const url = isEditing ? `${ config.backend_url }/feed/posts/${ post._id }` : `${ config.backend_url }/feed/posts`;
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer ' + get(token)
        }
      });

      const data = await response.json();

      if ([200, 201].includes(response.status)) {
        if (isEditing) {
          replacePost(data.post);
        } else {
          addPost(data.post);
        }
        showAlert('success', data.message);
        closeModal();
      } else {
        showAlert('error', data.message);
      }
    } catch (err) {
      showAlert('error', 'Error during saving post. Please try again.');
    }
  }

  function validate() {
    if (title.length === 0) {
      showAlert('error', 'Title is required.');
      return false;
    }

    if (content.length === 0) {
      showAlert('error', 'Content is required.');
      return false;
    }

    if (!isEditing && !image) {
      showAlert('error', 'Image is required.');
      return false;
    }

    return true;
  }

  onMount(() => {
    if (post) {
      title = post.title;
      content = post.content;
    }
  })
</script>

{#if isOpen}
  <div
    role="dialog"
    class="fixed w-full h-full top-0 left-0 flex items-center justify-center z-20"
  >
    <div
      class="bg-white rounded-lg p-4 shadow-xl"
    >
      <h2 class="text-xl font-bold">New Post</h2>
      <hr>
      <Input
        type="text"
        placeholder="Title"
        label="Title"
        bind:value={title}
      />

      <TextArea
        label="Content"
        placeholder="Content"
        bind:value={content}
      />

      <FileInput
        label="Image"
        id="image"
        bind:file={image}
      />

      {#if image}
        <img src={imageSrc} alt="post" class="max-w-lg mt-2"/>
      {/if}

      <div
        class="flex justify-between mt-2"
      >
        <Button
          on:click={closeModal}
        >
          Cancel
        </Button>
        <Button
          on:click={save}
        >Save
        </Button>
      </div>
    </div>
  </div>
{/if}
