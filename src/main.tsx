import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router";
import HomePage from './components/HomePage';
import RoomPage from './components/RoomPage';
import { ThemeProvider } from './components/theme-provider';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/room/:roomId",
    element: <RoomPage />,
  },
]);

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </StrictMode>,
  );
} else {
  console.error("Failed to find the root element.");
}