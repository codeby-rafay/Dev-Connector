import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addEducation } from "../../actions/profile.action";
import { Link, withRouter } from "react-router-dom";

const AddEducation = (props) => {
  return <div></div>;
};

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired,
};

export default connect(null, { addEducation })(AddEducation);
