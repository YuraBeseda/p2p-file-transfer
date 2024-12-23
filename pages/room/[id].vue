<template>
  <div>
    <h1>Room: {{ roomId }}</h1>
    <div>
      <!-- Input for entering the target peer's ID -->
      <label for="peerId">Target Peer ID:</label>
      <input id="peerId" v-model="targetPeerId" type="text" placeholder="Enter peer ID to connect" />
    </div>
    <!-- File input for selecting a file to send -->
    <input type="file" @change="handleFileInput" />
    <!-- Button to initiate connection to the specified peer -->
    <button @click="connectToPeer(targetPeerId)">Connect</button>
    <!-- Button to send the selected file over the established connection -->
    <button @click="sendFile" :disabled="!selectedFile || !peerConnection">Send File</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useWebRTC } from '~/composables/useWebRTC';
import { useRoute } from 'vue-router';

const route = useRoute();
const roomId = route.params.id as string; // Get the room ID from the URL

const selectedFile = ref<File | null>(null); // Holds the selected file
const peerConnection = ref<any>(null); // Holds the active WebRTC connection
const targetPeerId = ref(''); // Stores the peer ID input for connection

// Import WebRTC composable functions
const { initPeer, connectToPeer, sendFile, handleFileInput } = useWebRTC(roomId, peerConnection, selectedFile);

// Initialize the WebRTC peer connection when the component mounts
onMounted(() => {
  initPeer();
});
</script>
