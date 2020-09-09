import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import axios from 'axios';

export function UpdateView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');

  /**
   * Function stores new user credentials in DB
   * @function handleUpdate
   * @param {e} onClick event
   * @returns {Promise<object>} response payload from PUT request
   */

  const handleUpdate = (e) => {
    // prevent the default browser refresh
    e.preventDefault();
    // if (!localStorage.getItem('token') {
    //   // if token is not present, user is not logged in, go home
    //   console.log('user is not logged in');
    //   window.open('/', '_self'); // the second argument '_self' is necessary so that the page will open in the current tab
    //   return;
    // }
    // console.log(username, password, birthday, email);
    /* Send a request to the server for authentication */
    const url =
      'https://vfa.herokuapp.com/users/update/' + localStorage.getItem('id');
    axios
      .put(
        url,
        {
          Username: username,
          Password: password,
          Email: email,
          Birthday: birthday,
        },
        {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
        }
      )
      .then((response) => {
        const data = response.data;
        // console.log(data);
        // update local storage
        localStorage.setItem('user', data.Username);
        // Opens page in same tab i.e 'self'
        window.open(`/`, '_self');
        alert('Your profile data was updated successfully');
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Container>
      <h1>Update your account</h1>
      <Form className="registration-form">
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
        <Form.Group>
          <Form.Label>Birth Date:</Form.Label>
          <Form.Control
            type="string"
            value={birthday}
            placeholder="01/01/2001"
            onChange={(e) => setBirthday(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Link to={`/users/`}>
          <Button
            variant="btn-lg btn-dark btn-block"
            type="submit"
            onClick={handleUpdate}
          >
            Update
          </Button>
        </Link>
      </Form>
    </Container>
  );
}
