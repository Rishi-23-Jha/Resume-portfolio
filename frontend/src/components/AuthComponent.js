import React, { useState, useEffect } from 'react';
import {
    auth,
} from '../firebase'; // Adjust path as needed
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';

const AuthComponent = () => {
    // State for form inputs and user authentication
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    // Listen for authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        // Cleanup subscription
        return () => unsubscribe();
    }, []);

    // Sign Up Handler
    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            console.log('User created:', userCredential.user);
        } catch (error) {
            setError(error.message);
            console.error('Sign-up error:', error);
        }
    };

    // Login Handler
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            console.log('Logged in:', userCredential.user);
        } catch (error) {
            setError(error.message);
            console.error('Login error:', error);
        }
    };

    // Logout Handler
    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log('User logged out');
        } catch (error) {
            setError(error.message);
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="auth-container">
            {user ? (
                <div>
                    <p>Welcome, {user.email}</p>
                    <button
                        onClick={handleLogout}
                        className="logout-btn"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <div>
                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                        <div>
                            <button
                                type="submit"
                                className="login-btn"
                            >
                                Login
                            </button>
                            <button
                                onClick={handleSignUp}
                                className="signup-btn"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AuthComponent;