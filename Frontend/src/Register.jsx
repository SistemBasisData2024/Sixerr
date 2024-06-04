import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./Register.css";
import { registerAccount } from './actions/Account.actions';
import { uploadFile } from './actions/Google.actions';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    profile_img: '',
  });
  const [file, setFile] = useState(null);

  const change = e => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value,
    });
  }

  const imageChange = e => {
    setFile(e.target.files[0]);
  }

  const submitData = () => {
    event.preventDefault();
    console.log("formData:");
    console.log(formData);
    console.log(file);
    
    if (file) { /* upload image */
      const fileData = new FormData();
      fileData.append('file', file);
      uploadFile(fileData)
        .then((response) => {
          if (response.data != null) {
            console.log(response.data.id);
            setFormData({
              ...formData,
              profile_img: response.data.id,
            });
          } else {
            alert("Failed to upload file!");
          }
        })
        .catch((error) => {
          console.error(error.message);
        });
    } else { /* register account without image */
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
      });
    }
  }

  useEffect(() => {
    if (formData.profile_img !== '') { /* wait for image to upload and register account with image id */
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
        });
    }
  }, [formData]);

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
            <div className="row">
              <input type="file" onChange={(imageChange)} />
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