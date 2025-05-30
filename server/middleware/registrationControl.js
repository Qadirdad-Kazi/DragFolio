/**
 * Middleware to control user registration based on environment variable
 * 
 * This middleware checks the ALLOW_REGISTRATION environment variable
 * and blocks registration requests if it's set to 'no'
 */

/**
 * Creates a middleware function that controls access to registration endpoints
 * @returns {Function} Express middleware function
 */
export const createMiddleware = () => {
  /**
   * Middleware function that checks if registration is allowed
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  return (req, res, next) => {
    // Only apply this middleware to registration routes
    if (req.path === '/api/auth/register' && req.method === 'POST') {
      // Check if registration is allowed
      const allowRegistration = process.env.ALLOW_REGISTRATION?.toLowerCase() === 'yes';
      
      if (!allowRegistration) {
        return res.status(403).json({
          error: 'Registration is currently disabled by the administrator',
          message: 'New user registration is not allowed at this time'
        });
      }
    }
    
    // If registration is allowed or this is not a registration request, proceed
    next();
  };
};

/**
 * Utility function to check if registration is allowed
 * @returns {boolean} True if registration is allowed, false otherwise
 */
export const isRegistrationAllowed = () => {
  return process.env.ALLOW_REGISTRATION?.toLowerCase() === 'yes';
};
