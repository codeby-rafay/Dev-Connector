import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";

const Experience = ({ experience }) => {
  return (
    <>
      <h2 className="my-2">Experience Credentials</h2>

      <table className="table">
        <thead>
          <tr>
            <th>Company</th>
            <th className="hide-sm">Title</th>
            <th className="hide-sm">Years</th>
          </tr>
        </thead>

        <tbody>
          {experience.map((exp) => (
            <tr key={exp._id}>
              <td>{exp.company}</td>

              <td className="hide-sm">{exp.title}</td>

              <td>
                <Moment format="YYYY/MM/DD">{exp.from}</Moment> -{" "}
                {exp.to === null ? (
                  "Now"
                ) : (
                  <Moment format="YYYY/MM/DD">{exp.to}</Moment>
                )}
              </td>

              <td>
                <button className="btn btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

Experience.propTypes = {
  experience: PropTypes.array,
};

export default Experience;
