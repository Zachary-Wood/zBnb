import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
import { TbBrandAirbnb } from "react-icons/tb";
import './Navigation.css';


function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
  
    <ul className='navigation-con'>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Jersey+25&display=swap" rel="stylesheet"></link>
      <li className='logo'>
        <div className='logo-con'>

        <TbBrandAirbnb className='logo'/>
        <NavLink to="/" className='zbnb-logo'>Zbnb</NavLink>
        </div>
      </li>
      {isLoaded && (
        <li className='right-buttons'>
          {sessionUser && <NavLink className='create-spot' to={`spots/new`}>Create a spot</NavLink>}
          <ProfileButton user={sessionUser} />
        </li>


      )}
    </ul>

  );
}

export default Navigation;
