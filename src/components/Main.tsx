import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import CardList from './CardList';
import './Main.css';

interface Season {
  uid: string;
  title: string;
  series: {
    uid: string;
    title: string;
  };
  numberOfEpisodes: number;
}

interface MainProps {
  searchTerm: string;
}

function Main({ searchTerm }: MainProps) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Season[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [shouldThrowError, setShouldThrowError] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const fetchSeasons = useCallback(async (term: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (term) {
        params.append('title', term);
      }
      const response = await fetch(
        'https://stapi.co',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params,
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setResults(data.seasons || []);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch seasons');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentPage !== 1 && searchParams.get('page') !== '1') {
      setSearchParams({ page: '1' });
    } else {
      const executeFetch = async () => {
        await fetchSeasons(searchTerm);
      };
      executeFetch();
    }
  }, [searchTerm, currentPage, searchParams, setSearchParams, fetchSeasons]);
  

  const handleErrorButtonClick = () => {
    setShouldThrowError(true);
  };

  if (shouldThrowError) {
    throw new Error('Test error from Main component');
  }

  return (
    <main className="main">
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && <CardList seasons={results} />}
      <button onClick={handleErrorButtonClick} className="error-button">
        Error
      </button>
    </main>
  );
}

export default Main;