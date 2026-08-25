import axios from "axios";
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
} from "./types";
import { setAlert } from "./alert.action";

// Get posts
export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/posts");

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

// Toggle like
export const toggleLike = (id) => async (dispatch, getState) => {
  const state = getState();
  const post = state.post.posts.find((item) => item._id === id);
  const currentLikes = Array.isArray(post?.likes) ? [...post.likes] : [];
  const userId = state.auth.user?._id;

  const hasLiked = currentLikes.some(
    (like) => like.user === userId || like.user?._id === userId,
  );

  const optimisticLikes = hasLiked
    ? currentLikes.filter(
        (like) => like.user !== userId && like.user?._id !== userId,
      )
    : [{ user: userId }, ...currentLikes];

  if (userId) {
    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: optimisticLikes },
    });
  }

  try {
    const res = await axios.put(`/api/posts/like/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: {
        id,
        likes: Array.isArray(res.data?.post) ? res.data.post : [],
      },
    });
  } catch (err) {
    // Roll back optimistic update if request fails.
    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: currentLikes },
    });

    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response?.statusText || err.message,
        status: err.response?.status || 500,
      },
    });
  }
};

// Delete post
export const deletePost = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/posts/${id}`);

    dispatch({
      type: DELETE_POST,
      payload: id,
    });

    dispatch(setAlert("Post Removed", "success"));
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

// Add post
export const addPost = (formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.post("/api/posts", formData, config);

    dispatch({
      type: ADD_POST,
      payload: res.data?.post,
    });
    dispatch(setAlert("Post Created", "success"));
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

// Get post
export const getPost = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/posts/${id}`);

    dispatch({
      type: GET_POST,
      payload: res.data?.post,
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

// Add comment
export const addComment = (postId, formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.post(
      `/api/posts/comment/${postId}`,
      formData,
      config,
    );

    dispatch({
      type: ADD_COMMENT,
      payload: Array.isArray(res.data?.post) ? res.data.post : [],
    });
    dispatch(setAlert("Comment Added", "success"));
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

// Delete comment
export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
    await axios.delete(`/api/posts/comment/${postId}/${commentId}`);

    dispatch({
      type: REMOVE_COMMENT,
      payload: commentId,
    });
    dispatch(setAlert("Comment Removed", "success"));
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
