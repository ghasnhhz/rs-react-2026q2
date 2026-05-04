import { Component } from 'react';
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

interface MainState {
  loading: boolean;
  results: Season[];
  error: string | null;
}

class Main extends Component<MainProps, MainState> {
  constructor(props: MainProps) {
    super(props);
    this.state = {
      loading: false,
      results: [],
      error: null,
    };
  }

  componentDidMount(): void {
    if (this.props.searchTerm) {
      this.fetchSeasons(this.props.searchTerm);
    } else {
      this.fetchSeasons('');
    }
  }

  componentDidUpdate(prevProps: MainProps): void {
    if (prevProps.searchTerm !== this.props.searchTerm) {
      this.fetchSeasons(this.props.searchTerm);
    }
  }

  private fetchSeasons = async (term: string) => {
    this.setState({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (term) {
        params.append('title', term);
      }

      const response = await fetch(
        'http://stapi.co/api/v1/rest/season/search',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params,
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      this.setState({ results: data.seasons || [], loading: false });
    } catch (err) {
      this.setState({
        error: err instanceof Error ? err.message : 'Failed to fetch seasons',
        loading: false,
      });
    }
  };

  handleErrorButtonClick = () => {
    throw new Error('Test error from Main component');
  };

  render() {
    const { loading, results, error } = this.state;

    return (
      <main className="main">
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && <CardList seasons={results} />}
        <button onClick={this.handleErrorButtonClick} className="error-button">
          Error
        </button>
      </main>
    );
  }
}

export default Main;
