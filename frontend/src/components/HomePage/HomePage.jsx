import {useSelector, useDispatch} from "react-redux"
import { getAllSpotsThunk } from "../../store/spots";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import './homepage.css'

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

                <div key={spot.id} className="spot-landing-con">
                <NavLink to={`/spots/${spot.id}`}>
                <div className="spot-image-home">
                <img className="spot-image" src={spot.previewImage}/>
                <span className="title-tooltip">{spot.name}</span>
                </div>
                
                <div className="spot-location-info-con">
                    <h3 className="spot-location">{`${spot.city}, ${spot.state}`}</h3>
                    <p className="spot-price">{`$${spot.price} per night.`}</p>
                    <div className="spot-rating-con">
                        <p className="spots-stars">{spot.avgRating ? parseFloat(spot.avgRating).toFixed(1) : 'New'}</p>
                    </div>

                </div>
                </NavLink>
                </div>

              ))}

            
        </div>

    </section>
            

    
  )
}


export default HomePage