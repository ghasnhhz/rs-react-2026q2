import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { store } from './store/store';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import MainLayout from './components/MainLayout';
import SeasonDetails from './components/SeasonDetails';
import Flyout from './components/Flyout';
import About from './pages/About';
import NotFound from './pages/NotFound';
import { readLocalStorage, SEARCH_TERM_KEY } from './hooks/useLocalStorage';
import { useState } from 'react';
import { ThemeProvider } from './context/ThemeProvider';

function AppRoutes() {
  const [searchTerm, setSearchTerm] = useState<string>(
    () => readLocalStorage(SEARCH_TERM_KEY).trim()
  );
  const navigate = useNavigate();

  const handleSearch = (term: string) => {
    const cleanTerm = term.trim();
    if (cleanTerm === searchTerm) return;
    setSearchTerm(cleanTerm);
    navigate({ pathname: '/', search: '' }, { replace: true });
  };

  return (
    <>
      <Header onSubmitted={handleSearch} />
      <Routes>
        <Route path="/" element={<MainLayout searchTerm={searchTerm} />}>
          <Route path="details/:detailsId" element={<SeasonDetails />} />
        </Route>
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Flyout />
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;