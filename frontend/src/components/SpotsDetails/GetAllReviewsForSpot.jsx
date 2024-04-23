import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReviewsFromSpotThunk } from "../../store/reviews";
import { useParams } from "react-router-dom";
import CreateAReview from "../Reviews/CreateAReview";
import OpenModalButton from '../OpenModalButton/OpenModalButton'





const GetAllReviewsForSpot = ({spot}) => {
    const dispatch = useDispatch()
    const {spotId} = useParams()
    let allReviews = useSelector(state => state.reviews)
    // console.log('reviews', allReviews)


    allReviews = Object.values(allReviews)

    console.log(allReviews);
    useEffect(() => {
        dispatch(getAllReviewsFromSpotThunk(spotId))
    },[spotId, dispatch])

   


    





  return (
    <>
    <div className='spot-details-review-header'>
                        <OpenModalButton
                            className="create-review-button"
                            modalComponent={<CreateAReview spot={spot} />}
                            buttonText="Submit Review"
                        />
                    </div>
    
    <div className="reviews-con">
        { allReviews.map(review => 

            <div key={review.id} className="reviews-text-con">
                <h3 className="review-name">{`${review?.User.firstName}`}</h3>
                <p className="date-created">{`${`${new Date(review.createdAt).getMonth()}-${new Date(review.createdAt).getDate()}-${new Date(review.createdAt).getFullYear()} `  }`}</p>
                <p className="review-description">{`${review.review}`}</p>


            </div>
        )}
        
    
    
    </div>
    </>
  )
}


export default GetAllReviewsForSpot
