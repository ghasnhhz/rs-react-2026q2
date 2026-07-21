import { Link } from 'react-router-dom';
import './About.css';

function About() {
  return (
    <div className="about">
      <h1>About This Application</h1>
      <p>
        This Star Trek Seasons Explorer is built as part of the{' '}
        <a href="https://rs.school/react" target="_blank" rel="noopener noreferrer">
          RS School React Course
        </a>
        .
      </p>
      <p>
        The application allows you to search and explore Star Trek seasons using the{' '}
        <strong>Star Trek API (STAPI)</strong>.
      </p>

      <h2>Author</h2>
      <p>
        Developed by{' '}
        <a
          href="https://github.com/ghasnhhz"
          target="_blank"
          rel="noopener noreferrer"
        >
          ghasnhhz
        </a>
        {' '}
        (
        <a
          href="https://github.com/ghasnhhz/rs-react-2026q2"
          target="_blank"
          rel="noopener noreferrer"
        >
          project repository
        </a>
        ).
      </p>

      <h2>Features</h2>
      <ul>
        <li>Search for Star Trek seasons by title</li>
        <li>Browse through paginated results</li>
        <li>View detailed information about each season</li>
        <li>Responsive design for all devices</li>
      </ul>
      <Link to="/" className="back-link">
        ← Back to Home
      </Link>
    </div>
  );
}

export default About;
