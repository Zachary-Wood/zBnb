import { csrfFetch } from "./csrf";
// import { useDispatch } from "react-redux";


// VARIABLES FOR ACTIONS
const GETALLSPOTS = 'spots/GET_ALL_SPOTS'
const GET_SPOT_BY_ID = 'spots/GET_SPOTS_ID'



const getSpotsAll = (spots) => ({
    type: GETALLSPOTS,
    spots
})


const getSpotById = (spots) => ({
    type: GET_SPOT_BY_ID,
    spots
})

// thunks to dispatch
export const getAllSpotsThunk = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots')
    const dataJSON = await res.json()
    // console.log('jsonData' , dataJSON);
    dispatch(getSpotsAll(dataJSON))

    return res

}

export const getSpotDetailsThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`)
    const dataJSON = await res.json()
    dispatch(getSpotById(dataJSON))
    // console.log(dataJSON);
    return res
}




// SPOTS REDUCER
function spotsReducer(state = {}, action){
    switch(action.type) {
        case GETALLSPOTS: {
            // console.log(action.spots);
            const newState = {}
            action.spots.Spots.forEach((spot) => {
                newState[spot.id] = spot
            })
            return newState
        }
        case GET_SPOT_BY_ID: {
            const newState = {...state, [action.spots.id]: action.spots}
            return newState
            
        }
        default: 
            return state
    }

}


export default spotsReducer