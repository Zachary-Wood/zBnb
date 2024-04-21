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

    useEffect( () => {
        
        dispatch(getAllSpotsThunk())
    
    }, [dispatch])

  return (
    <section>
        <div className="spots-con">
            { data && data.map((spot) => (

                <div key={spot.id} className="spot-info-con">
                <NavLink to={`/spots/${spot.id}`}>
                <img className="spot-image" src={spot.previewImage}/>
                <div className="spot-text-con">
                    <h3 className="spot-location">{`${spot.city} ${spot.country}`}</h3>
                    <p className="spot-price">{`${spot.price} per night.`}</p>
                    <div className="spot-rating-con">
                        <p className="spots-stars">{`${spot.avgRating || 'No ratings'}`}</p>
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