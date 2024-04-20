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
        <h1>Home Page</h1>
        <div className="spots-con">
            { data && data.map((spot) => (

                <div key={spot.id} className="spot-info-con">
                <NavLink to={`/spots/${spot.id}`}>
                <img className="spot-image" src={spot.previewImage}/>
                <div className="spot-text-con">
                    <p className="spot-location">{`${spot.city} ${spot.country}`}</p>
                    <p className="spot-price">{`${spot.price} per night.`}</p>
                    <h1>Test</h1>

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