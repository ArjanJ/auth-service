import React, { Component } from 'react';
import auth0 from 'auth0-js';
import queryString from 'query-string';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

const { hash, host, search } = window.location;
const IS_DEV = host.includes('localhost');

class App extends Component {
  state = {
    newPassword: '',
    inviteEmail: '',
    loginEmail: '',
    loginPassword: '',
    signUpCompanyName: '',
    signUpEmail: '',
    signUpPassword: '',
  };

  componentDidMount() {
    const parsedSearch = queryString.parse(search);
    if (parsedSearch.continue) {
      sessionStorage.setItem('continue', parsedSearch.continue);
    }
  }

  createConnection = () => {
    const options = {
      body: JSON.stringify({
        name: 'test-connection-lmao',
        strategy: 'auth0',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };

    fetch('/v1/auth/connections', options)
      .then(r => r.json())
      .then(r => console.log(r));
  };

  handleChange = event => {
    event.preventDefault();
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleSignup = event => {
    event.preventDefault();
    const { signUpCompanyName, signUpEmail, signUpPassword } = this.state;
    const options = {
      body: JSON.stringify({
        email: signUpEmail,
        organization: signUpCompanyName,
        password: signUpPassword,
      }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
    };

    fetch('/v1/auth/signup', options)
      .then(r => r.json())
      .then(r => console.log(r));
  };

  handleLogin = (event, data) => {
    event.preventDefault();
    const { loginEmail, loginPassword } = data || this.state;
    const options = {
      body: JSON.stringify({
        username: loginEmail,
        password: loginPassword,
      }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
    };

    fetch('/v1/auth/login', options);
  };

  handleLogout = event => {
    event.preventDefault();
    const jwt = Cookies.get('idToken');
    const options = {
      body: JSON.stringify({
        token: jwt,
      }),
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      method: 'post',
    };

    fetch('/v1/auth/logout', options);
  };

  getUser() {
    const jwt = Cookies.get('idToken');
    const options = {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      method: 'get',
    };

    fetch('/v1/user', options);
  }

  handleInvite = event => {
    event.preventDefault();
    const jwt = Cookies.get('idToken');
    const options = {
      body: JSON.stringify({
        email: this.state.inviteEmail,
      }),
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      method: 'post',
    };

    fetch('/v1/user/invite', options);
  };

  render() {
    return (
      <div className="App">
        <h1>Sign up</h1>
        <form onSubmit={this.handleSignup}>
          <label htmlFor="signUpCompanyName">Company name</label>
          <input
            id="signUpCompanyName"
            name="signUpCompanyName"
            onChange={this.handleChange}
            type="text"
            value={this.state.signUpCompanyName}
          />
          <label htmlFor="signUpEmail">Email</label>
          <input
            id="signUpEmail"
            name="signUpEmail"
            onChange={this.handleChange}
            type="email"
            value={this.state.signUpEmail}
          />
          <label htmlFor="signUpPassword">Password</label>
          <input
            id="signUpPassword"
            name="signUpPassword"
            onChange={this.handleChange}
            type="password"
            value={this.state.signUpPassword}
          />
          <button type="submit">Sign up</button>
        </form>
        <h1>Log in</h1>
        <form onSubmit={this.handleLogin}>
          <label htmlFor="loginEmail">Email</label>
          <input
            id="loginEmail"
            name="loginEmail"
            onChange={this.handleChange}
            type="email"
            value={this.state.loginEmail}
          />
          <label htmlFor="loginPassword">Password</label>
          <input
            id="loginPassword"
            name="loginPassword"
            onChange={this.handleChange}
            type="password"
            value={this.state.loginPassword}
          />
          <button type="submit">Login</button>
        </form>
        <h1>Invite User</h1>
        <form onSubmit={this.handleInvite}>
          <label htmlFor="inviteEmail">Email</label>
          <input
            id="inviteEmail"
            name="inviteEmail"
            onChange={this.handleChange}
            type="email"
            value={this.state.inviteEmail}
          />
          <button type="submit">Invite</button>
        </form>
        <h1>Create password</h1>
        <form onSubmit={this.createPassword}>
          <label htmlFor="newPassword">New password</label>
          <input
            id="newPassword"
            name="newPassword"
            onChange={this.handleChange}
            type="password"
            value={this.state.newPassword}
          />
          <button type="submit">Create password</button>
        </form>
        <h1>Log out</h1>
        <button onClick={this.handleLogout}>Log out</button>

        <button onClick={this.getUser}>Get User</button>
        <button onClick={this.testDatastore}>Test datastore</button>
        <button onClick={this.changePassword}>Change password</button>
      </div>
    );
  }
}

export default App;
