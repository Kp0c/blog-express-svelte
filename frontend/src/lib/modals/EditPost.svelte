<script lang="ts">
  import Input from "../components/form/Input.svelte";
  import TextArea from "../components/form/TextArea.svelte";
  import { closeModal } from "svelte-modals";
  import FileInput from "../components/form/FileInput.svelte";
  import { showAlert } from "../stores/alerts.store.js";
  import { config } from "../../configs/config.js";
  import Button from "../components/form/Button.svelte";
  import { onMount } from "svelte";
  import type { Post } from "../models/Post";
  import { get } from "svelte/store";
  import { token } from "../stores/auth-token.store";
  import { addPost, replacePost } from "../stores/posts.store";

  export let isOpen: boolean;

  export let post: Post;

  $: isEditing = !!post?._id;

  let title = '';
  let content = '';
  let image;

  $: imageSrc = image ? URL.createObjectURL(image) : '';
  $: windowTitle = isEditing ? 'Edit Post' : 'New Post';

  async function save() {
    if (!validate()) {
      return;
    }

    try {
      let imageUrl = null;
      if (image) {
        const formData = new FormData();
        formData.append('image', image);

        const fileUploadResponse = await fetch(config.backend_url + '/post-image', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${get(token)}`
          }
        });

        if (fileUploadResponse.status !== 201) {
          throw new Error('Error uploading image');
        }

        const fileUploadResponseJson = await fileUploadResponse.json();
        imageUrl = fileUploadResponseJson.imageUrl;
      }

      const mutation = isEditing ? 'editPost' : 'createPost';
      const idField = isEditing ? `$id: ID!,` : '';
      const idFieldDeclaration = isEditing ? `id: $id` : '';
      const graphqlQuery = `
        mutation CreateEditPost(${idField} $title: String!, $content: String!, $imageUrl: String${isEditing ? '' : '!'}) {
          ${mutation}(
            ${idFieldDeclaration}
            title: $title,
            content: $content,
            imageUrl: $imageUrl
          ) {
            _id
            title
            content
            imageUrl
            createdAt,
            creator {
              _id
              name
            }
          }
        }
      `;

      const url = `${ config.backend_url }/graphql`;
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          query: graphqlQuery,
          variables: {
            id: post?._id ?? undefined,
            title,
            content,
            imageUrl: imageUrl ?? ''
          }
        }),
        headers: {
          'Authorization': 'Bearer ' + get(token),
          'Content-Type': 'application/json'
        }
      });

      const responseJson = await response.json();

      if (response.status === 200) {
        showAlert('success', 'Post saved successfully');
        const post = responseJson['data'][mutation];
        if (isEditing) {
          replacePost(post);
        } else {
          addPost(post);
        }
        closeModal();
      } else {
        showAlert('error', responseJson['data'].errors[0].message ?? 'Error saving post');
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
      <h2 class="text-xl font-bold">{ windowTitle }</h2>
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
