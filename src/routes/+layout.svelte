<script lang="ts">
  let { children } = $props();
  import Navbar from "../common/components/navbar/navbar.svelte";
  import "../app.css";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { loginApi } from '$lib/api/login';

  let isLoginPage = $state(false);
  // svelte-ignore non_reactive_update
  let username: string;
  let isLoaded = $state(false);
  onMount(async () => {
    try {
      //login 
      let loginData = await loginApi.seamlesslogin();
      /* Work in progress */
      if(loginData.status){
        let token = loginData.data.split('token=')[1];
        let responseGetUsers = await loginApi.getUsers(token);
        if(responseGetUsers){
          username = responseGetUsers.username;
        }
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      isLoaded = true;
    }
  });
  $effect(() => {
    if ($page.url.pathname === "/login") {
      isLoginPage = true;
    }
  })
</script>

{#if !isLoginPage && isLoaded}
  <Navbar name = {username}/>
{/if}

{@render children()}
