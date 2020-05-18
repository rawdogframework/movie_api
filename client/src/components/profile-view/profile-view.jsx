import React from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export class ProfileView extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  unregisterAccount() {
    const url = 'https://vfa.herokuapp.com/users/' + localStorage.getItem('id');
    console.log(url);
    axios
      .delete(url, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      })
      .then((response) => {
        console.log(response.data);
        // Set profile info to null
        this.setState({
          profileInfo: null,
          user: null,
        });
        alert('Your account was successfully deleted');
        this.props.logOutFunc();
        window.open('/', '_self');
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  updateAccount() {}

  render() {
    const { user, profileInfo } = this.props;
    if (!profileInfo || !user) return <div>Loading</div>;
    return (
      <div className="wrapper container-fluid">
        <div className="col-3" />
        <div className="profile-view container-fluid align-items-center col-6">
          <img
            className="profile-avatar "
            src="https://via.placeholder.com/150"
          />
          <div className="account-username ">
            <span className="label">Username: </span>
            <span className="value">{profileInfo.Username}</span>
          </div>
          <div className="account-email ">
            <span className="label">Email: </span>
            <span className="value">{profileInfo.Email}</span>
          </div>
          <div className="account-birthday ">
            <span className="label">Birthday: </span>
            <span className="value">{profileInfo.Birthday}</span>
          </div>
          <div className="account-password ">
            <span className="label">Password: </span>
            <span className="value">***********</span>
          </div>
          <div className="">
            <Button onClick={() => this.unregisterAccount()} variant="link">
              Delete Account
            </Button>
          </div>
          <Link to={`/`}>
            <Button variant="link">Home</Button>
          </Link>
        </div>
        <div className="col-3" />
      </div>
    );
  }
}

ProfileView.propTypes = {
  profileInfo: PropTypes.shape({
    Username: PropTypes.string.isRequired,
    Email: PropTypes.string.isRequired,
    // ImagePath: PropTypes.string.isRequired,
    Birthday: PropTypes.string.isRequired,
  }).isRequired,
};
