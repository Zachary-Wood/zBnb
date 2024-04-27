import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <>
    <div className='sign-up-con'>
      <h1 className='h1-con'>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className='signup-inputs'>
        <label className='label-con'>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='input'
          />
        </label>
        {errors.email && <p>{errors.email}</p>}
        <label className='label-con'>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className='input'
          />
        </label>
        {errors.username && <p>{errors.username}</p>}
        <label className='label-con'>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className='input'
          />
        </label>
        {errors.firstName && <p>{errors.firstName}</p>}
        <label className='label-con'>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className='input'
          />
        </label>
        {errors.lastName && <p>{errors.lastName}</p>}
        <label className='label-con'>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='input'
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
        <label className='label-con'>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className='input'
          />
        </label>
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        <button className='sign-up-button' disabled={email.length < 1 || username.length < 4 || password.length < 6 || firstName.length < 1 || lastName.length < 1}type="submit">Sign Up</button>
        </div>
     </form>
      </div>
    </>
    
  );
}

export default SignupFormModal;
