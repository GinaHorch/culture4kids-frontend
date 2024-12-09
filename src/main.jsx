import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Here we import pages
import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";
import ProjectsPage from "./pages/ProjectsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
// Here we import components
import NavBar from "./components/NavBar";
import { AuthProvider } from "./components/AuthProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import CreateProjectForm from "./components/CreateProjectForm";
import ProjectCard from "./components/ProjectCard";

// Define the router
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <NavBar /> {/* Always render NavBar */}
        <HomePage /> {/* Default page */}
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <NavBar />
        <LoginPage />
      </>
    ),
  },
  {
    path: "/signup",
    element: (
      <>
        <NavBar />
        <SignupPage />
      </>
    ),
  },
  {
    path: "/projects",
    element: (
      <>
        <NavBar />
        <ProjectsPage />
      </>
    ),
  },
  {
    path: "/projects/:id",
    element: (
      <>
        <NavBar />
        <ProjectPage />
      </>
    ),
  },
  {
    path: "/projects/create",
    element: (
      <>
        <NavBar />
        <CreateProjectForm />
      </>
    ),
  },
  {
    path: "*",
    element: (
      <>
        <NavBar />
        <h1>404 Not Found</h1>
      </>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </AuthProvider>
  </React.StrictMode>
);