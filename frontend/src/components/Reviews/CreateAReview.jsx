import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarInput from "./StarsInput";
import { postANewReviewForASpotThunk } from "../../store/reviews";
import { getSpotDetailsThunk } from "../../store/spots";
import './CreateAReview.css'


const CreateAReview = () => {
    
    const { closeModal } = useModal()
    const dispatch = useDispatch()
    const {spotId} = useParams()
    let allReviews = useSelector(state => state.reviews)
    allReviews = Object.values(allReviews)
    const currentUser = useSelector(state => state.session.user?.id)
    // console.log(currentUser);
    const spotOwner = useSelector(state => state.spots?.[spotId].ownerId)
    const reviewed = allReviews.some(review => review.userId === currentUser)
    // console.log(reviewed);

  
    
    
    
    const [stars,setStars] = useState(0)
    const [review,setReview] = useState('')
    const [errors, setErrors] = useState({})
    const [averageRating ,setAverageRating] = useState(0)

 
    useEffect(() => {
        if (allReviews.length > 0) {
            const totalStars = allReviews.reduce((acc, curr) => acc + curr.stars, 0);
            const avg = totalStars / allReviews.length;
            setAverageRating(avg);
        }
    }, [allReviews]);


    useEffect(() => {
        const errorsObj = {}
        if(review.length < 10) errorsObj.review = "Review must exceed 10 characters"
        if(!stars) errorsObj.stars = "Please provide a star rating"
        setErrors(errorsObj)
    
    }, [review,stars])

    function clear() {
        setReview('')
        setStars(null)
        setErrors({})
    }

    const submitHandler = async (e)=>{
        e.preventDefault()

        const newReview = {
            review,
            stars
        }

        await dispatch(postANewReviewForASpotThunk(newReview, spotId))
        await dispatch(getSpotDetailsThunk(spotId))
        closeModal();
        clear()
    }

return (
    <>
        {currentUser && (currentUser !== spotOwner) && !reviewed && (
            <div className="review-box">
            <form onSubmit={submitHandler}>
                <div className="items-review-con">
                <h2 className="review-h2">How was your stay?</h2>
                    <textarea 
                    className="review-text-area"
                     type="text"
                     value={review}
                     onChange={(e) => setReview(e.target.value)}
                     placeholder="Leave your review here..."/>
                        {errors.review && <p className="errors-mess">{errors.review}</p>}
                    
                    
                    <StarInput className='stars-hover' setStars={setStars} stars={stars}/>
                    
                    <button
                    type="submit"
                    className="post-review-button"
                    disabled={Object.values(errors).length > 0}>
                    Submit Your Review
                    </button>
                    {averageRating > 0 && (
                    <div className="spot-average"> Spots Average Rating: {averageRating.toFixed(1)}</div>
                    
                    )}
                    </div> 
            </form>
            </div>
        )}
    </>
    )
}
   



export default CreateAReview;
