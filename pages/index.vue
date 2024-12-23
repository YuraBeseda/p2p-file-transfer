<template>
  <div>
    <h1>P2P File Sharing</h1>
    <!-- Form for entering or creating a room ID -->
    <form @submit.prevent="goToRoom">
      <label for="roomId">Room ID:</label>
      <input id="roomId" v-model="roomId" type="text" required placeholder="Enter or create room ID" />
      <button type="submit">Join Room</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
const roomId = ref(''); // Holds the user-input room ID

// Navigates the user to the room page when the form is submitted
const goToRoom = () => {
  router.push(`/room/${roomId.value}`);
};
</script>