import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import Navbar from "./components/navbar/Navbar";
import { Home } from "./Pages/Home/Page";
import { Schedule } from "./Pages/Schedule/Page";
import { Error404 } from "./components/error404/Page";
import { Services } from "./Pages/Services/Page";
import { SolutionPage } from "./components/gaussianScheme/Solution";
import { GaussianSolver } from "./components/gaussianScheme/gaussian_scheme";
import { Calculator } from "./components/calculator/calculator";
import { FreeSite } from "./components/freeSites/freeSite";
import { FreeSitePage } from "./components/freeSites/freeSitePage";
import SignIn from "./Pages/SignIn/Page";
import SignUp from "./Pages/SignUp/Page";
import { Admin } from "./Pages/Admin/Page";
import { UserList } from "./components/Users/userList";
import { 
  isSessionValid, 
  getUserRole, 
  clearSession, 
  getCurrentSession 
} from "./components/auth/authUtils";
import { checkUserById } from "./components/Users/users.api";
import { useNotifications } from "./hooks/Notification/useNotification";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);
  const { requestPermission } = useNotifications();

  // Centralized logout function
  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setRole(null);
    clearSession();
  }, []);

  // Check user session validity on load and sync role
  const checkUserSession = useCallback(async () => {
    const validSession = isSessionValid();
    setIsLoggedIn(validSession);

    if (!validSession) {
      logout();
      return;
    }

    const usersSession = getCurrentSession();
    setRole(getUserRole());

    try {
      const userExists = usersSession && await checkUserById(usersSession.userId);
      if (!userExists) logout();
    } catch (error) {
      console.error("User not found or error occurred:", error);
      logout();
    }
  }, [logout]);

  // Run session check and notification permission on mount
  useEffect(() => {
    requestPermission();
    checkUserSession();
    window.addEventListener("online", checkUserSession);

    return () => window.removeEventListener("online", checkUserSession);
  }, [checkUserSession, requestPermission]);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} role={role} setIsLoggedIn={setIsLoggedIn} setRole={setRole} />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          {
            isLoggedIn && (
              <>
                <Route path="/schedule" element={isLoggedIn ? <Schedule /> : <Navigate to="/signin" />} />
                <Route path="/services" element={isLoggedIn ? <Services /> : <Navigate to="/signin" />} />
                <Route path="/gaussian-scheme" element={isLoggedIn ? <GaussianSolver /> : <Navigate to="/signin" />} />
                <Route path="/solution/:timestamp" element={isLoggedIn ? <SolutionPage /> : <Navigate to="/signin" />} />
                <Route path="/calculator" element={isLoggedIn ? <Calculator /> : <Navigate to="/signin" />} />
                <Route path="/free-sites" element={isLoggedIn ? <FreeSite /> : <Navigate to="/signin" />} />
                <Route path="/free-sites/:siteid" element={isLoggedIn ? <FreeSitePage /> : <Navigate to="/signin" />} />
                <Route path="/users" element={isLoggedIn ? <UserList /> : <Navigate to="/signin" />} />
              </>
            )
          }

          <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <SignUp />} />
          <Route path="/signin" element={isLoggedIn ? <Navigate to="/" /> : <SignIn setIsLoggedIn={setIsLoggedIn} setRole={setRole} />} />

          {role === 'admin' && <Route path="/admin" element={<Admin />} />}

          <Route path="*" element={<Error404 />} />
        </Routes>
      </div>
    </>
  )
}

export default App;
