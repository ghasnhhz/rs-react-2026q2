import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../Pagination';
import { describe, it, expect, vi } from 'vitest';

describe('Pagination Component', () => {
  it('should render nothing when totalPages is 1', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render pagination controls when totalPages is greater than 1', () => {
    render(<Pagination currentPage={2} totalPages={3} onPageChange={vi.fn()} />);

    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();
  });

  it('should disable previous button on first page', () => {
    render(<Pagination currentPage={1} totalPages={3} onPageChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: /previous page/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next page/i })).not.toBeDisabled();
  });

  it('should disable next button on last page', () => {
    render(<Pagination currentPage={3} totalPages={3} onPageChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: /next page/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /previous page/i })).not.toBeDisabled();
  });

  it('should call onPageChange when navigation buttons are clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={2} totalPages={3} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
    expect(onPageChange).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('should stop event propagation on nav click', () => {
    const parentClick = vi.fn();
    render(
      <div onClick={parentClick}>
        <Pagination currentPage={2} totalPages={3} onPageChange={vi.fn()} />
      </div>
    );

    fireEvent.click(screen.getByRole('navigation'));
    expect(parentClick).not.toHaveBeenCalled();
  });
});
