import jwt from 'jsonwebtoken';
import { config } from '../../config.js'; // replace './config' with the path to your config file

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

export const validateTokenMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
  
    console.log('Authorization Header:', authHeader);
  
    if (!authHeader) return res.status(403).send({ auth: false, message: 'No token provided.' });
  
    // Extract the token from the header value
    const parts = authHeader.split(' ');
    if (parts.length === 2) {
      const scheme = parts[0];
      const token = parts[1];
  
      console.log('Scheme:', scheme);
      console.log('Token:', token);
  
      if (/^Bearer$/i.test(scheme)) {
        jwt.verify(token, currentConfig.SESSION_SECRET, function(err, decoded) {
          if (err) {
            console.log('Token verification error:', err);
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
          }
  
          // if everything good, save to request for use in other routes
          req.userId = decoded.id;
          next();
        });
      } else {
        return res.status(403).send({ auth: false, message: 'Invalid token format.' });
      }
    } else {
      return res.status(403).send({ auth: false, message: 'Invalid token format.' });
    }
  }