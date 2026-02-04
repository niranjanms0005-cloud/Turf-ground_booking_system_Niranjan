import { Outlet, Link } from 'react-router-dom';

// Public layout used only for:
// - Home (/)
// - Login (/login)
// - Register (/register)
// Contains the public navbar (Home, Login, Register) and renders public pages via <Outlet />.
function PublicLayout() {
  return (
    <div>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd', marginBottom: '1rem' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
        <Link to="/register">Register</Link>
      </nav>

      {/* Public pages (Home, Login, Register) render here */}
      <Outlet />
    </div>
  );
}

export default PublicLayout;

