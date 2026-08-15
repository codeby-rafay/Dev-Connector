import axios from "axios";
import { setAlert } from "./alert.action";
import { GET_POSTS, POST_ERROR } from "./types";

// Get posts
export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get("http://localhost:3000/api/posts");

    dispatch({
      type: GET_POSTS,
      payload: Array.isArray(res.data?.posts) ? res.data.posts : [],
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response?.statusText || err.message,
        status: err.response?.status || 500,
      },
    });
  }
};
