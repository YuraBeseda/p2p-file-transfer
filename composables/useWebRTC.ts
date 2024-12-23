import { ref } from "vue";
import Peer from "peerjs";

export function useWebRTC(
    roomId: string,
    peerConnection: any,
    selectedFile: any
) {
    const peer = ref<Peer | null>(null);
    const uniquePeerId = `${roomId}-${Math.random().toString(36).substr(2, 9)}`; // Generate a unique ID for the peer

    // Initialize the Peer instance with a unique ID
    const initPeer = () => {
        console.log("Initializing Peer with unique ID:", uniquePeerId);
        peer.value = new Peer(uniquePeerId, {
            config: { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] },
        });

        // Handle incoming connection requests
        peer.value.on("connection", (conn) => {
            console.log("Incoming connection established.");
            peerConnection.value = conn;

            // Handle incoming data on the connection
            conn.on("data", (data) => {
                console.log("Data received:", data);
                const blob = new Blob([data as BlobPart]); // Convert the ArrayBuffer back to a Blob
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "received_file"; // Default filename for received files
                a.click();
            });
        });

        // Log when the peer is ready
        peer.value.on("open", () => {
            console.log("Peer is ready with ID:", uniquePeerId);
        });

        // Handle peer errors
        peer.value.on("error", (err) => {
            console.error("Peer error:", err);
        });
    };

    // Connect to a specific peer ID
    const connectToPeer = (targetPeerId: string) => {
        console.log("Connecting to peer with ID:", targetPeerId);
        const conn = peer.value?.connect(targetPeerId);
        if (conn) {
            console.log("Connection initiated.");
            peerConnection.value = conn;

            // Log connection establishment
            conn.on("open", () => {
                console.log("Connection opened with peer.");
            });

            // Log connection errors
            conn.on("error", (error) => {
                console.error("Connection error:", error);
            });
        } else {
            console.warn("Unable to connect to peer.");
        }
    };

    // Send the selected file over the active connection
    const sendFile = () => {
        if (selectedFile.value && peerConnection.value) {
            console.log("Sending file:", selectedFile.value.name);
            const reader = new FileReader();
            reader.onload = (e) => {
                console.log("File read complete. Sending data...");
                peerConnection.value.send(e.target?.result); // Send the file data as an ArrayBuffer
            };
            reader.readAsArrayBuffer(selectedFile.value);
        } else {
            console.warn("No file selected or connection not established.");
        }
    };

    // Handle file selection from the input element
    const handleFileInput = (event: Event) => {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            selectedFile.value = input.files[0]; // Store the selected file
            console.log("File selected:", selectedFile.value.name);
        } else {
            console.warn("No file selected.");
        }
    };

    return { initPeer, connectToPeer, sendFile, handleFileInput };
}
