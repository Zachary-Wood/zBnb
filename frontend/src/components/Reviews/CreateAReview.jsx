import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarInput from "./StarsInput";
import { postANewReviewForASpotThunk } from "../../store/reviews";
import { getSpotDetailsThunk } from "../../store/spots";



const CreateAReview = () => {
    
    const { closeModal } = useModal()
    const dispatch = useDispatch()
    const {spotId} = useParams()
    let allReviews = useSelector(state => state.reviews)
    allReviews = Object.values(allReviews)
    const currentUser = useSelector(state => state.session.user?.id)
    console.log(currentUser);
    const spotOwner = useSelector(state => state.spots?.[spotId].ownerId)
    const reviewed = allReviews?.find(review => review.userId === currentUser)
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

    

    const submitHandler = async (e)=>{
        e.preventDefault()

        const newReview = {
            review,
            stars
        }

        await dispatch(postANewReviewForASpotThunk(newReview, spotId))
        await dispatch(getSpotDetailsThunk(spotId))
        closeModal();
        setReview('')
        setStars(null)
        setErrors({})
        // window.location.reload()
    }

return (
    <>
        {currentUser && (currentUser !== spotOwner) && !reviewed && (
            <form onSubmit={submitHandler}>
                <h2>How was your stay?</h2>
                    <textarea 
                     type="text"
                     value={review}
                     onChange={(e) => setReview(e.target.value)}
                     placeholder="Leave your review here..."/>
                        {errors.review && <p className="errors-mess">{errors.review}</p>}
                    
                    
                    <StarInput setStars={setStars} stars={stars}/>
                    
                    <button
                    type="submit"
                    className="delete-review-button"
                    disabled={Object.values(errors).length > 0}>
                    Submit Your Review
                    </button>
                    {averageRating > 0 && (
                    <div> Spots Average Rating: {averageRating.toFixed(1)}</div>
                    
                    )}
                            
            </form>
        )}
    </>
    )
}
   



export default CreateAReview;
