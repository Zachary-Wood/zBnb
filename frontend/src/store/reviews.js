import { csrfFetch } from "./csrf"

const GET_ALL_REVIEWS = 'reviews/GET_ALL_REVIEWS_FROM_SPOT'
const CREATE_A_REVIEW = 'reviews/CREATE_A_REVIEW'



//actions to send to thunk
const getAllReviews = (reviews) => ({
    type: GET_ALL_REVIEWS,
    reviews
})


const createAReview = (review) => ({
    type: CREATE_A_REVIEW, 
    review

})


//thunks to dispatch


export const getAllReviewsFromSpotThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`)
    const dataJSON = await res.json()
    dispatch(getAllReviews(dataJSON));
    return res
}


export const postANewReviewForASpotThunk = (spotId, review) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews` , {
        method: 'POST', 
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(review)
    })

    const newReview = await res.json()

    await dispatch(createAReview(newReview))
    return newReview
    
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
            return newState
        }
        case CREATE_A_REVIEW: {
            const newState = {...state}
            newState[action.reviews.id] = action.reviews
            return newState
        }


        default: 
            return state
        
    }
}

export default reviewsReducer