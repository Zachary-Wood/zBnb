import { csrfFetch } from "./csrf"

const GET_ALL_REVIEWS = 'reviews/GET_ALL_REVIEWS_FROM_SPOT'
const CREATE_A_REVIEW = 'reviews/CREATE_A_REVIEW'
const DELETE_A_REVIEW = 'reviews/DELETE_A_REVIEW'



//actions to send to thunk
const getAllReviews = (reviews) => ({
    type: GET_ALL_REVIEWS,
    reviews
})


const createAReview = (review) => ({
    type: CREATE_A_REVIEW, 
    review

})

const deleteAReview = (reviewId) => ({
    type: DELETE_A_REVIEW,
    reviewId
})


//thunks to dispatch


export const getAllReviewsFromSpotThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`)
    const dataJSON = await res.json()
    dispatch(getAllReviews(dataJSON));
    return dataJSON
}


export const postANewReviewForASpotThunk = (review, spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews` , {
        method: 'POST', 
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(review)
    })

    const newReview = await res.json()

    await dispatch(createAReview(newReview))
    return newReview
    
}

export const deleteAReviewByIdThunk = (reviewId) => async dispatch => {
    await csrfFetch(`/api/reviews/${reviewId}`,{

        method: 'DELETE'
    }
)
    await dispatch(deleteAReview(reviewId))

}

//REVIEWS REDUCER

function reviewsReducer(state = {}, action) {
    switch(action.type){

        case GET_ALL_REVIEWS: {
            const newState = {}
            // console.log('action', action);
            action.reviews.Reviews.forEach((review) => {
                newState[review.id] = review
            })
            console.log('new', newState);
            return newState
        }
        case CREATE_A_REVIEW: {
            const newState = {...state, [action.review.id]: action.review}
            // newState[action.review.id] = action.review
            return newState
        }
        case DELETE_A_REVIEW: {
            const newState = {...state}
            delete newState[action.reviewId]
            return newState
        }


        default: 
            return state
        
    }
}

export default reviewsReducer