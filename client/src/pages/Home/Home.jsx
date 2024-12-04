import React from "react";

const HomePage = () => {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Welcome to the Home Page</h1>
      <p>This is a simple dummy home page built with React!</p>
      <div>
        <button onClick={() => alert("You clicked the button!")}>
          Click Me
        </button>
      </div>
    </div>
  );
};

export default HomePage;
