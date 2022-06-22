<script lang="ts">
  import Input from "../components/form/Input.svelte";
  import Button from "../components/form/Button.svelte";
  import { config } from "../../configs/config.js";
  import { showAlert } from "../stores/alerts.store.js";
  import { replace } from "svelte-spa-router";
  import { setToken } from "../stores/auth-token.store";

  let email = '';
  let name = '';
  let password = '';


  async function signup(): Promise<void> {
    try {
      const res = await fetch(config.backend_url + '/auth/signup', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          name: name,
          password: password
        })
      });

      const data = await res.json();

      if (res.status === 201) {
        setToken(data.token);
        replace('/');
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
  <Input bind:value={name} label="Your Name"/>
  <Input bind:value={password} label="Your Password" type="password"/>
  <div class="mt-2">
    <Button on:click={signup}>Signup</Button>
  </div>

</div>
