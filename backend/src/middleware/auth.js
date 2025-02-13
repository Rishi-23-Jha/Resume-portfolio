// import { auth } from '../config/firebase.js';

// export const authenticateRequest = async (req, res, next) => {
//     // Bypass authentication in development mode
//     if (process.env.NODE_ENV === 'development') {
//         console.log('Auth bypass enabled for development');
//         req.user = {
//             uid: 'test-user-123',
//             email: 'test@example.com',
//             role: 'admin'
//         };
//         return next();
//     }

//     try {
//         const authHeader = req.headers.authorization;
//         if (!authHeader?.startsWith('Bearer ')) {
//             return res.status(401).json({
//                 error: 'Authorization header must start with Bearer'
//             });
//         }

//         const token = authHeader.split('Bearer ')[1];
//         const decodedToken = await auth.verifyIdToken(token);

//         req.user = {
//             uid: decodedToken.uid,
//             email: decodedToken.email,
//             role: decodedToken.role || 'user'
//         };

//         next();
//     } catch (error) {
//         console.error('Authentication error:', error);
//         res.status(401).json({
//             error: 'Invalid or expired token'
//         });
//     }
// };

// src/middleware/auth.js
export const authenticateRequest = async (req, res, next) => {
    next(); // Bypass authentication for now
};