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
      const graphqlQuery = `
        query  Login($email: String!, $password: String!) {
          login(
            email: $email,
            password: $password
          ) {
            token
          }
        }
      `;

      const res = await fetch(config.backend_url + '/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: graphqlQuery,
          variables: {
            email: email,
            password: password
          }
        })
      });

      const responseData = await res.json();

      if (res.status === 200) {
        setToken(responseData.data.login.token);
        await replace('/');
      } else {
        showAlert('error', responseData.errors[0].message);
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
