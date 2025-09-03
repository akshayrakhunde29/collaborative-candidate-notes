const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET, 
    { expiresIn: '7d' }
  );
};

// Extract user mentions from message content
const extractMentions = (content) => {
  const mentionRegex = /@(\w+)/g;
  const mentions = [];
  let match;
  
  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push(match[1]);
  }
  
  return [...new Set(mentions)]; // Remove duplicates
};

// Format error response
const errorResponse = (message, statusCode = 500, details = null) => {
  return {
    success: false,
    message,
    ...(details && { details }),
    timestamp: new Date().toISOString()
  };
};

// Format success response
const successResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
};

// Pagination helper
const getPagination = (page, size) => {
  const limit = size ? +size : 20;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

module.exports = {
  generateToken,
  extractMentions,
  errorResponse,
  successResponse,
  getPagination
};
