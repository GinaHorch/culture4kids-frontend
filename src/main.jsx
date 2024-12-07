import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Here we import out pages
import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";
import ProjectsPage from "./pages/ProjectsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
// Here we import our components
import NavBar from "./components/NavBar";
import { AuthProvider } from "./components/AuthProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import CreateProjectForm from "./components/CreateProjectForm";
import ProjectCard from "./components/ProjectCard";

// Here we create our router and tell it whats pages to render at what path
const router = createBrowserRouter([
  // These are the three routes!
  {
    path: "/",
    // Putting our NavBar as the main component will causes the children to render in the <Outlet />
     element: <NavBar />,
     children: [
          { path: "/", element: <HomePage /> },
          { path: "/login", element: <LoginPage /> },
          { path: "/signup", element: <SignupPage /> },
          { path: "/projects", element: <ProjectsPage /> },
          { path: "/projects/:id", element: <ProjectPage /> },
          { path: "/projects/create", element: <CreateProjectForm /> },
          { path: "*", element: <h1>404 Not Found</h1> },
     ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <AuthProvider>
        <ErrorBoundary>
    {/* Here we wrap our app in the router provider so the pages render */}
          <RouterProvider router={router} />
        </ErrorBoundary>
      </AuthProvider>
  </React.StrictMode>
);