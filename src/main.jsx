import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";

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
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import MakePledgeForm from "./components/MakePledgeForm";
import ProjectCard from "./components/ProjectCard";
import UpdateProject from "./components/UpdateProject";

// Define the router
const router = createBrowserRouter([
  {
    path: "/",
    element: <NavBar />,
    children: [
      {path: "/", element: <HomePage />},
      {path: "/login", element: <LoginPage />},
      {path: "/signup", element: <SignupPage />},
      {path: "/projects", element: <ProjectsPage />},
      {path: "/projects/:id", element: <ProjectPage />},
      {path: "/projects/create", element: <CreateProjectForm />},
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
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