import { useDispatch, useSelector } from 'react-redux';
import './SpotDetails.css'
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { getSpotDetailsThunk } from '../../store/spots';

const SpotDetailsPage = () => {

    const dispatch = useDispatch()
    const { spotId } = useParams()

    let spots = useSelector(state => state.spots)
    // console.log('spots',spots);
    spots = Object.values(spots)
    const clickedSpot = spots.find(spot => spot.id === +spotId)
    console.log('clicked spot', clickedSpot);


    useEffect(() => {
        dispatch(getSpotDetailsThunk(spotId))
    }, [spotId, dispatch])
    






  return (
    <>
        {clickedSpot &&
        
    <div className='selected-spot-con' >
            <div className='spot-details'>
                <h2>{clickedSpot.name}</h2>
                <h3>{`${clickedSpot.city}, ${clickedSpot.state}, ${clickedSpot.country}`}</h3>
            </div>




       <div className='spot-info-con'>
            <div className='spot-description-con'>
                <h3>{`Hosted by ${clickedSpot.Owner?.firstName} ${clickedSpot.Owner?.lastName}`}</h3>
                <p>{`${clickedSpot.description}`}</p>
            </div>
            <div className='spot-price-rating-con'>
                <div className='price-rating'>
                    <p>{`${clickedSpot.price} per night`}</p>
                    <button className='booking-button'>Book me</button>
            </div>
            </div>
        </div>
    </div> 
        }
    
    </>
  )
}



export default SpotDetailsPage; 
