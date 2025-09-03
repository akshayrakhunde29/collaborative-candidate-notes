const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../server');
const User = require('../models/User');

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    const url = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/collaborative_notes_test';
    await mongoose.connect(url);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201);

      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.token).toBeDefined();
    });

    it('should not create user with invalid email', async () => {
      const userData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123'
      };

      await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      await user.save();
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should not login with invalid credentials', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(401);
    });
  });
});