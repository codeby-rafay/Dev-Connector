import { useEffect } from "react";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import { connect } from "react-redux";
import { getProfiles } from "../../actions/profile.action";
import ProfileItem from "./ProfileItem";

const Profiles = ({
  getProfiles,
  profile: { profiles, loading },
  auth: { user },
}) => {
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);

  const orderedProfiles = [...profiles].sort((firstProfile, secondProfile) => {
    const currentUserId = String(user?._id || user?.id || "");
    const firstUserId = String(
      firstProfile.user?._id || firstProfile.user || "",
    );
    const secondUserId = String(
      secondProfile.user?._id || secondProfile.user || "",
    );
    const firstIsCurrentUser = firstUserId === currentUserId;
    const secondIsCurrentUser = secondUserId === currentUserId;

    return Number(secondIsCurrentUser) - Number(firstIsCurrentUser);
  });

  return (
    <>
      {loading ? (
        <div className="spinner-container">
          <Spinner />
        </div>
      ) : (
        <>
          <h1 className="large text-primary">Developers</h1>
          <p className="lead">
            <i className="fab fa-connectdevelop"></i> Browse and connect with
            developers
          </p>
          <div className="profiles">
            {orderedProfiles.length > 0 ? (
              orderedProfiles.map((profile) => (
                <ProfileItem key={profile._id} profile={profile} />
              ))
            ) : (
              <h4>No profiles found...</h4>
            )}
          </div>
        </>
      )}
    </>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
