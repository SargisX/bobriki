import { Routes, Route } from 'react-router-dom';
import { Home } from './Pages/Home/Page';
import { Schedule } from './Pages/Schedule/Page';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/schedule" element={<Schedule />} />
    </Routes>
  );
}

export default App;
