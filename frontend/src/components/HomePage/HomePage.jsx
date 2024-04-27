import {useSelector, useDispatch} from "react-redux"
import { getAllSpotsThunk } from "../../store/spots";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import './homepage.css'
import { FaStar } from "react-icons/fa";

const HomePage = () => {
    const dispatch = useDispatch()
   
    // console.log('thunk data', getAllSpotsThunk);
    
    let data = useSelector(state => state.spots)
    data = Object.values(data)
    // console.log(data);
    // hello

    useEffect( () => {
        
        dispatch(getAllSpotsThunk())
    
    }, [dispatch])

  return (
    <section>
        <div className="spots-con">
            { data && data.map((spot) => (
                
                
                <NavLink to={`/spots/${spot.id}`} key={spot.id} className="spot-landing-con-home">

                
                <img className="spot-image" src={spot.previewImage}/>
                <span className="title-tooltip">{spot.name}</span>
            
                
                <div className="spot-location-info-con">
                    <div className="spot-location-rating">
                    <h3 className="spot-location">{`${spot.city}, ${spot.state}`}</h3>
                    <div className="spot-rating-con">
                        <FaStar className="fa-star"/>
                        <p className="spots-stars">{spot.avgRating ? parseFloat(spot.avgRating).toFixed(1) : 'New'}</p>
                    </div>
                    </div>
                    <p className="spot-price">{`$${spot.price} per night.`}</p>
                    

                </div>
            
                </NavLink>
                

              ))}

            
        </div>

    </section>
            

    
  )
}


export default HomePage