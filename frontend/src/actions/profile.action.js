import axios from "axios";
import { setAlert } from "./alert.action";
import {
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  GET_PROFILES,
  CLEAR_PROFILE,
  GET_REPOS,
} from "./types";

// Get current users profile
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get("http://localhost:5000/api/profile/me");

    dispatch({
      type: GET_PROFILE,
      payload: res.data.profile,
    });
  } catch (err) {
    const response = err.response;

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: response?.statusText || err.message,
        status: response?.status || 500,
      },
    });
  }
};

// Get all profiles
export const getProfiles = () => async (dispatch) => {
  try {
    const res = await axios.get("http://localhost:5000/api/profile");

    dispatch({
      type: GET_PROFILES,
      payload: res.data.profiles,
    });
  } catch (err) {
    const response = err.response;

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: response?.statusText || err.message,
        status: response?.status || 500,
      },
    });
  }
};

// Get profile by ID
export const getProfileById = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/profile/user/${userId}`,
    );

    dispatch({
      type: GET_PROFILE,
      payload: res.data.profile,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText || err.message,
        status: err.response.status || 500,
      },
    });
  }
};

// Get GitHub repos
export const getGithubRepos = (username) => async (dispatch) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/profile/github/${username}`,
    );

    dispatch({
      type: GET_REPOS,
      payload: res.data.repos,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText || err.message,
        status: err.response.status || 500,
      },
    });
  }
};

// Create or update profile
export const createProfile =
  (formData, navigate, edit = false) =>
  async (dispatch) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.post(
        "http://localhost:5000/api/profile",
        formData,
        config,
      );

      dispatch({
        type: GET_PROFILE,
        payload: res.data.profile,
      });

      dispatch(
        setAlert(edit ? "Profile Updated" : "Profile Created", "success"),
      );

      if (!edit) {
        navigate("/dashboard");
      }
    } catch (err) {
      const response = err.response;
      const errors = response?.data?.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: response?.statusText || err.message,
          status: response?.status || 500,
        },
      });
    }
  };

// Add Experience
export const addExperience = (formData, navigate) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.put(
      "http://localhost:5000/api/profile/experience",
      formData,
      config,
    );

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data.profile,
    });

    dispatch(setAlert("Experience Added", "success"));

    navigate("/dashboard");
  } catch (err) {
    const response = err.response;
    const errors = response?.data?.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: response?.statusText || err.message,
        status: response?.status || 500,
      },
    });
  }
};

// Add Education
export const addEducation = (formData, navigate) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.put(
      "http://localhost:5000/api/profile/education",
      formData,
      config,
    );

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data.profile,
    });

    dispatch(setAlert("Education Added", "success"));

    navigate("/dashboard");
  } catch (err) {
    const response = err.response;
    const errors = response?.data?.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: response?.statusText || err.message,
        status: response?.status || 500,
      },
    });
  }
};

// Delete Experience
export const deleteExperience = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(
      `http://localhost:5000/api/profile/experience/${id}`,
    );
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data.profile,
    });
    dispatch(setAlert("Experience Removed", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response?.statusText || err.message,
        status: err.response?.status || 500,
      },
    });
  }
};

// Delete Education
export const deleteEducation = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(
      `http://localhost:5000/api/profile/education/${id}`,
    );
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data.profile,
    });
    dispatch(setAlert("Education Removed", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response?.statusText || err.message,
        status: err.response?.status || 500,
      },
    });
  }
};

// Delete account
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm("Are you sure? This can NOT be undone!")) {
    try {
      await axios.delete("http://localhost:5000/api/profile");
      dispatch({ type: CLEAR_PROFILE });
      dispatch({ type: ACCOUNT_DELETED });

      dispatch(setAlert("Your account has been permanently deleted"));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: err.response?.statusText || err.message,
          status: err.response?.status || 500,
        },
      });
    }
  }
};
