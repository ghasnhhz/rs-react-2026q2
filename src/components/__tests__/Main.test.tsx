import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import Main from '../Main';
import ErrorBoundary from '../ErrorBoundary';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Main Component', () => {
  const mockSeasons = [
    {
      uid: '1',
      title: 'DIS Season 1',
      series: {
        uid: '101',
        title: 'Star Trek: Discovery',
      },
      numberOfEpisodes: 15,
    },
  ];

  const mockResponse = {
    ok: true,
    json: async () => ({ seasons: mockSeasons }),
  };

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state while fetching data', async () => {
    const mockFetch = vi.fn((): Promise<Response> => new Promise(() => {}));
    global.fetch = mockFetch;

    render(<Main searchTerm="" />);

    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  it('should render correct number of items when data is provided', async () => {
    global.fetch = vi.fn(() => Promise.resolve(mockResponse as Response));

    render(<Main searchTerm="" />);

    await waitFor(() => {
      expect(screen.getByText('DIS Season 1')).toBeInTheDocument();
    });
  });

  it('should display error message when API call fails', async () => {
    const errorResponse = {
      ok: false,
      status: 500,
      json: async () => ({}),
    };
    global.fetch = vi.fn(() => Promise.resolve(errorResponse as Response));

    render(<Main searchTerm="" />);

    await waitFor(() => {
      expect(screen.getByText(/Error: 500/)).toBeInTheDocument();
    });
  });

  it('should show appropriate error for 4xx status codes', async () => {
    const errorResponse = {
      ok: false,
      status: 404,
      json: async () => ({}),
    };
    global.fetch = vi.fn(() => Promise.resolve(errorResponse as Response));

    render(<Main searchTerm="" />);

    await waitFor(() => {
      expect(screen.getByText(/Error: 404/)).toBeInTheDocument();
    });
  });

  it('should show appropriate error for 5xx status codes', async () => {
    const errorResponse = {
      ok: false,
      status: 502,
      json: async () => ({}),
    };
    global.fetch = vi.fn(() => Promise.resolve(errorResponse as Response));

    render(<Main searchTerm="" />);

    await waitFor(() => {
      expect(screen.getByText(/Error: 502/)).toBeInTheDocument();
    });
  });

  it('should fetch data when searchTerm prop changes', async () => {
    global.fetch = vi.fn(() => Promise.resolve(mockResponse as Response));

    const { rerender } = render(<Main searchTerm="" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    vi.clearAllMocks();
    global.fetch = vi.fn(() => Promise.resolve(mockResponse as Response));

    rerender(<Main searchTerm="Discovery" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('should hide loading state after data is fetched', async () => {
    global.fetch = vi.fn(() => Promise.resolve(mockResponse as Response));

    render(<Main searchTerm="" />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('DIS Season 1')).toBeInTheDocument();
  });

  it('should display "no results" when seasons array is empty', async () => {
    const emptyResponse = {
      ok: true,
      json: async () => ({ seasons: [] }),
    };
    global.fetch = vi.fn(() => Promise.resolve(emptyResponse as Response));

    render(<Main searchTerm="" />);

    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });
    
  it('should throw error when error button is clicked', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    global.fetch = vi.fn(() => Promise.resolve(mockResponse as Response));

    render(
      <ErrorBoundary>
        <Main searchTerm="" />
      </ErrorBoundary>
    );

    await waitFor(() => {
      expect(screen.getByText('DIS Season 1')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /error/i }));
    });

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});