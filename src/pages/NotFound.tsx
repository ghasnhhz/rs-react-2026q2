import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Page Not Found</p>
      <p>{'Sorry, the page you\'re looking for doesn\'t exist.'}</p>
      <Link to="/" className="home-link">
        Return to Home
      </Link>
    </div>
  );
}

export default NotFound;
