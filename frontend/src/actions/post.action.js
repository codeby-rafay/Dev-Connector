import axios from "axios";
import { GET_POSTS, POST_ERROR, UPDATE_LIKES, DELETE_POST } from "./types";
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

// Add like
export const addLike = (id) => async (dispatch, getState) => {
  const state = getState();
  const post = state.post.posts.find((item) => item._id === id);
  const currentLikes = Array.isArray(post?.likes) ? [...post.likes] : [];
  const userId = state.auth.user?._id;

  const hasLiked = currentLikes.some(
    (like) => like.user === userId || like.user?._id === userId,
  );

  if (userId && !hasLiked) {
    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: [{ user: userId }, ...currentLikes] },
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

// Remove like
export const removeLike = (id) => async (dispatch, getState) => {
  const state = getState();
  const post = state.post.posts.find((item) => item._id === id);
  const currentLikes = Array.isArray(post?.likes) ? [...post.likes] : [];
  const userId = state.auth.user?._id;

  const optimisticLikes = userId
    ? currentLikes.filter(
        (like) => like.user !== userId && like.user?._id !== userId,
      )
    : currentLikes;

  if (userId) {
    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: optimisticLikes },
    });
  }

  try {
    const res = await axios.put(`/api/posts/unlike/${id}`);

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
