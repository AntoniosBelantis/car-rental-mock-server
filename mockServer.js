// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

// Initialize Express app
const app = express();

const cors = require("cors");
// Enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(bodyParser.json());

// Path to the JSON file
const dataFilePath = path.join(__dirname, "mockCars.json");

// Helper function to read data from the JSON file
const readData = () => {
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading data file:", err);
    return [];
  }
};

// Helper function to write data to the JSON file
const writeData = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing to data file:", err);
  }
};

// Mock GET request to fetch all cars with pagination
app.get("/api/cars", (req, res) => {
  const users = readData();

  // Extract query parameters for pagination
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

  // Calculate start and end indices
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Paginate the data
  const paginatedUsers = users.slice(startIndex, endIndex);

  // Include metadata for pagination
  const paginationInfo = {
    currentPage: page,
    totalPages: Math.ceil(users.length / limit),
    totalItems: users.length,
    itemsPerPage: limit,
  };

  res.json({
    pagination: paginationInfo,
    data: paginatedUsers,
  });
});

// Mock GET request for a user profile
app.get("/api/cars/:id", (req, res) => {
  const { id } = req.params;
  const users = readData();
  const user = users.find((u) => u.id === id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Mock POST request to create a user
app.post("/api/cars", (req, res) => {
  const users = readData();
  const newUser = req.body;
  newUser.id = String(Date.now()); // Generate a unique ID
  users.push(newUser);
  writeData(users);
  res.status(201).json({
    message: "User created successfully",
    user: newUser,
  });
});

// Mock PUT request to update user information
app.put("/api/cars/:id", (req, res) => {
  const { id } = req.params;
  const users = readData();
  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...req.body };
    writeData(users);
    res.json({
      message: `User with ID ${id} updated successfully`,
      updatedUser: users[userIndex],
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Mock DELETE request to delete a user
app.delete("/api/cars/:id", (req, res) => {
  const { id } = req.params;
  const users = readData();
  const filteredUsers = users.filter((u) => u.id !== id);
  if (filteredUsers.length !== users.length) {
    writeData(filteredUsers);
    res.json({ message: `User with ID ${id} deleted successfully` });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Start the mock server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Mock server is running on http://localhost:${PORT}`);
});
