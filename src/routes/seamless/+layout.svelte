<script lang="ts">
  let { children } = $props();
  import Navbar from "../../common/components/navbar/navbar.svelte";
  import "../../app.css";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { loginApi } from '$lib/api/login';

  let isLoginPage = $state(false);
  // svelte-ignore non_reactive_update
  let token: string;
  let isLoaded = $state(false);

  let queryParams: any = {};

  queryParams = Object.fromEntries($page.url.searchParams.entries());
  token = queryParams.token;
  console.log('token:', token);
  // svelte-ignore non_reactive_update
  let username = '';
  
  const checkLoginStatus = () => {
    // ดึงข้อมูลจาก localStorage
    token = localStorage.getItem("token") || '';
    $: username = localStorage.getItem("username") || '';
    isLoginPage = Boolean(username);
  };

  const login = async (): Promise<void> => {
    let responseGetUsers = await loginApi.getUsers(token);
    console.log('responseGetUsers:', responseGetUsers);
    $: username = responseGetUsers.username;
    if(username != ''){
      localStorage.setItem("username", username);
      localStorage.setItem("token", token);
      isLoginPage = true;
    }
  }
  
  onMount(async () => {
    try {
      await login();
      //login 
      // let loginData = await loginApi.seamlesslogin();
      // /* Work in progress */
      // if(loginData.status){
      //   let token = loginData.data.split('token=')[1];
      //   let responseGetUsers = await loginApi.getUsers(token);
      //   if(responseGetUsers){
      //     username = responseGetUsers.username;
      //   }
      // }

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

{#if isLoginPage && isLoaded}
  <Navbar name = {username}/>
  {@render children()}
  {:else}
  <div id="content" class="bg-center bg-cover bg-no-repeat h-screen items-center justify-center flex flex-col" style="background-image: url(&quot;https://res.cloudinary.com/moodgiver/image/upload/v1623360651/jean-philippe-delberghe-1400011-unsplash_a8qscz.jpg&quot;);">
		<div id="moka-w1wgf" class="items-center justify-center w-full p-8 flex flex-col">
			<div id="moka-ix3cs" class="bg-gray-400 items-center justify-center md:w-1/2 w-full shadow-md p-5 h-auto rounded-lg blur-3 bg-opacity-50 flex flex-col col-span-12">
				<!-- svelte-ignore a11y_missing_content -->
				<h4 class="w-48 border-t-4 border-solid border-red-500 h-20" id="moka-uuij0">
				</h4>
				<h4 class="text-orange-300    text-2xl" id="moka-8q3tt" style="font-family: Abel;">เกิดข้อผิดพลาดในการเข้าสู่ระบบ</h4>
				<h2 class="text-gray-300   text-5xl text-center mt-2 mb-20" id="moka-cqg7a" style="font-family: &quot;Archivo Black&quot;;">กรุณาติดต่อฝ่ายสนับสนุน</h2>
				<!-- <button value="button" class="hover:text-gray-300 bg-yellow-800 text-white hover:bg-black w-56 p-4 text-2xl font-bold" id="moka-8pwrq" style="font-family: Barlow;">Give me a chair</button> -->
			</div>
		</div>
	</div>
{/if}
