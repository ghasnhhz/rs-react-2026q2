import { type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { SEARCH_TERM_KEY, useLocalStorage } from '../hooks/useLocalStorage';
import './Header.css';

interface HeaderProps {
  onSubmitted: (text: string) => void;
}

function Header({ onSubmitted }: HeaderProps) {
  const { value: input, setValue: setInput, saveValue } = useLocalStorage(
    SEARCH_TERM_KEY,
    ''
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleButtonClick = () => {
    const cleanTerm = input.trim();
    saveValue(cleanTerm);
    onSubmitted(cleanTerm);
  };

  return (
    <header className="header">
      <nav className="header-nav" aria-label="Main navigation">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/about" className="nav-link">
          About
        </Link>
      </nav>
      <div className="header-search">
        <input
          type="text"
          className="search-input"
          onChange={handleInputChange}
          value={input}
          aria-label="Search seasons"
        />
        <button className="search-button" onClick={handleButtonClick}>
          Search
        </button>
      </div>
    </header>
  );
}

export default Header;
