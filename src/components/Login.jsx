import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(username, password);
        if (success) {
            navigate('/');
            console.log('Login successful');
        } else {
            setError('Invalid credentials');
        }
    };

    const handleGoogleLoginSuccess = async (response) => {
        const tokenId = response.credential;
        try {
            const result = await googleLogin(tokenId);
            console.log('Google login result:', result);
            if (result.success) {
                if (result.has_bank_account) {
                    navigate('/');
                } else {
                    navigate('/add-account');
                }
            } else {
                setError('Google authentication failed');
            }
        } catch (error) {
            console.error('Google login error:', error);
            setError('An error occurred during Google authentication');
        }
    };

    return (
        <GoogleOAuthProvider clientId="229716200894-s5qp9sofhrh9diu39que111jlnhljg4q.apps.googleusercontent.com">
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="max-w-md w-full bg-white p-4 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold text-center text-indigo-800 mb-6">Login</h2>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition duration-200"
                        >
                            Login
                        </button>
                    </form>
                    <div className="mt-4">
                        <GoogleLogin
                            onSuccess={handleGoogleLoginSuccess}
                            onFailure={(error) => console.error('Google login failed:', error)}
                            cookiePolicy={'single_host_origin'}
                            className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition duration-200"
                        />
                    </div>
                    <p className="text-sm text-center text-gray-600 mt-4">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-500 hover:underline">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
}