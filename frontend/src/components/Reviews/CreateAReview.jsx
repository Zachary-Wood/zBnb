import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useEffect, useState } from "react";
import { getSpotDetailsThunk } from "../../store/spots";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";


const CreateAReview = ({spot}) => {
    
    
    const {closeModal} = useModal()
    const dispatch = useDispatch()
  
    
    const user = useSelector(state => state.session.user)

    const {spotId} = useParams()
    const [review, setReview] = useState('')
    const [showButton, setShowButton] = useState(true)
    const [stars, setStars] = useState(0)
    const [errors, setErrors] = useState({})
    

    useEffect(() => {
        const errorsObj = {}

        if(review.length < 10) errorsObj.review = 'Review must have at least 10 characters'
        if(stars > 5 || stars < 1) errorsObj.stars = 'Star rating must be between 1-5'

        if(user && spot && spot.reviews.length > 0) {
            const hasReviewed = spot.reviews.find(review => review.userId === user.id)
            setShowButton(!hasReviewed)
        }
        
        setErrors(errorsObj)

    },[user, spot, stars, review, showButton])

  
    const submitYourReview = async(e) => {
        e.preventDefault()


        const review = {
            review,
            stars,
            spotId
        }


        await dispatch(getSpotDetailsThunk(spotId))
        closeModal()
        setReview('')
        setStars(0)

    }
  
  
    return (
    <div className="create-review-form">
        <h2>How was your stay?</h2>
        <form onSubmit={submitYourReview}> 
            <div className="star-rating">
                {[1,2,3,4,5].map((starValue) => (
                    <button 
                    type="button" 
                    key={starValue} 
                    className={`star ${starValue <= stars ? 'on' : ''}`}
                    onClick={(e) => setStars(e.target.value)}
                    >
                        <FaStar className="star-icon"/>
                    </button>
                ))}
                <p className="stars-text">Stars</p>
            </div>

            < textarea
          
            type="text"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="review-input"
            placeholder="Leave your review here"
          
          />
          {errors.review && <p className="errors-mess">{errors.review}</p>}

          <button
        type="submit"
        disabled={Object.values(errors).length > 0}
          >
            Submit Your Review
          </button>
        
        
        </form>




    </div>
  )
}




export default CreateAReview;
