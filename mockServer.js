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

const reservationsFilePath = path.join(__dirname, "mockReservations.json");

// Helper function to read data from the JSON file
const readData = (dataFilePath) => {
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading data file:", err);
    return [];
  }
};

// Helper function to write data to the JSON file
const writeData = (dataFilePath, data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing to data file:", err);
  }
};

// Mock GET request to fetch all cars with pagination
app.get("/api/cars", (req, res) => {
  const users = readData(dataFilePath);

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
  const users = readData(dataFilePath);
  const user = users.find((u) => u.id === id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Mock POST request to create a user
app.post("/api/cars", (req, res) => {
  const users = readData(dataFilePath);
  const newUser = req.body;
  newUser.id = String(Date.now()); // Generate a unique ID
  users.push(newUser);
  writeData(dataFilePath, users);
  res.status(201).json({
    message: "User created successfully",
    user: newUser,
  });
});

// Mock PUT request to update user information
app.put("/api/cars/:id", (req, res) => {
  const { id } = req.params;
  const users = readData(dataFilePathdataFilePath);
  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...req.body };
    writeData(dataFilePath, users);
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
  const users = readData(dataFilePath);
  const filteredUsers = users.filter((u) => u.id !== id);
  if (filteredUsers.length !== users.length) {
    writeData(dataFilePath, filteredUsers);
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

//############################################################################

// Mock GET request to fetch all reservations with pagination
app.get("/api/bookings", (req, res) => {
  const reservations = readData(reservationsFilePath);

  // Extract query parameters for pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  // Calculate start and end indices
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Paginate the data
  const paginatedReservations = reservations.slice(startIndex, endIndex);

  // Include metadata for pagination
  const paginationInfo = {
    currentPage: page,
    totalPages: Math.ceil(reservations.length / limit),
    totalItems: reservations.length,
    itemsPerPage: limit,
  };

  res.json({
    pagination: paginationInfo,
    data: paginatedReservations,
  });
});

// Mock GET request for a single reservation by ID
app.get("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  const reservations = readData(reservationsFilePath);
  const reservation = reservations.find((r) => r.id === id);
  if (reservation) {
    res.json(reservation);
  } else {
    res.status(404).json({ message: "Reservation not found" });
  }
});

// Mock POST request to create a new reservation
app.post("/api/bookings", (req, res) => {
  const reservations = readData(reservationsFilePath);
  const newReservation = req.body;
  newReservation.id = String(Date.now()); // Generate a unique ID
  reservations.push(newReservation);
  writeData(reservationsFilePath, reservations);
  res.status(201).json({
    message: "Reservation created successfully",
    reservation: newReservation,
  });
});

// Mock PUT request to update an existing reservation
app.put("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  const reservations = readData(reservationsFilePath);
  const reservationIndex = reservations.findIndex((r) => r.id === id);
  if (reservationIndex !== -1) {
    reservations[reservationIndex] = {
      ...reservations[reservationIndex],
      ...req.body,
    };
    writeData(reservationsFilePath, reservations);
    res.json({
      message: `Reservation with ID ${id} updated successfully`,
      updatedReservation: reservations[reservationIndex],
    });
  } else {
    res.status(404).json({ message: "Reservation not found" });
  }
});

// Mock DELETE request to delete a reservation
app.delete("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  const reservations = readData(reservationsFilePath);
  const filteredReservations = reservations.filter((r) => r.id !== id);
  if (filteredReservations.length !== reservations.length) {
    writeData(reservationsFilePath, filteredReservations);
    res.json({ message: `Reservation with ID ${id} deleted successfully` });
  } else {
    res.status(404).json({ message: "Reservation not found" });
  }
});
