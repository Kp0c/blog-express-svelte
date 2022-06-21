<script>
    import Input from "../components/Input.svelte";
    import TextArea from "../components/TextArea.svelte";
    import {Button} from "flowbite-svelte";
    import {closeModal} from "svelte-modals";
    import FileInput from "../components/FileInput.svelte";
    import {showAlert} from "../stores/alerts.store.js";
    import {config} from "../../configs/config.js";

    export let isOpen;

    let title = '';
    let content = '';
    let image;

    $: imageSrc = image ? URL.createObjectURL(image) : '';

    async function save() {
      if (!validate()) {
        return;
      }

      try {
        const response = await fetch(config.backend_url + '/feed/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title,
            content
          })
        });

        const data = await response.json();

        if (response.status === 201) {
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

        if (!image) {
            showAlert('error', 'Image is required.');
            return false;
        }

        return true;
    }
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
                <img src={imageSrc} alt="post" class="max-w-lg mt-2" />
            {/if}

            <div
                class="flex justify-end mt-2"
            >
                <Button
                    color="primary"
                    on:click={save}
                >Save</Button>
            </div>
        </div>
    </div>
{/if}
