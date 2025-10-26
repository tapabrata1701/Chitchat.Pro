import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Components/Login/LoginPage";
import RegisterPage from "./Components/RegisterPage/RegisterPage";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import ChatLayout from "./Components/chatUI/ChatLayout";
import { ToastContainer, toast } from 'react-toastify';

function App() {
  return (
    <>
    <ToastContainer/>
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Chat Layout */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <ChatLayout />
          </ProtectedRoute>
        }
      />

      {/* Default redirect to the main app layout if authenticated, else to login */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    </>
  );
}

export default App;