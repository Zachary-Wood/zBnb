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


        <div className='images-con'>
            <img className='main-image' src={clickedSpot.SpotImages?.[0]?.url || `https://res.cloudinary.com/dstnyoxvl/image/upload/v1713641958/zBnb%20photoes/pngtree-no-image-vector-illustration-isolated-png-image_1694547_warkgu.jpg` } />
                <div className='left-images-con'>
                    <img className='other-spot-images' src={clickedSpot.SpotImages?.[1]?.url || `https://res.cloudinary.com/dstnyoxvl/image/upload/v1713641958/zBnb%20photoes/pngtree-no-image-vector-illustration-isolated-png-image_1694547_warkgu.jpg` } />
                    <img className='other-spot-images' src={clickedSpot.SpotImages?.[2]?.url || `https://res.cloudinary.com/dstnyoxvl/image/upload/v1713641958/zBnb%20photoes/pngtree-no-image-vector-illustration-isolated-png-image_1694547_warkgu.jpg` } />
                </div>
                <div className='right-images-con'>
                    <img className='other-spot-images' src={clickedSpot.SpotImages?.[3]?.url || `https://res.cloudinary.com/dstnyoxvl/image/upload/v1713641958/zBnb%20photoes/pngtree-no-image-vector-illustration-isolated-png-image_1694547_warkgu.jpg` } />
                    <img className='other-spot-images' src={clickedSpot.SpotImages?.[4]?.url || `https://res.cloudinary.com/dstnyoxvl/image/upload/v1713641958/zBnb%20photoes/pngtree-no-image-vector-illustration-isolated-png-image_1694547_warkgu.jpg` } />
                </div>


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