import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Courses from './pages/Courses';
import MyCourses from './pages/MyCourses';
import Certificate from './pages/Certificate';
import Signup from './pages/Signup';
import CoursePage from './pages/CoursePage';
import CoursePlayer from './pages/CoursePlayer';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import MockPayment from './pages/MockPayment';

export default function App() {
  return (
    <BrowserRouter>
    {/* 2. Place it here (Outside Routes) */}
      <Routes>
        {/* 🟢 Auth Pages: Move these OUTSIDE the Layout tag */}
        {/* These will now be full-screen separate pages */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* 🔵 App Pages: These will still have your sidebars/headers */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
          <Route path="/course-player/:courseId" element={<CoursePlayer />} />
          <Route path="/certificate/:courseId" element={<Certificate />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout/:mongoId" element={<MockPayment />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}