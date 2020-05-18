import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import './login-view.scss';

export function LoginView(props) {
  // Calling useState() method with empty string (= initial value of login variable)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    // prevents the default refresh after submit button has been clicked
    e.preventDefault();
    // console.log(username, password);
    /* Send a request to the server for authentication */
    axios
      .post('https://vfa.herokuapp.com/login', {
        Username: username,
        Password: password,
      })
      .then((response) => {
        const data = response.data;
        // console.log(data);
        // Send data to prop
        props.logInFunc(data);
      })
      .catch((e) => {
        console.log('no such user');
      });
  };

  return (
    <Container>
      <h1>Log in</h1>
      <Form className="login-form">
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            value={username}
            placeholder="Enter username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button
          variant="btn-lg btn-dark btn-block"
          type="submit"
          onClick={handleSubmit}
        >
          Log in
        </Button>
      </Form>
    </Container>
  );
}

LoginView.propTypes = {
  logOut: PropTypes.func.isRequired,
};
