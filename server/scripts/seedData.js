require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/models/User");
const Candidate = require("../src/models/Candidate");

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/collaborative_notes"
    );
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Candidate.deleteMany({});
    console.log("Cleared existing data");

    // Create sample users
    const users = await User.create([
      {
        name: "John Recruiter",
        email: "john@company.com",
        password: "password123",
      },
      {
        name: "Sarah Manager",
        email: "sarah@company.com",
        password: "password123",
      },
      {
        name: "Mike Interviewer",
        email: "mike@company.com",
        password: "password123",
      },
    ]);

    console.log(
      "Created sample users:",
      users.map((u) => u.email)
    );

    // Create sample candidates
    const candidates = await Candidate.create([
      {
        name: "Alice Johnson",
        email: "alice.johnson@email.com",
        createdBy: users[0]._id,
      },
      {
        name: "Bob Smith",
        email: "bob.smith@email.com",
        createdBy: users[1]._id,
      },
      {
        name: "Carol Williams",
        email: "carol.williams@email.com",
        createdBy: users[0]._id,
      },
      {
        name: "David Brown",
        email: "david.brown@email.com",
        createdBy: users[2]._id,
      },
      {
        name: "Emma Davis",
        email: "emma.davis@email.com",
        createdBy: users[1]._id,
      },
    ]);

    console.log(
      "Created sample candidates:",
      candidates.map((c) => c.name)
    );
    console.log("✅ Seed data created successfully!");

    console.log("\n📋 Test Accounts:");
    console.log("Email: john@company.com | Password: password123");
    console.log("Email: sarah@company.com | Password: password123");
    console.log("Email: mike@company.com | Password: password123");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedData();
