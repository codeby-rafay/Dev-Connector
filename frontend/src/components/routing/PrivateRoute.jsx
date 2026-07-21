import { Navigate } from "react-router-dom";
import { connect } from "react-redux";

const PrivateRoute = ({ isAuthenticated, loading, children }) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
});

export default connect(mapStateToProps)(PrivateRoute);
