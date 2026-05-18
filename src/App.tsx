import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Main from './components/Main';
import About from './pages/About';
import NotFound from './pages/NotFound';

function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = (term: string) => {
    const cleanTerm = term.trim();
    if (cleanTerm === searchTerm) return;
    setSearchTerm(cleanTerm);
  };

  return (
    <Router>
      <ErrorBoundary>
        <Header onSubmitted={handleSearch} />
        <Routes>
          <Route path="/" element={<Main searchTerm={searchTerm} />} />
          <Route path="/:page" element={<Main searchTerm={searchTerm} />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;