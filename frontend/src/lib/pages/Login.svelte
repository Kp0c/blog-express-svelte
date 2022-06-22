<script lang="ts">
  import Input from "../components/form/Input.svelte";
  import Button from "../components/form/Button.svelte";
  import { config } from "../../configs/config.js";
  import { showAlert } from "../stores/alerts.store.js";
  import { replace } from "svelte-spa-router";
  import { setToken } from "../stores/auth-token.store";

  let email = '';
  let password = '';


  async function signup(): Promise<void> {
    try {
      const res = await fetch(config.backend_url + '/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await res.json();

      if (res.status === 200) {
        setToken(data.token);
        await replace('/');
      } else {
        showAlert('error', data.message);
      }
    } catch (err) {
      console.error(err);
      showAlert('error', 'Something went wrong');
    }
  }
</script>

<div
  class="w-3/4 mx-auto p-4 bg-white rounded-lg shadow-lg"
>
  <Input bind:value={email} label="Your E-Mail" type="email"/>
  <Input bind:value={password} label="Your Password" type="password"/>
  <div class="mt-2">
    <Button on:click={signup}>Login</Button>
  </div>

</div>
