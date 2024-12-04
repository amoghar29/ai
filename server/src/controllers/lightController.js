let lightStatus = "OFF"; // In-memory state

export const toggleLight = (req, res) => {
  const { detected } = req.body; // detected is a boolean indicating if a person is detected
  lightStatus = detected ? "ON" : "OFF"; // Update the in-memory state

  res.status(200).json({ success: true, status: lightStatus });
};

export const getLightStatus = (req, res) => {
  res.status(200).json({ success: true, status: lightStatus });
}; 