import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Alert from "./components/layout/Alert";
import setAuthToken from "./utils/setAuthtoken";

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

        {/* Landing page - full width */}
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>

        {/* Other pages - inside container */}
        <section className="container">
          <Alert />
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </section>
      </Router>
    </Provider>
  );
};

export default App;
