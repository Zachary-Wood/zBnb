import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReviewsFromSpotThunk } from "../../store/reviews";
import { useParams } from "react-router-dom";
import CreateAReview from "../Reviews/CreateAReview";
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import { useState } from "react";
import { DeleteAReview } from "../Reviews/DeleteAReview";
// import { FaStar } from "react-icons/fa";
import './GetAllReviewsForSpot.css'





const GetAllReviewsForSpot = ({spot}) => {
    const dispatch = useDispatch()
    const {spotId} = useParams()
    const [showButton, setShowButton] = useState(true);
    let allReviews = useSelector(state => state.reviews)
    // console.log('reviews', allReviews)


    allReviews = Object.values(allReviews)
    // console.log('reviews', allReviews);
    // console.log(reviews);
    const currentUser = useSelector(state => state.session.user?.id)
    const spotsOwner = useSelector(state => state.spots?.[spotId].ownerId)
    // console.log(currentUser);
    const alreadyReviewed = allReviews.some(review => review.userId === currentUser)
    // reverses the reviews to be the newest on first
    const reviews = [...allReviews].reverse()
    // console.log(reviews);
    
    useEffect(() => {
        dispatch(getAllReviewsFromSpotThunk(spotId))
        setShowButton(true)
    },[spotId, dispatch])

    useEffect(() => {
        if (currentUser && reviews.some(review => review.userId === currentUser)) {
            setShowButton(false); 
        } else {
            setShowButton(true)
        }
    }, [reviews, currentUser]);

    useEffect(() => {
        if (spot && reviews.length > 0) {
        setShowButton(true); 
        }
    }, [spot, reviews]);



return (
    <>
    <div className='spot-details-review-header'>
        {showButton && currentUser && currentUser !== spotsOwner && !alreadyReviewed && (

            <OpenModalButton
                className="create-review-button"
                buttonText="Post Your Review!"
                modalComponent={<CreateAReview/>} 
            />
        )}

                        
            </div>

        {!allReviews.length && currentUser && currentUser !== spotsOwner?.Owner?.id &&
                <p className="be-the-first">Be the first to post a review!</p>
            }
    
    <div className="reviews-con">
        { reviews.map(review => 
        
            <div key={review.id} className="reviews-text-con">
                <h3 className="review-name">{`${review?.User?.firstName}`}</h3>
                <p className="date-created">{`${`${new Date(review.createdAt).getMonth()}-${new Date(review.createdAt).getDate()}-${new Date(review.createdAt).getFullYear()} `  }`}</p>
                <p className="review-description">{`${review.review}`}</p>


                
                {review.userId === currentUser && <DeleteAReview className="delte-review-btn" reviewId={review.id} spotId={spotId} />}
            </div>
        )}
        
    
    
    </div>
    </>
  )
}


export default GetAllReviewsForSpot
