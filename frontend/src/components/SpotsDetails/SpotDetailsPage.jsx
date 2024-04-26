import { useDispatch, useSelector } from 'react-redux';
import './SpotDetails.css'
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { getSpotDetailsThunk } from '../../store/spots';
import GetAllReviewsForSpot from './GetAllReviewsForSpot';
import { FaStar } from "react-icons/fa";

const SpotDetailsPage = () => {

    const dispatch = useDispatch()
    const { spotId } = useParams()
    const clickedSpot = useSelector(state => state.spots[spotId])
    
    // const clickedSpot = spots.find(spot => spot.id === +spotId)
    // console.log('spots',spots);
    
    // console.log('clicked spot', clickedSpot);
    
    const alertBookingFeature = () => {
        alert("Feature coming soon")
    };

    useEffect(() => {

        dispatch(getSpotDetailsThunk(spotId))

    }, [spotId, dispatch])

    const reviews = () => {
        if (!clickedSpot) return null;
        const { numReviews, avgStarRating } = clickedSpot;
        if (numReviews > 1 && avgStarRating) return `${avgStarRating.toFixed(1)} · ${numReviews} reviews`;
        else if (numReviews === 1 && avgStarRating)  return `${avgStarRating.toFixed(1)} · ${numReviews} review`;
        else return 'New';
        
    };

    
    






  return (
    <>
        {clickedSpot &&  (
        
    <div className='selected-spot-con' >
            <div className='spot-details'>
                <h2>{clickedSpot.name}</h2>
                <h3>{`${clickedSpot.city}, ${clickedSpot.state}, ${clickedSpot.country}`}</h3>
            </div>

        <div className='images-con'>
            <img className='main-image' src={clickedSpot.SpotImages?.[0]?.url || `https://res.cloudinary.com/dstnyoxvl/image/upload/v1713641958/zBnb%20photoes/pngtree-no-image-vector-illustration-isolated-png-image_1694547_warkgu.jpg` } alt='previewImage'/>
                <div className='left-images-con'>
                    <img className='other-spot-images' src={clickedSpot.SpotImages?.[1]?.url || `https://res.cloudinary.com/dstnyoxvl/image/upload/v1713641958/zBnb%20photoes/pngtree-no-image-vector-illustration-isolated-png-image_1694547_warkgu.jpg` } alt='smallImage1'/>
                    <img className='other-spot-images' src={clickedSpot.SpotImages?.[2]?.url || `https://res.cloudinary.com/dstnyoxvl/image/upload/v1713641958/zBnb%20photoes/pngtree-no-image-vector-illustration-isolated-png-image_1694547_warkgu.jpg` } alt='smallImage2'/>
                </div>
                <div className='right-images-con'>
                    <img className='other-spot-images' src={clickedSpot.SpotImages?.[3]?.url || `https://res.cloudinary.com/dstnyoxvl/image/upload/v1713641958/zBnb%20photoes/pngtree-no-image-vector-illustration-isolated-png-image_1694547_warkgu.jpg` } alt='smallImage3'/>
                    <img className='other-spot-images' src={clickedSpot.SpotImages?.[4]?.url|| `https://res.cloudinary.com/dstnyoxvl/image/upload/v1713641958/zBnb%20photoes/pngtree-no-image-vector-illustration-isolated-png-image_1694547_warkgu.jpg` } alt='smallImage4' />
                </div>


        </div>




       <div className='spot-info-con-id'>
            <div className='spot-description-con'>
                <h3>{`Hosted by ${clickedSpot.Owner?.firstName} ${clickedSpot.Owner?.lastName}`}</h3>
                <p>{`${clickedSpot.description}`}</p>
            </div>
            <div className='spot-price-rating-con'>
                <div className='price-rating'>
                    <p>{`${clickedSpot.price} per night`}</p>
                    <button className='booking-button' onClick={alertBookingFeature}>Reserve</button>
                    <p className='reviews-show'> {reviews()}</p>
            </div>
            </div>
            
            <div className="review-con">
            <h1>
                <i className="">
                    <FaStar/>
                </i>
                
                <p className=""> {reviews()}</p>
                
            </h1>
                <GetAllReviewsForSpot/>
            </div>
        
        
       
        </div>
    </div> 
        )}
    
    </>
  )
}



export default SpotDetailsPage; 
