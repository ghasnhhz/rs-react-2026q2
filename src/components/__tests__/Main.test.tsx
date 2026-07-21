import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MainLayout from '../MainLayout';
import SeasonDetails from '../SeasonDetails';
import ErrorBoundary from '../ErrorBoundary';
import selectedItemsReducer from '../../store/slices/selectedItemsSlice';
import { seasonsApi } from '../../store/api/seasonsApi';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

function makeStore() {
  return configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
      [seasonsApi.reducerPath]: seasonsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(seasonsApi.middleware),
  });
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function renderMain(searchTerm = '', initialEntries = ['/']) {
  const store = makeStore();
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/" element={<MainLayout searchTerm={searchTerm} />}>
              <Route path="details/:detailsId" element={<SeasonDetails />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    ),
  };
}

describe('MainLayout Component', () => {
  const mockSeasons = [
    {
      uid: '1',
      title: 'DIS Season 1',
      series: { uid: '101', title: 'Star Trek: Discovery' },
      numberOfEpisodes: 15,
    },
  ];

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state while fetching data', async () => {
    global.fetch = vi.fn((): Promise<Response> => new Promise(() => {}));
    renderMain();
    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  it('should render correct number of items when data is provided', async () => {
    global.fetch = vi.fn(() => Promise.resolve(jsonResponse({ seasons: mockSeasons })));
    renderMain();
    await waitFor(() => {
      expect(screen.getByText('DIS Season 1')).toBeInTheDocument();
    });
  });

  it('should display error message when API call fails', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve(jsonResponse({}, 500))
    );
    renderMain();
    await waitFor(() => {
      expect(screen.getByText(/Error: 500/)).toBeInTheDocument();
    });
  });

  it('should show appropriate error for 4xx status codes', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve(jsonResponse({}, 404))
    );
    renderMain();
    await waitFor(() => {
      expect(screen.getByText(/Error: 404/)).toBeInTheDocument();
    });
  });

  it('should show appropriate error for 5xx status codes', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve(jsonResponse({}, 502))
    );
    renderMain();
    await waitFor(() => {
      expect(screen.getByText(/Error: 502/)).toBeInTheDocument();
    });
  });

  it('should fetch data when searchTerm prop changes', async () => {
    global.fetch = vi.fn(() => Promise.resolve(jsonResponse({ seasons: mockSeasons })));
    const store = makeStore();

    const { rerender } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<MainLayout searchTerm="" />}>
              <Route path="details/:detailsId" element={<SeasonDetails />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    vi.clearAllMocks();
    global.fetch = vi.fn(() => Promise.resolve(jsonResponse({ seasons: mockSeasons })));

    rerender(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<MainLayout searchTerm="Discovery" />}>
              <Route path="details/:detailsId" element={<SeasonDetails />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('should hide loading state after data is fetched', async () => {
    global.fetch = vi.fn(() => Promise.resolve(jsonResponse({ seasons: mockSeasons })));
    renderMain();
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    expect(screen.getByText('DIS Season 1')).toBeInTheDocument();
  });

  it('should display "no results" when seasons array is empty', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve(jsonResponse({ seasons: [] }))
    );
    renderMain();
    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });

  it('should throw error when error button is clicked', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = vi.fn(() => Promise.resolve(jsonResponse({ seasons: mockSeasons })));

    render(
      <Provider store={makeStore()}>
        <ErrorBoundary>
          <MemoryRouter initialEntries={['/']}>
            <Routes>
              <Route path="/" element={<MainLayout searchTerm="" />}>
                <Route path="details/:detailsId" element={<SeasonDetails />} />
              </Route>
            </Routes>
          </MemoryRouter>
        </ErrorBoundary>
      </Provider>
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
      Promise.resolve(jsonResponse({ seasons: manySeasons }))
    );

    renderMain();

    await waitFor(() => {
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    });
  });

  it('should navigate to details when a card is selected', async () => {
    global.fetch = vi.fn(() => Promise.resolve(jsonResponse({ seasons: mockSeasons })));
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
        return jsonResponse({
          season: {
            uid: '1',
            title: 'DIS Season 1',
            series: { uid: '101', title: 'Star Trek: Discovery' },
            numberOfEpisodes: 15,
          },
        });
      }
      return jsonResponse({ seasons: mockSeasons });
    }) as typeof fetch;

    renderMain('', ['/details/1']);

    await waitFor(() => {
      expect(screen.getByLabelText('Season details')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('Close details panel'));

    await waitFor(() => {
      expect(screen.queryByLabelText('Season details')).not.toBeInTheDocument();
    });
  });

  it('should close details on Enter key in list panel', async () => {
    global.fetch = vi.fn(async () => jsonResponse({ seasons: mockSeasons })) as typeof fetch;

    renderMain('', ['/details/1']);

    await waitFor(() => {
      expect(screen.getByLabelText('Close details panel')).toBeInTheDocument();
    });

    fireEvent.keyDown(screen.getByLabelText('Close details panel'), { key: 'Enter' });

    await waitFor(() => {
      expect(screen.queryByLabelText('Season details')).not.toBeInTheDocument();
    });
  });

  it('should toggle item selection when checkbox is clicked', async () => {
    global.fetch = vi.fn(() => Promise.resolve(jsonResponse({ seasons: mockSeasons })));
    const { store } = renderMain();

    await waitFor(() => {
      expect(screen.getByText('DIS Season 1')).toBeInTheDocument();
    });

    const checkbox = screen.getByRole('checkbox', { name: /select DIS Season 1/i });
    fireEvent.click(checkbox);

    expect(store.getState().selectedItems.items).toHaveLength(1);
    expect(store.getState().selectedItems.items[0].uid).toBe('1');

    fireEvent.click(checkbox);
    expect(store.getState().selectedItems.items).toHaveLength(0);
  });

  it('should invalidate the cache and refetch when refresh is clicked', async () => {
    global.fetch = vi.fn(() => Promise.resolve(jsonResponse({ seasons: mockSeasons })));
    renderMain();

    await waitFor(() => {
      expect(screen.getByText('DIS Season 1')).toBeInTheDocument();
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: /refresh/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  it('should show a refreshing state while refetching, then restore', async () => {
    let resolveRefetch: () => void = () => {};
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ seasons: mockSeasons }))
      .mockImplementationOnce(
        () =>
          new Promise<Response>((resolve) => {
            resolveRefetch = () => resolve(jsonResponse({ seasons: mockSeasons }));
          })
      );

    renderMain();

    await waitFor(() => {
      expect(screen.getByText('DIS Season 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /refresh/i }));

    const refreshingButton = await screen.findByRole('button', { name: /refreshing/i });
    expect(refreshingButton).toBeDisabled();

    resolveRefetch();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^refresh$/i })).toBeEnabled();
    });
  });
});
