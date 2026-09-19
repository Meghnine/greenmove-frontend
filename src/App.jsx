import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import { useAuth } from "./auth/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Planner from "./pages/Planner";
import History from "./pages/History";

function PrivateRoute({ children }) {
  const { isAuthed } = useAuth();
  return isAuthed ? children : <Navigate to="/login" />;
}

export default function App() {
  const { isAuthed } = useAuth();

  return (
    <BrowserRouter>
      <Header />

      <Routes>
        {/* Public */}
        <Route
          path="/login"
          element={isAuthed ? <Navigate to="/planner" /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthed ? <Navigate to="/planner" /> : <Register />}
        />

        {/* Privé */}
        <Route
          path="/planner"
          element={
            <PrivateRoute>
              <Planner />
            </PrivateRoute>
          }
        />

        <Route
          path="/history"
          element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          }
        />

        {/* Défaut */}
        <Route path="*" element={<Navigate to="/planner" />} />
      </Routes>
    </BrowserRouter>
  );
}
