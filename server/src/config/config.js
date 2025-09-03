module.exports = {
  development: {
    port: process.env.PORT || 5000,
    dbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/collaborative_notes',
    jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000'
  },
  production: {
    port: process.env.PORT || 5000,
    dbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    clientUrl: process.env.CLIENT_URL
  },
  test: {
    port: process.env.PORT || 5001,
    dbUri: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/collaborative_notes_test',
    jwtSecret: process.env.JWT_SECRET || 'test_secret_key',
    clientUrl: 'http://localhost:3000'
  }
};