import { useEffect, useState } from "react";

const LightControl = () => {
  const [lightStatus, setLightStatus] = useState("OFF");

  const toggleLight = (action) => {
    if (action === "toggle_on") {
      setLightStatus("ON");
    } else if (action === "toggle_off") {
      setLightStatus("OFF");
    }
  };

  useEffect(() => {
    // Connect to the WebSocket server
    const ws = new WebSocket("ws://localhost:5000");

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.action) {
        toggleLight(message.action);
      }
    };

    return () => {
      ws.close(); // Clean up the WebSocket connection on component unmount
    };
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Light Control</h1>
      <p>Current Light Status: {lightStatus}</p>
    </div>
  );
};

export default LightControl;