import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { pathname } = useLocation();

  const links = [
    { path: "/", label: "📤 Upload" },
    { path: "/download", label: "📥 Download" }
  ];

  return (
    <aside className="w-48 h-screen bg-white shadow-md p-4 space-y-6">
      <h1 className="text-2xl font-bold text-indigo-600">🔐 Vault</h1>
      <nav className="flex flex-col space-y-2">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`p-2 rounded hover:bg-indigo-100 ${
              pathname === link.path ? "bg-indigo-200" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
