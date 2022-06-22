<script lang="ts">
  import Button from "./form/Button.svelte";
  import Input from "./form/Input.svelte";
  import { onMount } from "svelte";
  import { config } from "../../configs/config";
  import { get } from "svelte/store";
  import { token } from "../stores/auth-token.store";
  import { showAlert } from "../stores/alerts.store";

  let status = '';

  async function loadStatus() {
    try {
      const response = await fetch(config.backend_url + '/feed/status', {
        headers: {
          'Authorization': 'Bearer ' + get(token)
        }
      });
      const data = await response.json();
      status = data.status;
    } catch (error) {
      console.error(error);
    }
  }

  async function updateStatus() {
    try {
      const response = await fetch(config.backend_url + '/feed/status', {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + get(token),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: status
        })
      });
      const data = await response.json();

      if (response.status === 200) {
        showAlert('success', 'Status updated successfully');
        status = data.status;
      } else {
        console.error(data);
        showAlert('error', data.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  onMount(() => {
    loadStatus();
  });
</script>

<div class="flex mb-6">
  <Input
    bind:value={status}
    placeholder="Your status"
    size="sm:text-md"
  />
  <div class="ml-2">
    <Button on:click={updateStatus}>Update</Button>
  </div>
</div>
