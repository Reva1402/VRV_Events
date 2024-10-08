import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, database } from './firebaseConfig.js';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import './Styling.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Model from './Model.js';
import { ref, get } from 'firebase/database';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

       
        const roleRef = ref(database, 'users/' + user.uid + '/role');
        const snapshot = await get(roleRef);
        const userRole = snapshot.val();

       
        if (userRole === 'admin') {
            navigate('/adminhomepage');
        } else if (userRole === 'eventorganizer') {
            navigate('/eventoragniserhomepage');
        } else if (userRole === 'attendee') {
            navigate('/attendeehomepage');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('Login failed. Please try again.');
    }
};
  

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      alert('Password reset email sent. Please check your inbox.');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      alert('Failed to send password reset email. Please try again.');
    }
  };

  const openModel = () => setIsModelOpen(true);
  const closeModel = () => setIsModelOpen(false);
  const [isModelOpen, setIsModelOpen] = useState(false);

  return (
    <div >
      <div >
        <h1 className="text-center">Login</h1>
        <div class="container">
          <div class="row ">
            <div className='col-lg-2'></div>
            <div className='col-lg-8'>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label >Email:</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button className="btn btn-primary" type="submit" >Login</button>
              </form>
              <button className="text-center" onClick={openModel} >Forgot Password?</button>



              <Model isOpen={isModelOpen} onClose={closeModel}>
                <h2>Reset Password</h2>
                <form onSubmit={handlePasswordReset}>
                  <div className="input-group">
                    <label htmlFor="resetEmail">Email</label>
                    <input
                      type="email"
                      id="resetEmail"
                      name="resetEmail"
                      placeholder="Enter your email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button className="resetbtn" type="submit">Send Reset Email</button>
                </form>
              </Model>
            </div>

            <div className='col-lg-2'></div>

          </div>
        </div>

      </div>

    </div>






  );
};

export default LoginPage;
