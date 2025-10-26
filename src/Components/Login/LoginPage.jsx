import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, ensureUserDocuments } from '../../firebase';
import AuthForm from './AuthForm';
import InputField from './inputField';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError('');
    try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        const user = res.user;
        
        // Ensure user documents exist
        await ensureUserDocuments(user);
        
        sessionStorage.setItem('isAuthenticated', 'true');
        navigate('/');
    } catch (err) {
        // Custom error message for wrong credentials
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
            setError('Invalid username or password');
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
            // Custom error message for wrong credentials
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setError('Invalid username or password');
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
            component: <InputField label="Password" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        }
    ];

    return (
        <AuthForm
            title="Welcome Back!"
            formType="login"
            fields={fields}
            handleSubmit={handleLogin}
            buttonText="Log In"
            footerText="Don’t have an account?"
            footerLink="/register"
            footerLinkText="Sign Up"
            error={error}
            isLoading={isLoading}
            onGoogleSignIn={handleGoogleSignIn}
        />
    );
};

export default LoginPage;