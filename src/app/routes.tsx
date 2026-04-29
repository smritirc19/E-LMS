import { createBrowserRouter } from "react-router";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import MyCourses from "./pages/MyCourses";
import Certificate from "./pages/Certificate";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "courses", Component: Courses },
      { path: "course/:id", Component: CourseDetail },
      { path: "my-courses", Component: MyCourses },
      { path: "certificate/:courseId", Component: Certificate },
    ],
  },
]);
