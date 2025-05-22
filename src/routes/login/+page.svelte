<script lang="ts">
  import { User, Lock } from "lucide-svelte";

  let username = "";
  let password = "";

  function handleSubmit(event: Event) {
    event.preventDefault();
    // Handle login logic here
    console.log("Login attempted with:", { username, password });
  }
</script>

<div
  class="min-h-screen bg-gradient-radial from-rose-200 via-rose-300 to-yellow-200 flex items-center justify-center p-4"
>
  <div
    class="w-full max-w-md bg-white bg-opacity-90 rounded-lg shadow-xl overflow-hidden border border-rose-300"
  >
    <div class="bg-red-600 p-4">
      <h2 class="text-2xl font-bold text-center text-amber-300">
        ยินดีต้อนรับเข้าสู่ระบบ
      </h2>
    </div>
    <form on:submit={handleSubmit} class="p-6 space-y-6">
      <div class="space-y-2">
        <label for="username" class="text-sm font-medium text-gray-700 block">
          ชื่อผู้ใช้
        </label>
        <div class="relative">
          <User
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-400"
            size={20}
          />
          <input
            type="text"
            id="username"
            bind:value={username}
            class="input w-full pl-10 pr-3 border-rose-300 focus:ring-rose-400"
            placeholder="กรอกชื่อผู้ใช้"
            required
          />
        </div>
      </div>
      <div class="space-y-2">
        <label for="password" class="text-sm font-medium text-gray-700 block">
          รหัสผ่าน
        </label>
        <div class="relative">
          <Lock
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-400"
            size={20}
          />
          <input
            type="password"
            id="password"
            bind:value={password}
            class="input w-full pl-10 pr-3 border-rose-300 focus:ring-rose-400"
            placeholder="กรอกรหัสผ่าน"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        class="btn w-full bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
      >
        เข้าสู่ระบบ
      </button>
    </form>
    <div class="bg-rose-100 bg-opacity-50 px-4 py-3 text-center">
      <a href="#" class="text-sm text-rose-600 hover:text-rose-800">
        ลืมรหัสผ่าน?
      </a>
    </div>
  </div>
</div>
