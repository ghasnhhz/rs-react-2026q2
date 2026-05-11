import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe("Header Component", () => {
    const mockOnSubmitted = vi.fn();

    beforeEach(() => {
        localStorage.clear();
        mockOnSubmitted.mockClear();
    });

    it("should render search input and button", () => {
        render(<Header onSubmitted={mockOnSubmitted} />);

        expect(screen.getByRole('textbox')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    });

    it("should load saved search term from localStorage on mount", () => {
        localStorage.setItem("searchTerm", "Discovery");

        render(<Header onSubmitted={mockOnSubmitted} />);

        const input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input.value).toBe('Discovery');
    });

    it("should load null from localStorage when no saved term exists", () => { 
        render(<Header onSubmitted={mockOnSubmitted} />);
        
        const input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input.value).toBe('');
    });

    it("should update input value when user types", () => {
        render(<Header onSubmitted={mockOnSubmitted} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Voyager' } });
        expect((input as HTMLInputElement).value).toBe('Voyager');
    });

    it('should call onSubmitted callback when button is clicked', () => {
        render(<Header onSubmitted={mockOnSubmitted} />);

        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button', { name: /search/i });

        fireEvent.change(input, { target: { value: "Discovery" } });
        fireEvent.click(button);

        expect(mockOnSubmitted).toHaveBeenCalledWith("Discovery");
    });

    it('should save search term to localStorage when button is clicked', () => {
        render(<Header onSubmitted={mockOnSubmitted} />);

        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button', { name: /search/i });

        fireEvent.change(input, { target: { value: "Picard" } });
        fireEvent.click(button);

        expect(localStorage.getItem("searchTerm")).toBe("Picard");
    });

    it('should trim whitespace before saving', () => {
        render(<Header onSubmitted={mockOnSubmitted} />);

        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button', { name: /search/i });

        fireEvent.change(input, { target: { value: " Discovery " } });
        fireEvent.click(button);

        expect(mockOnSubmitted).toHaveBeenCalledWith("Discovery");
    });
});