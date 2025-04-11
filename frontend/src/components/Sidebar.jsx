import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";

const Sidebar = () => {
  const { pathname } = useLocation();

  const links = [
    { path: "/", label: "📤 Upload" },
    { path: "/download", label: "📥 Download" }
  ];

  return (
    <aside className="sidebar">
      <h1 className="sidebar-title">🔐 Vault</h1>
      <nav className="nav-links">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`nav-link ${pathname === link.path ? "active" : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
