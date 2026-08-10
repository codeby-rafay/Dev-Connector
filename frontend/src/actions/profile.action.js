import axios from "axios";
import { setAlert } from "./alert.action";
import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE } from "./types";

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
