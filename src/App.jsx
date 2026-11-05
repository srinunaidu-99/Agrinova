import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/register";
import Dashboard from "./pages/Dashboard";
import Crops from "./pages/Crops";
import Weather from "./pages/Weather";
import Market from "./pages/Market";
import Assistant from "./pages/Assistant";
import ComponentsTest from "./pages/ComponentsTest";

import ProtectedRoute from "./components/ProtectedRoute";
import AICopilotWidget from "./components/AICopilotWidget";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* AI ASSISTANT / COPILOT */}
        <Route path="/assistant" element={<Assistant />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/crops"
          element={
            <ProtectedRoute>
              <Crops />
            </ProtectedRoute>
          }
        />

        <Route
          path="/weather"
          element={
            <ProtectedRoute>
              <Weather />
            </ProtectedRoute>
          }
        />

        <Route
          path="/market"
          element={
            <ProtectedRoute>
              <Market />
            </ProtectedRoute>
          }
        />

        <Route path="/components-test" element={<ComponentsTest />} />

        {/* FALLBACK REDIRECT */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* GLOBAL FLOATING AI COPILOT WIDGET */}
      <AICopilotWidget />
    </BrowserRouter>
  );
}

export default App;