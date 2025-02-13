import { auth } from '../config/firebase.js';

async function generateToken() {
    try {
        // Get existing user
        const userRecord = await auth.getUserByEmail('test@example.com');

        // Generate custom token
        const token = await auth.createCustomToken(userRecord.uid);

        console.log('Generated Token:', token);
        console.log('User ID:', userRecord.uid);

        return token;
    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            // If user doesn't exist, create new one
            const newUser = await auth.createUser({
                email: 'test@example.com',
                password: 'testpassword123'
            });
            const token = await auth.createCustomToken(newUser.uid);
            console.log('New user created');
            console.log('Generated Token:', token);
            console.log('User ID:', newUser.uid);
            return token;
        } else {
            console.error('Error:', error);
            throw error;
        }
    }
}

// Execute the function
generateToken();