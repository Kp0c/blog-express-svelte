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
      const graphqlQuery = `
        query {
          status
        }
      `;

      const response = await fetch(config.backend_url + '/graphql', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + get(token),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: graphqlQuery })
      });
      const data = await response.json();

      if (response.status === 200) {
        status = data.data.status;
      } else {
        showAlert('error', 'Error loading status');
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function updateStatus() {
    try {
      const graphqlQuery = `
        mutation UpdateStatus($status: String!) {
          updateStatus(status: $status)
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
          variables: { status: status }
        })
      });
      const data = await response.json();

      if (response.status === 200) {
        showAlert('success', 'Status updated successfully');
        status = data.data['updateStatus'];
      } else {
        console.error(data);
        showAlert('error', data.errors[0].message);
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
