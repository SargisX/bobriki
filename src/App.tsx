import { Routes, Route } from "react-router-dom";
import { Home } from "./Pages/Home/Page";
import Navbar from "./components/navbar/Navbar";
import { Schedule } from "./Pages/Schedule/Page";
import { Error404 } from "./components/error404/Page";
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '4rem' }}>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="*" element={<Error404 />} />
      </Routes>

    </>
  );
}

export default App;