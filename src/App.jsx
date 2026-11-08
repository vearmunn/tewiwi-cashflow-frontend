import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/DashboardPage';
import Error from './pages/Error';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CategoriesPage from './pages/CategoriesPage';
import TransactionsPage from './pages/TransactionsPage';
import AddCashObligationPage from './pages/AddCashObligationPage';
import { Toaster } from 'sonner';
import AddTransactionPage from './pages/AddTransactionPage';

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/add-transaction" element={<AddTransactionPage />} />
            <Route path="/add-cash-obligation" element={<AddCashObligationPage />} />
          </Route>
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </>

  );
}

export default App;