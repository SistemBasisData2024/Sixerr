import React from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./Login.css";

function Login() {
  return (
    <>
      <div className="container">
        <div className="wrapper">
          <div className="title"><span>Login Form</span></div>
          <form action="#">
            <div className="row">
              <i className="fas fa-user"></i>
              <input type="text" placeholder="Email" required />
            </div>
            <div className="row">
              <i className="fas fa-lock"></i>
              <input type="password" placeholder="Password" required />
            </div>
            <div className="pass"><a href="#">Forgot password?</a></div>
            <div className="row button">
              <input type="submit" value="Login" />
            </div>
            <div className="signup-link">Not a member? <a href="#">Signup now</a></div>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;