<script>
  import {Button, Input, Spinner} from "flowbite-svelte";
  import { config } from '../configs/config.js';
  import {onMount} from "svelte";
  import {showAlert} from "./stores/alerts.store.js";

  async function loadPosts() {
    try {
      const postsResponse = await fetch(config.backend_url + '/feed/2posts');
      const posts = await postsResponse.json();

      console.log(posts);
    } catch (error) {
      showAlert('error', 'Error loading posts');
      console.error(error);
    }
  }

  onMount(() => {
    loadPosts();
  });
</script>

<div class="flex justify-center mt-10">
    <div class="w-2/3 flex justify-center flex-col">
        <div class="flex mb-6">
            <Input
                    class="grow mr-1"
                    size="sm:text-md"
                    placeholder="Your status"
            />
            <Button
                    size="sm:text-md"
                    color="primary"
                    variant="contained">Update</Button>
        </div>
        <div class="text-center mb-6">
            <Button
                    size="sm:text-md"
                    color="primary"
                    variant="contained">New Post</Button>
        </div>
        <div class="text-center">
            <Spinner />
        </div>
    </div>
</div>
