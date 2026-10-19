import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/DashboardPage';
import Error from './pages/Error';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;