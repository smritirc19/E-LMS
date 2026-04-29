import Navbar from '../components/Navbar'; // 👈 Use your smart Navbar
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar /> 
      <main className="flex-1">
        {/* The Outlet is where Home, Courses, and Profile will be "injected" */}
        <Outlet />
      </main>
      {/* You can add a <Footer /> here later! */}
    </div>
  );
}