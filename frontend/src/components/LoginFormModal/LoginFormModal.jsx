import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const demoUserLogIn = async () => {
    const response = await dispatch(sessionActions.login({"credential": 'Demo-lition', "password": 'password'}))
    if(response.ok){
      closeModal();
    }
  }
 

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <div className='login-box'>
      <h1 className='h1-con'>Log In</h1>
      <form onSubmit={handleSubmit}>
        <div className='login-inputs'>

        
        <label>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            placeholder='Username or Email'
            className='input'
          />
        </label>
        <label>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='Password'
            className='input'
          />
        </label>

        {errors.credential && <p className='errors-mess'>{'The provided credentials were invalid'}</p>}
        </div>
        <div className='btn-con'>
        <button className='submit-btn' type="submit" 
        disabled={credential.length < 4 || password.length < 6}
        >Log In</button>

        <button type='demoUser' className='demo-btn' onClick={demoUserLogIn}>Login as Demo User</button>
        </div>
        
      </form>
    </div>
  );
}

export default LoginFormModal;
