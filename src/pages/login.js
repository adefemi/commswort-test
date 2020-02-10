import React, { useEffect, useState } from "react";
import "../styles.css";
import { withApollo } from "react-apollo";
import gql from "graphql-tag";
import { errorHandler } from "../utils";
import { Notification } from "../components/notification";
import Loader from "react-loader-spinner";

const LoginUser = gql`
  mutation LoginUser($user: LoginType!) {
    loginUser(user: $user) {
      accessToken
      status
      message
    }
  }
`;

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("ctoken");
    if (token) {
      props.history.push("/");
    }
  }, []);

  const onSubmit = e => {
    e.preventDefault();
    setSubmit(true);
    props.client
      .mutate({
        mutation: LoginUser,
        variables: {
          user: {
            email,
            password
          }
        }
      })
      .then(
        res => {
          try {
            localStorage.setItem("ctoken", res.data.loginUser.accessToken);
            props.history.push("/");
          } catch (e) {
            setSubmit(false);
          }
        },
        err => {
          setSubmit(false);
          const checkError = errorHandler(err);
          Notification.bubble({
            content: checkError.netError
              ? checkError.message
              : "Invalid email or password",
            type: "error"
          });
        }
      );
  };

  return (
    <div className="login-container">
      <div className="inner">
        <div className="page-brand">TEST-APP</div>
        <h3>Welcome back</h3>
        <small>Login to continue from where you logged off...</small>
        <form onSubmit={onSubmit}>
          <label>
            <span>Email</span>
            <input
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </label>
          <button type="submit" className="submit-button" disabled={submit}>
            {!submit ? (
              "Login"
            ) : (
              <Loader
                type="ThreeDots"
                color="#ffffff"
                height={30}
                width={30}
                // timeout={3000}
              />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default withApollo(Login);
