import { csrfFetch } from "./csrf";
// import { useDispatch } from "react-redux";


// VARIABLES FOR ACTIONS
const GETALLSPOTS = 'spots/GET_ALL_SPOTS'
const GET_SPOT_BY_ID = 'spots/GET_SPOTS_ID'
const CREATE_SPOT = 'spots/CREATE_SPOT'
const UPDATE_USER_SPOT = 'spots/UPDATE_USER_SPOT'
const DELETE_YOUR_SPOT = 'spots/DELETE_YOUR_SPOT'
const GET_CURRENT_USERS_SPOTS = 'spots/GET_CURRENT_USERS_SPOTS'



const getSpotsAll = (spots) => ({
    type: GETALLSPOTS,
    spots
})


const getSpotById = (spots) => ({
    type: GET_SPOT_BY_ID,
    spots
})


const createASpot = (spots) => ({
    type: CREATE_SPOT,
    spots
})

const updateASpot = (spots) => ({
    type: UPDATE_USER_SPOT,
    spots
})

const deleteASpot = (spotId) => ({
    type: DELETE_YOUR_SPOT,
    spotId
})





const getAllCurrentUsersSpots = (spots) => ({
    type: GET_CURRENT_USERS_SPOTS,
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
    await dispatch(getSpotById(dataJSON))
    // console.log(dataJSON);
    return res
}

export const createASpotThunk = (spot, images) => async dispatch => {

    const imageLinks = Object.values(images)
    // console.log(imageLinks);

    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(spot)
    })

   

        const newSpot = await res.json()
        // console.log(newSpot)

        const spotImagesAdded = imageLinks.forEach(async (url) => {

            await csrfFetch(`/api/spots/${newSpot.id}/images`, {
                method: 'POST',
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({url: url, preview: true})
            })
        })

        // console.log(newSpot, spotImagesAdded);
        
        await dispatch(createASpot(newSpot, spotImagesAdded))
        return newSpot
    }

    export const updateASpotThunk = (spot, spotId) => async dispatch => {
        const res = await csrfFetch(`/api/spots/${spotId}`, {
            method: 'PUT',
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(spot)
        })

        const dataJSON = await res.json()
        // console.log(dataJSON);

         await dispatch(updateASpot(dataJSON))
         return dataJSON
    }


    export const deleteASpotThunk = (spotId) => async dispatch => {
        const res = await csrfFetch(`/api/spots/${spotId}`, {
            method: 'DELETE'
        }
    )
    await dispatch(deleteASpot(spotId))
    return res.json('Spot has been deleted')
    }


    export const getAllCurrentUsersSpotsThunk = () => async dispatch => {
        const res = await csrfFetch('/api/spots/current')
        const dataJSON = await res.json()

        await dispatch(getAllCurrentUsersSpots(dataJSON))
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
        case CREATE_SPOT: {
            const newState = {...state}
            newState[action.spots.id] = action.spots
            return newState
        }
        case UPDATE_USER_SPOT: {
            const newState = {...state}
            newState[action.spots.id] = action.spots
            return newState
        }
        case DELETE_YOUR_SPOT: {
            const newState = {...state}
            delete newState[action.spotId]
            return newState
        }

        case GET_CURRENT_USERS_SPOTS: {
            const newState = {}
            action.spots.Spots.forEach((spot) => {
                newState[spot.id] = spot
            })
            // console.log(newState);
            return newState

        }

        default: 
            return state
    }

}


export default spotsReducer