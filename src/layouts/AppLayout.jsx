import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const links = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Executions', to: '/executions' },
];

const AppLayout = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-900 p-4 text-white transition-transform md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Execution Tracker</h1>
          <button className="md:hidden" onClick={() => setOpen(false)}>✕</button>
        </div>
        <nav className="space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm ${isActive ? 'bg-slate-700' : 'text-slate-300 hover:bg-slate-800'}`
              }
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between bg-white px-4 py-3 shadow-sm md:px-6">
          <button className="rounded border px-2 py-1 text-sm md:hidden" onClick={() => setOpen(true)}>
            ☰
          </button>
          <p className="text-sm text-slate-500">Smart Execution Tracking System</p>
          <button onClick={logout} className="rounded-md bg-slate-900 px-3 py-1.5 text-sm text-white">
            Logout
          </button>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
