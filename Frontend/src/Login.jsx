import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie'
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./Login.css";
import { loginAccount } from './actions/Account.actions';

function Login() {
  const navigate = useNavigate();

  const [cookies, setCookies] = useCookies(["email", "logged"]);
  const [formData, setFormData] = useState({
    email: cookies.email,
    password: '',
  });

  const change = e => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value,
    });
  }

  const submitData = () => {
    event.preventDefault();
    console.log("formData:");
    console.log(formData);
    
    loginAccount(formData)
      .then((response) => {
        if (response.data != null) {
          setCookies("email", formData.email, { path: '/' });
          setCookies("logged", true, { path: '/' });
          navigate("/test");
        } else {
          alert("Account not found!");
        }
      })
      .catch((error) => {
        console.error(error.message);
      })
  }

  useEffect(() => {
    if (cookies.logged) {
      navigate("/test");
      window.location.reload();
    }
  }, [cookies.logged]);

  
  return (
    <>
      <div className="container" style={{maxWidth: '440px'}}>
        <div className="wrapper">
          <div className="title"><span>Login Form</span></div>
          <form onSubmit={submitData}>
            <div className="row">
              <i className="fas fa-user"></i>
              <input name="email" type="text" onChange={change} value={formData.email} placeholder="Email" required />
            </div>
            <div className="row">
              <i className="fas fa-lock"></i>
              <input name="password" type="password" onChange={change} value={formData.password} placeholder="Password" required />
            </div>
            <div className="pass"><a href="#">Forgot password?</a></div>
            <div className="row button">
              <input type="submit" value="Login" />
            </div>
            <div className="signup-link">Not a member? <a href="Register">Signup now</a></div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;