import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner.jsx";

const PrivateRoute = ({ isAuthenticated, loading, children }) => {
  if (loading) {
    return (
      <div className="spinner-container">
        <Spinner />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
});

export default connect(mapStateToProps)(PrivateRoute);
