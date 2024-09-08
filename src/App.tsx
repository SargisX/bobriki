import { Routes, Route } from "react-router-dom";
import { Home } from "./Pages/Home/Page";
import Navbar from "./components/Navbar";
import { Schedule } from "./Pages/Schedule/Page";
import { Error404 } from "./components/error404/Page";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="*" element={<Error404 />} />
      </Routes>

    </>
  );
}

export default App;