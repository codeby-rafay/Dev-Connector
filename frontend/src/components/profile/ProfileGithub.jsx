import { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getGithubRepos } from "../../actions/profile.action";
import Spinner from "../layout/Spinner";
import { Link } from "react-router-dom";

const ProfileGithub = ({ username, repos, getGithubRepos }) => {
  const hasUsername =
    typeof username === "string" && username.trim().length > 0;

  useEffect(() => {
    if (hasUsername) {
      getGithubRepos(username);
    }
  }, [hasUsername, username, getGithubRepos]);

  if (!hasUsername) {
    return (
      <div className="profile-github">
        <h2 className="text-primary my-1">Github Repos</h2>
        <p>No GitHub repos found.</p>
      </div>
    );
  }

  const isLoading = repos === undefined || repos === null;

  return (
    <div className="profile-github">
      <h2 className="text-primary my-1">Github Repos</h2>
      {isLoading ? (
        <div className="spinner-container">
          <Spinner />
        </div>
      ) : repos.length === 0 ? (
        <p>No GitHub repos found.</p>
      ) : (
        repos.map((repo) => (
          <div key={repo._id || repo.name} className="repo bg-white p-1 my-1">
            <div>
              <h4>
                <Link
                  to={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {repo.name}
                </Link>
              </h4>
              <p>{repo.description}</p>
            </div>
            <div>
              <ul>
                <li className="badge badge-primary">
                  Stars: {repo.stargazers_count}
                </li>
                <li className="badge badge-dark">
                  Watchers: {repo.watchers_count}
                </li>
                <li className="badge badge-light">Forks: {repo.forks_count}</li>
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

ProfileGithub.propTypes = {
  getGithubRepos: PropTypes.func.isRequired,
  repos: PropTypes.array,
  username: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  repos: state.profile.repos,
});

export default connect(mapStateToProps, { getGithubRepos })(ProfileGithub);
