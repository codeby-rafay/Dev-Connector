import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth.action";

const Navbar = ({ auth: { isAuthenticated, loading, user }, logout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const firstNameInitial = user?.name?.trim().charAt(0).toUpperCase() || "U";

  useEffect(() => {
    setIsNavigationOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const closeMenu = (event) => {
      if (!userMenuRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    const closeMenuOnEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeMenuOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("keydown", closeMenuOnEscape);
    };
  }, []);

  const authLinks = (
    <ul>
      <li>
        <Link to="/dashboard">
          <i className="fas fa-user" />{" "}
          <span>Dashboard</span>
        </Link>
      </li>
      <li>
        <Link to="/profile">Developers</Link>
      </li>
      <li>
        <Link to="/posts">Posts</Link>
      </li>
      <li className="user-menu" ref={userMenuRef}>
        <button
          type="button"
          className="user-menu-toggle"
          aria-expanded={isMenuOpen}
          aria-label="Open account menu"
          onClick={() => setIsMenuOpen((menuOpen) => !menuOpen)}
        >
          {firstNameInitial}
        </button>
        {isMenuOpen && (
          <div className="user-dropdown">
            <Link
              to={`/profile/${user?._id}`}
              onClick={() => setIsMenuOpen(false)}
            >
              View Profile
            </Link>
            <Link to="/edit-profile" onClick={() => setIsMenuOpen(false)}>
              Edit Profile
            </Link>
            <Link onClick={logout} to="/">
              <i className="fas fa-sign-out-alt" /> Logout
            </Link>
          </div>
        )}
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      {/* <li>
        <Link to="/dashboard">
          <i className="fas fa-user" />{" "}
          <span className="hide-sm">Dashboard</span>
        </Link>
      </li>
      <li>
        <Link to="/profile">Developers</Link>
      </li> */}
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code"></i> DevConnector
        </Link>
      </h1>
      <button
        type="button"
        className="navbar-toggle"
        aria-expanded={isNavigationOpen}
        aria-label="Toggle navigation menu"
        onClick={() => setIsNavigationOpen((navigationOpen) => !navigationOpen)}
      >
        <i className="fas fa-bars"></i>
      </button>
      <div className={`navbar-menu ${isNavigationOpen ? "is-open" : ""}`}>
        {!loading && <>{isAuthenticated ? authLinks : guestLinks}</>}
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
