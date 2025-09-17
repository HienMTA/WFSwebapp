
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { authenticateUser, users as mockUsers } from '../services/mockApi';
import { User } from '../types';

const LoginPage: React.FC = () => {
    const [selectedUsername, setSelectedUsername] = useState<string>('');
    const [password, setPassword] = useState('password'); // Dummy password
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeUsers, setActiveUsers] = useState<User[]>([]);
    
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const active = mockUsers.filter(u => u.is_active);
        setActiveUsers(active);
        if (active.length > 0) {
            setSelectedUsername(active[0].username);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!selectedUsername) {
            setError('Please select a user to log in.');
            setLoading(false);
            return;
        }

        const user = await authenticateUser(selectedUsername);
        setLoading(false);

        if (user) {
            auth.login(user);
            navigate('/', { replace: true });
        } else {
            setError('Authentication failed. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Windows Forensic System
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Sign in to your account
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="user-select" className="sr-only">Select User</label>
                            <select
                                id="user-select"
                                value={selectedUsername}
                                onChange={(e) => setSelectedUsername(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                            >
                                {activeUsers.map(user => (
                                    <option key={user.user_id} value={user.username}>
                                        {user.full_name} ({user.role})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="password-sr" className="sr-only">Password</label>
                            <input
                                id="password-sr"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
