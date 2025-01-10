export const createWebSocket = (url, onMessage) => {
    const socket = new WebSocket(url);
  
    socket.onopen = () => {
      console.log("WebSocket connection established.");
    };
  
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (onMessage) onMessage(data);
    };
  
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  
    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };
  
    return socket;
  };
  