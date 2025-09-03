const Joi = require('joi');

const schemas = {
  signup: Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters',
      'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  candidate: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required()
  }),

  message: Joi.object({
    candidateId: Joi.string().required(),
    content: Joi.string().min(1).max(2000).required(),
    taggedUsers: Joi.array().items(Joi.string()).default([])
  })
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details[0].message
      });
    }
    next();
  };
};

module.exports = {
  validate,
  schemas
};