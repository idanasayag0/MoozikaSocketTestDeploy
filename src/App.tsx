import React from "react";
import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Navbar from "./components/Navbar/Navbar.tsx";
import Footer from "./components/footer/footer.tsx";

import HomePage from "./pages/HomePage/HomePage.tsx";
import CartPage from "./pages/CartPage/CartPage.tsx";
import SignUpPage from "./pages/SignUpPage/SignUpPage.tsx";
import SongPage from "./pages/SongPage/SongPage.tsx";
import UserProfile from "./pages/UserPage/UserPage.tsx";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.tsx";
import { gapi } from "gapi-script";
import PrivateRoutes from "./components/privateRoutes/PrivateRoutes.tsx";
import Chat from "./components/chat/Chat";

const routes = [
  { path: "/", element: <HomePage /> },
  { path: "/signup", element: <SignUpPage /> },
  { path: "/chat", element: <Chat /> },
  { path: "/song/:id", element: <SongPage /> },
  { path: "*", element: <NotFoundPage /> },
];
const privateRoutes = [
  { path: "/cart", element: <CartPage /> },
  { path: "/profile", element: <UserProfile /> },
];

gapi.load("client:auth2", () => {
  gapi.client.init({
    clientId: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
    //TODO:check what is the chat for
    plugin_name: "chat",
  });
});
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Navbar />}>
        <Route path="/" element={<Footer />}>
          <Route path="/" element={<HomePage />} />
          {routes.map(({ path, element }) => {
            return <Route key={path} path={path} element={element} />;
          })}
          <Route element={<PrivateRoutes />}>
            {privateRoutes.map(({ path, element }) => {
              return <Route key={path} path={path} element={element} />;
            })}
          </Route>
        </Route>
      </Route>
    </>
  )
);
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <div style={{ flex: 1 }}>
          <RouterProvider router={router} />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
