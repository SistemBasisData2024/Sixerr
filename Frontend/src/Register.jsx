import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./Register.css";
import { registerAccount } from './actions/Account.actions';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
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
    
    registerAccount(formData)
      .then((response) => {
        if (response.data != null) {
          alert("Successfully registered account");
          navigate("/");
        } else {
          alert("Failed to register account!");
        }
      })
      .catch((error) => {
        console.error(error.message);
      })
  }

  return (
    <>
      <div className="container" style={{maxWidth: '440px'}}>
        <div className="wrapper">
          <div className="title"><span>Login Form</span></div>
          <form onSubmit={submitData}>
          <div className="row">
              <i className="fas fa-user"></i>
              <input name="username" type="text" onChange={change} value={formData.username} placeholder="Username" required />
            </div>
            <div className="row">
              <i className="fas fa-envelope"></i>
              <input name="email" type="text" onChange={change} value={formData.email} placeholder="Email" required />
            </div>
            <div className="row">
              <i className="fas fa-lock"></i>
              <input name="password" type="password" onChange={change} value={formData.password} placeholder="Password" required />
            </div>
            <div className="row button">
              <input type="submit" value="Register" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;