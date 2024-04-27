import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getAllCurrentUsersSpotsThunk } from "../../store/spots"
import { NavLink } from "react-router-dom"
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import './GetCurrentUserSpots.css'
import DeleteASpot from "./DeleteASpot"
import { FaStar } from "react-icons/fa";
// import GetAllReviewsForSpot from "./GetAllReviewsForSpot"


const GetCurrentUserSpots = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    let data = useSelector(state => state.spots)
    data = Object.values(data)

    const currentUser = useSelector(state => state.session.user) 
    // console.log(currentUser)


    useEffect(() => {
    if(!currentUser) {
          navigate('/')
        }

        dispatch(getAllCurrentUsersSpotsThunk())

        
    },[dispatch, currentUser, navigate]) 


  return (
    <>

    <div className="manage-spots-header">
      <div className="nav-padding">
       <h1 className="manage-h1">Manage Your Spots</h1>
       <button className='submit-button' onClick={() => navigate('/spots/new')}>Create a new Spot</button>
       </div>
       <section>
       <div className="spots-con">
            { data && data.map((spot) => (

                <div key={spot.id} className="current-spot-landing-con">
                <NavLink to={`/spots/${spot.id}`}>
                <img className="current-spot-image" src={spot.previewImage}/>
                <div className="current-spot-location-info-con">
                  <div className="spot-location-stars">
                    <h3 className="current-spot-location">{`${spot.city}, ${spot.state}`}</h3>
                    <div className="current-spot-rating-con">
                        <p className="current-spots-stars"><FaStar className="fa-star"/>{`${spot.avgRating || 'NEW'}`}</p>
                    </div>
                    </div>
                    <p className="current-spot-price">{`$${spot.price} per night.`}</p>
                    

                </div>
                </NavLink>


                <div className="button-con">
                <div className="update-button-container">
                <button className="update-button" onClick={() => navigate(`/spots/${spot.id}/edit`)}>Update Spot</button>
                </div>

                <div className="delete-button-container">
                <OpenModalButton buttonText={'Delete'} className='delete-btn-getall' modalComponent={<DeleteASpot spotId={+spot.id} />}/>
                </div>

                </div>
                
                

               </div>

              ))}

            

            
        </div>
        </section>
    
    </div>
    
    
    </>
  )
}


export default GetCurrentUserSpots



