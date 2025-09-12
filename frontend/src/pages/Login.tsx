import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      toast.error('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <div className="flex items-center justify-center mb-8">
          <LogIn className="h-8 w-8 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-amber-600 dark:bg-amber-500 text-white py-2 rounded-md 
                     hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm dark:text-gray-300">
          Don't have an account?{' '}
          <Link to="/register" className="text-amber-600 dark:text-amber-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}