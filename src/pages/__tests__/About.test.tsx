import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import About from '../About';
import { describe, it, expect } from 'vitest';

describe('About Page', () => {
  it('should display author information', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /author/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ghasnhhz/i })).toHaveAttribute(
      'href',
      'https://github.com/ghasnhhz'
    );
  });

  it('should display a link to the RS School React course', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    const courseLink = screen.getByRole('link', { name: /RS School React Course/i });
    expect(courseLink).toHaveAttribute('href', 'https://rs.school/react');
  });

  it('should provide a link back to home', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/');
  });
});
