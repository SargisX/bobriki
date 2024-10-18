import { Routes, Route } from "react-router-dom";
import { Home } from "./Pages/Home/Page";
import Navbar from "./components/navbar/Navbar";
import { Schedule } from "./Pages/Schedule/Page";
import { Error404 } from "./components/error404/Page";
import "./App.css";
import { Services } from "./Pages/Services/Page";
import { SolutionPage } from "./components/gaussianScheme/Solution";
import { GaussianSolver } from "./components/gaussianScheme/gaussian_scheme";
import { Calculator } from "./components/calculator/calculator";
import { FreeSite } from "./components/freeSites/freeSite";
import { FreeSitePage } from "./components/freeSites/freeSitePage";

function App() {
  return (
    <>
      <Navbar />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gaussian-scheme" element={<GaussianSolver />} />
          <Route path="/solution/:timestamp" element={<SolutionPage />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/free-sites" element={<FreeSite />} />
          <Route path="/free-sites/:siteid" element={<FreeSitePage />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
