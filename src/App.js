import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './compontets/Auth';
import Dashboard from './compontets/Dashboard';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
