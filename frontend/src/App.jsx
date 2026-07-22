import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import CreateProfile from "./components/profile-forms/CreateProfile";
import Alert from "./components/layout/Alert";
import setAuthToken from "./utils/setAuthtoken";
import PrivateRoute from "./components/routing/PrivateRoute";

import store from "./store";
import { Provider } from "react-redux";
import { loadUser } from "./actions/auth.action";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Navbar />

        <section className="container">
          <Alert />

          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-profile"
              element={
                <PrivateRoute>
                  <CreateProfile />
                </PrivateRoute>
              }
            />
          </Routes>
        </section>
      </Router>
    </Provider>
  );
};

export default App;
