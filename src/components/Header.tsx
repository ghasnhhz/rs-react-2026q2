import { type ChangeEvent } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './Header.css';

interface HeaderProps {
  onSubmitted: (text: string) => void;
}

function Header({ onSubmitted }: HeaderProps) {
  const [input, setInput] = useLocalStorage('searchTerm', '');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleButtonClick = () => {
    const cleanTerm = input.trim();
    onSubmitted(cleanTerm);
  };

  return (
    <div className="header">
      <input
        type="text"
        className="search-input"
        onChange={handleInputChange}
        value={input}
      />
      <button className="search-button" onClick={handleButtonClick}>
        Search
      </button>
    </div>
  );
}

export default Header;