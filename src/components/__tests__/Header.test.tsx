import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../Header';
import { ThemeProvider } from '../../context/ThemeProvider';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe("Header Component", () => {
    const mockOnSubmitted = vi.fn();

    const renderHeader = () =>
        render(
            <ThemeProvider>
                <MemoryRouter>
                    <Header onSubmitted={mockOnSubmitted} />
                </MemoryRouter>
            </ThemeProvider>
        );

    beforeEach(() => {
        localStorage.clear();
        mockOnSubmitted.mockClear();
    });

    it("should render search input and button", () => {
        renderHeader();

        expect(screen.getByRole('textbox')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    });

    it("should load saved search term from localStorage on mount", () => {
        localStorage.setItem("searchTerm", "Discovery");

        renderHeader();

        const input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input.value).toBe('Discovery');
    });

    it("should load null from localStorage when no saved term exists", () => {
        renderHeader();

        const input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input.value).toBe('');
    });

    it("should update input value when user types", () => {
        renderHeader();

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Voyager' } });
        expect((input as HTMLInputElement).value).toBe('Voyager');
    });

    it('should call onSubmitted callback when button is clicked', () => {
        renderHeader();

        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button', { name: /search/i });

        fireEvent.change(input, { target: { value: "Discovery" } });
        fireEvent.click(button);

        expect(mockOnSubmitted).toHaveBeenCalledWith("Discovery");
    });

    it('should save search term to localStorage when button is clicked', () => {
        renderHeader();

        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button', { name: /search/i });

        fireEvent.change(input, { target: { value: "Picard" } });
        fireEvent.click(button);

        expect(localStorage.getItem("searchTerm")).toBe("Picard");
    });

    it('should trim whitespace before saving', () => {
        renderHeader();

        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button', { name: /search/i });

        fireEvent.change(input, { target: { value: " Discovery " } });
        fireEvent.click(button);

        expect(mockOnSubmitted).toHaveBeenCalledWith("Discovery");
        expect(localStorage.getItem("searchTerm")).toBe("Discovery");
        expect((input as HTMLInputElement).value).toBe("Discovery");
    });

    it('should not save to localStorage while typing', () => {
        renderHeader();

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Picard' } });

        expect(localStorage.getItem('searchTerm')).toBeNull();
    });

    it('should render navigation link to About page', () => {
        renderHeader();

        expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '/about');
    });

    it('should render the theme toggle button', () => {
        renderHeader();
        expect(screen.getByRole('button', { name: /switch to/i })).toBeInTheDocument();
    });
});
