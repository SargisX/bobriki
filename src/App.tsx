import { Routes, Route, Navigate } from "react-router-dom"
import { Home } from "./Pages/Home/Page"
import Navbar from "./components/navbar/Navbar"
import { Schedule } from "./Pages/Schedule/Page"
import { Error404 } from "./components/error404/Page"
import "./App.css"
import { Services } from "./Pages/Services/Page"
import { SolutionPage } from "./components/gaussianScheme/Solution"
import { GaussianSolver } from "./components/gaussianScheme/gaussian_scheme"
import { Calculator } from "./components/calculator/calculator"
import { FreeSite } from "./components/freeSites/freeSite"
import { FreeSitePage } from "./components/freeSites/freeSitePage"
import SignIn from "./Pages/SignIn/Page"
import SignUp from "./Pages/SignUp/Page"
import { useEffect, useState } from "react"
import { isSessionValid, getUserRole } from "./components/auth/authUtils"
import { AdminComponent } from "./components/auth/adminComp"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {

    const validSession = isSessionValid()
    setIsLoggedIn(validSession)

    if (validSession) {
      setRole(getUserRole())
    } else {
      setRole(null)
    }
  }, [])

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
              </>
            )
          }

          <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <SignUp />} />
          <Route path="/signin" element={isLoggedIn ? <Navigate to="/" /> : <SignIn setIsLoggedIn={setIsLoggedIn} setRole={setRole} />} />

          {role === 'admin' && <Route path="/admin" element={<AdminComponent />} />}

          <Route path="*" element={<Error404 />} />
        </Routes>
      </div>
    </>
  )
}

export default App
