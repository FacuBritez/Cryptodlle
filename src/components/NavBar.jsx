import { Link } from 'react-router-dom';
import "./NavBar.css";

function NavBar() {
  return (
    <nav>
      <Link to="/Logo">Logo</Link>
      <Link to="/Chart">Chart</Link>
      <Link to="/Classic">Classic</Link>
      <Link to="/HigherLower">HigherLower</Link>
    </nav>
  );
}

export default NavBar;
