import React, { Component } from 'react';
import auth0 from 'auth0-js';
import queryString from 'query-string';
import Cookies from 'js-cookie';

const { hash, host, search } = window.location;
const IS_DEV = host.includes('localhost');

const webAuth = new auth0.WebAuth({
  domain: 'arjan.auth0.com',
  clientID: 'ehZzZv53ikxMJTneNFYQQ3elLW3bprEQ',
  redirectUri: IS_DEV ? 'http://localhost:3000' : 'https://accounts.jassal.io',
  responseType: 'token id_token',
});

webAuth.parseHash({ hash }, (err, authResult) => {
  if (err) {
    return console.log(err);
  }

  if (authResult) {
    Cookies.set('accessToken', authResult.accessToken, {
      domain: IS_DEV ? 'localhost' : '.jassal.io',
    });
    Cookies.set('idToken', authResult.idToken, {
      domain: IS_DEV ? 'localhost' : '.jassal.io',
    });

    if (sessionStorage.getItem('continue')) {
      window.location.replace(sessionStorage.getItem('continue'));
    }

    console.log(authResult);

    webAuth.client.userInfo(authResult.accessToken, (err, user) => {
      // Now you have the user's information
      console.log({ user });
    });
  }

  window.location.hash = '';
});

class App extends Component {
  state = {
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
        connection: 'Username-Password-Authentication',
        email: signUpEmail,
        password: signUpPassword,
        app_metadata: {
          permissions: {
            [signUpCompanyName]: 'admin',
          },
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
    };

    fetch('/v1/auth/users', options)
      .then(r => r.json())
      .then(r => console.log(r));
    // webAuth.signup(
    //   {
    //     connection: 'Username-Password-Authentication',
    //     email: signUpEmail,
    //     password: signUpPassword,
    //     user_metadata: {
    //       companyName: signUpCompanyName,
    //     },
    //     app_metadata: {
    //       permissions: {
    //         [signUpCompanyName]: 'admin',
    //       },
    //     },
    //   },
    //   (error, signupResult) => {
    //     if (signupResult) {
    //       this.handleLogin(event, {
    //         loginEmail: signupResult.email,
    //         loginPassword: signUpPassword,
    //       });
    //     }
    //   },
    // );
  };

  handleLogin = (event, data) => {
    event.preventDefault();
    const { loginEmail, loginPassword } = data || this.state;
    // webAuth.authorize();
    webAuth.login(
      {
        realm: 'Username-Password-Authentication',
        email: loginEmail,
        password: loginPassword,
      },
      error => {
        console.log(error);
      },
    );
  };

  handleLogout = event => {
    event.preventDefault();
    webAuth.logout({
      returnTo: IS_DEV ? 'http://localhost:3000' : 'https://accounts.jassal.io',
    });
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
        <h1>Log out</h1>
        <button onClick={this.handleLogout}>Log out</button>

        <button onClick={this.createConnection}>Create connection</button>
      </div>
    );
  }
}

export default App;
