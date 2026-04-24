import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem('token', token.trim());
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-semibold text-slate-800">Login</h1>
        <p className="text-sm text-slate-500">Paste your JWT token to continue.</p>
        <textarea
          className="h-40 w-full rounded-md border border-slate-300 px-3 py-2 text-xs"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOi..."
          required
        />
        <button className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white" type="submit">
          Continue
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
