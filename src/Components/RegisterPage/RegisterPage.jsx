import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, ensureUserDocuments } from '../../firebase';
import AuthForm from '../Login/AuthForm';
import InputField from '../Login/inputField';



const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const user = res.user;
            // Ensure user documents exist
            await ensureUserDocuments(user);
            sessionStorage.setItem('isAuthenticated', 'true');
            navigate('/');
        } catch (err) {
            // Custom error message for registration errors
            if (err.code === 'auth/email-already-in-use') {
                setError('This Gmail is already registered');
            } else if (err.code === 'auth/weak-password') {
                setError('Password should be at least 6 characters');
            } else {
                setError(err.message.replace('Firebase: ', ''));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError('');
        const provider = new GoogleAuthProvider();
        try {
            const res = await signInWithPopup(auth, provider);
            const user = res.user;
            // Ensure user documents exist
            await ensureUserDocuments(user);
            sessionStorage.setItem('isAuthenticated', 'true');
            navigate('/');
        } catch (err) {
            // Custom error message for Google sign-in errors
            if (err.code === 'auth/popup-closed-by-user') {
                setError('Sign-in was cancelled');
            } else {
                setError(err.message.replace('Firebase: ', ''));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const fields = [
        {
            id: 'email',
            component: <InputField label="Email Address" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        },
        {
            id: 'password',
            component: <InputField label="Password" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 6 characters" />
        },
        {
            id: 'confirmPassword',
            component: <InputField label="Confirm Password" id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
        }
    ];

    return (
        <AuthForm
            title="Create Your Account"
            formType="register"
            fields={fields}
            handleSubmit={handleRegister}
            buttonText="Register"
            footerText="Already have an account?"
            footerLink="/login"
            footerLinkText="Log In"
            error={error}
            isLoading={isLoading}
            onGoogleSignIn={handleGoogleSignIn}
        />
    );
};

export default RegisterPage;