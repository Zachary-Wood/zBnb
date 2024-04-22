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
        <TbBrandAirbnb className='zbnb-logo'/>
        <NavLink to="/">Zbnb</NavLink>
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
