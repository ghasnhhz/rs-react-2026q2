import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import ThemeSwitcher from '../ThemeSwitcher';
import { ThemeProvider } from '../../context/ThemeProvider';

function renderThemeSwitcher() {
  return render(
    <ThemeProvider>
      <ThemeSwitcher />
    </ThemeProvider>
  );
}

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('renders the theme toggle button', () => {
    renderThemeSwitcher();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows moon icon in light mode', () => {
    renderThemeSwitcher();
    expect(screen.getByRole('button')).toHaveTextContent('🌙');
  });

  it('switches to dark mode on first click', () => {
    renderThemeSwitcher();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveTextContent('☀️');
  });

  it('toggles back to light mode on second click', () => {
    renderThemeSwitcher();
    const button = screen.getByRole('button');
    fireEvent.click(button);
    fireEvent.click(button);
    expect(button).toHaveTextContent('🌙');
  });

  it('sets data-theme attribute on documentElement when toggled', () => {
    renderThemeSwitcher();
    fireEvent.click(screen.getByRole('button'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('has correct aria-label for accessibility', () => {
    renderThemeSwitcher();
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to dark theme');
  });
});
