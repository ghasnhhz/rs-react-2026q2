import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import MainLayout from '../MainLayout';
import SeasonDetails from '../SeasonDetails';
import ErrorBoundary from '../ErrorBoundary';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

function renderMain(searchTerm = '') {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<MainLayout searchTerm={searchTerm} />}>
          <Route path="details/:detailsId" element={<SeasonDetails />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('MainLayout Component', () => {
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

    renderMain();

    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  it('should render correct number of items when data is provided', async () => {
    global.fetch = vi.fn(() => Promise.resolve(mockResponse as Response));

    renderMain();

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

    renderMain();

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

    renderMain();

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

    renderMain();

    await waitFor(() => {
      expect(screen.getByText(/Error: 502/)).toBeInTheDocument();
    });
  });

  it('should fetch data when searchTerm prop changes', async () => {
    global.fetch = vi.fn(() => Promise.resolve(mockResponse as Response));

    const { rerender } = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<MainLayout searchTerm="" />}>
            <Route path="details/:detailsId" element={<SeasonDetails />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    vi.clearAllMocks();
    global.fetch = vi.fn(() => Promise.resolve(mockResponse as Response));

    rerender(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<MainLayout searchTerm="Discovery" />}>
            <Route path="details/:detailsId" element={<SeasonDetails />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('should hide loading state after data is fetched', async () => {
    global.fetch = vi.fn(() => Promise.resolve(mockResponse as Response));

    renderMain();

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

    renderMain();

    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });

  it('should throw error when error button is clicked', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    global.fetch = vi.fn(() => Promise.resolve(mockResponse as Response));

    render(
      <ErrorBoundary>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<MainLayout searchTerm="" />}>
              <Route path="details/:detailsId" element={<SeasonDetails />} />
            </Route>
          </Routes>
        </MemoryRouter>
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

  it('should show pagination when there are more than 10 results', async () => {
    const manySeasons = Array.from({ length: 11 }, (_, index) => ({
      uid: String(index + 1),
      title: `Season ${index + 1}`,
      series: { uid: '101', title: 'Star Trek: Discovery' },
      numberOfEpisodes: 10,
    }));

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({ seasons: manySeasons }),
      } as Response)
    );

    renderMain();

    await waitFor(() => {
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    });
  });

  it('should navigate to details when a card is selected', async () => {
    global.fetch = vi.fn(() => Promise.resolve(mockResponse as Response));

    renderMain();

    await waitFor(() => {
      expect(screen.getByText('DIS Season 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /DIS Season 1/i }));

    await waitFor(() => {
      expect(screen.getByLabelText('Season details')).toBeInTheDocument();
    });
  });

  it('should close details when list panel is clicked', async () => {
    global.fetch = vi.fn(async (input) => {
      const url = input.toString();
  
      if (url.includes('season?uid')) {
        return {
          ok: true,
          json: async () => ({
            season: {
              uid: '1',
              title: 'DIS Season 1',
              series: { uid: '101', title: 'Star Trek: Discovery' },
              numberOfEpisodes: 15,
            },
          }),
        } as Response;
      }
  
      return mockResponse as Response;
    }) as typeof fetch;
  
    render(
      <MemoryRouter initialEntries={['/details/1']}>
        <Routes>
          <Route path="/" element={<MainLayout searchTerm="" />}>
            <Route path="details/:detailsId" element={<SeasonDetails />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(screen.getByLabelText('Season details')).toBeInTheDocument();
    });
  
    fireEvent.click(screen.getByLabelText('Close details panel'));
  
    await waitFor(() => {
      expect(screen.queryByLabelText('Season details')).not.toBeInTheDocument();
    });
  });
  
  it('should close details on Enter key in list panel', async () => {
    global.fetch = vi.fn(async () => {
      return mockResponse as Response;
    }) as typeof fetch;
  
    render(
      <MemoryRouter initialEntries={['/details/1']}>
        <Routes>
          <Route path="/" element={<MainLayout searchTerm="" />}>
            <Route path="details/:detailsId" element={<SeasonDetails />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(screen.getByLabelText('Close details panel')).toBeInTheDocument();
    });
  
    fireEvent.keyDown(screen.getByLabelText('Close details panel'), { key: 'Enter' });
  
    await waitFor(() => {
      expect(screen.queryByLabelText('Season details')).not.toBeInTheDocument();
    });
  });
});
