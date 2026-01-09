import { Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <div>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd', marginBottom: '1rem' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link to="/grounds" style={{ marginRight: '1rem' }}>Grounds</Link>
        <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
        <Link to="/register" style={{ marginRight: '1rem' }}>Register</Link>
        <Link to="/ground-manager" style={{ marginRight: '1rem' }}>Ground Manager</Link>
        <Link to="/admin">Admin</Link>
      </nav>

      <Routes>
        <Route path="/" element={<h1>Frontend Running</h1>} />
        <Route path="/grounds" element={<div>Grounds Page (coming soon)</div>} />
        <Route path="/login" element={<div>Login Page (coming soon)</div>} />
        <Route path="/register" element={<div>Register Page (coming soon)</div>} />
        <Route path="/ground-manager" element={<div>Ground Manager Dashboard (coming soon)</div>} />
        <Route path="/admin" element={<div>Admin Dashboard (coming later)</div>} />
      </Routes>
    </div>
  );
}

export default App;
