import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showApiDelay, setShowApiDelay] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login, googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setShowApiDelay(false);
        const delayTimer = setTimeout(() => setShowApiDelay(true), 5000);
        try {
            const success = await login(username, password);
            clearTimeout(delayTimer);
            setShowApiDelay(false);
            setLoading(false);
            if (success) {
                navigate('/');
                console.log('Login successful');
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            clearTimeout(delayTimer);
            setShowApiDelay(false);
            setLoading(false);
            setError('An error occurred during login');
            console.error(err);
        }
    };

    const handleGoogleLoginSuccess = async (response) => {
        const tokenId = response.credential;
        setLoading(true);
        setError('');
        try {
            const result = await googleLogin(tokenId);
            console.log('Google login result:', result);
            if (result.success) {
                // The AuthContext will handle the redirect now
                navigate('/');
            } else {
                setError('Google authentication failed');
            }
        } catch (error) {
            console.error('Google login error:', error);
            setError('An error occurred during Google authentication');
        } finally {
            setLoading(false);
        }
    };

    const LoadingSpinner = () => (
        <div className="inline-flex items-center">
            <div className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
            Signing you in...
        </div>
    );

    return (
        <GoogleOAuthProvider clientId="229716200894-s5qp9sofhrh9diu39que111jlnhljg4q.apps.googleusercontent.com">
            <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-slate-50 to-gray-100">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-indigo-800 rounded-full">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">Welcome Back</h1>
                        <p className="text-gray-600">Sign in to your account to continue</p>
                    </div>

                    {/* Login Form */}
                    <div className="p-6 border shadow-xl bg-white/80 backdrop-blur-sm border-white/20 rounded-2xl">
                        {/* Error Alert */}
                        {error && (
                            <div className="flex items-center p-3 mb-4 border border-red-200 rounded-lg bg-red-50">
                                <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm text-red-700">{error}</span>
                            </div>
                        )}

                        {/* API Delay Warning */}
                        {showApiDelay && (
                            <div className="flex items-center p-3 mb-4 border rounded-lg bg-amber-50 border-amber-200">
                                <svg className="w-5 h-5 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <span className="text-sm text-amber-700">The free-tier API may take a moment to respond. Please bear with us.</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Username Field */}
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700">Username</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-800 focus:ring-4 focus:ring-indigo-800/10 bg-gray-50 hover:bg-white"
                                        placeholder="Enter your username"
                                        required
                                        disabled={loading}
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-800 focus:ring-4 focus:ring-indigo-800/10 bg-gray-50 hover:bg-white"
                                        placeholder="Enter your password"
                                        required
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                        disabled={loading}
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414l4.242 4.242M12 3c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21l-6-6m0 0l-6-6m6 6L9 9" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 text-white font-semibold bg-indigo-800 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-800/20 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                {loading ? <LoadingSpinner /> : 'Sign In'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-3 text-gray-500 bg-white">Or continue with</span>
                            </div>
                        </div>

                        {/* Google Login */}
                        <div className="w-full">
                            <GoogleLogin
                                onSuccess={handleGoogleLoginSuccess}
                                onFailure={(error) => console.error('Google login failed:', error)}
                                cookiePolicy={'single_host_origin'}
                                useOneTap={false}
                                size="large"
                                width="100%"
                                theme="outline"
                                text="signin_with"
                                disabled={loading}
                            />
                        </div>

                        {/* Register Link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link 
                                    to="/register" 
                                    className="font-semibold text-indigo-800 transition-colors duration-200 hover:text-indigo-600 hover:underline"
                                >
                                    Create one here
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-500">
                            By signing in, you agree to our Terms of Service and Privacy Policy
                        </p>
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
}