import React, { Children } from "react";
import { Outlet, Link } from "react-router-dom";

const AdminLayout = () => {
  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <aside className="w-64 bg-indigo-600 p-4">
          <h1 className="font-bold text-white text-2xl">Admin Panel</h1>
          <nav>
            <ul className="text-white p-4">
              <li className="p-2 hover:bg-white hover:text-black rounded">
                <Link to="/admin">Dashboard</Link>
                {/* <link to="/admin">Dashboard</link> */}
              </li>
              <li className="p-2 hover:bg-white hover:text-black rounded">
                <Link to={'/admin/mahasiswa'}>Mahasiswa</Link>
              </li>
              <li className="p-2 hover:bg-white hover:text-black rounded">
                <Link>Settings</Link>
              </li>
            </ul>
          </nav>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow p-4 text-right">
            <button className="bg-blue-500 hover:bg-blue-700 p-2 rounded-md text-white">
              Log out
            </button>
          </header>

          <main className="flex-grow p-6 bg-blue-50">
            <Outlet />
          </main>

          <footer className="bg-indigo-900 p-4 text-white text-center">
            &copy; Admin Panel
          </footer>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
