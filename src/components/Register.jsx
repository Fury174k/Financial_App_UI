import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: ''  // ✅ Rename to match backend
    });
    const [error, setError] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.password2) {
            setError('Passwords do not match');
            return;
        }
        try {
            const form = new FormData();
            form.append('username', formData.username);
            form.append('email', formData.email);
            form.append('password', formData.password);
            form.append('password2', formData.password2); // ✅ Correct key
            if (profilePic) {
                form.append('profile_picture', profilePic);
            }
            const response = await fetch('https://financial-tracker-api-iq2a.onrender.com/api/register/', {
                method: 'POST',
                body: form,
            });
            if (response.ok) {
                navigate('/login');
            } else {
                const data = await response.json();
                let errorMsg = 'Registration failed';
                if (typeof data === 'object' && data !== null) {
                    errorMsg = Object.entries(data)
                        .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                        .join(' | ');
                }
                setError(errorMsg);
            }
        } catch (err) {
            setError('Network error');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="max-w-md p-4 mx-auto mt-10 bg-white rounded shadow">
            <h2 className="mb-6 text-2xl font-bold text-indigo-800">Register</h2>
            {error && <p className="mb-4 text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-4">
                    <label className="block mb-2">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Confirm Password</label>
                    <input
                        type="password"
                        name="password2"
                        value={formData.password2}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Profile Picture</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => setProfilePic(e.target.files[0])}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded">
                    Register
                </button>
            </form>
        </div>
    );
}