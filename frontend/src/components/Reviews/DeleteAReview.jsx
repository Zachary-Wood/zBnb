import { getAllReviewsFromSpotThunk, deleteAReviewByIdThunk} from "../../store/reviews"
import OpenModalButton from "../OpenModalButton/OpenModalButton"
import { useModal } from "../../context/Modal"
import { useDispatch } from "react-redux"
import { useEffect } from "react"

import { getSpotDetailsThunk } from "../../store/spots"
import './DeleteAReview.css'




export const DeleteAReview = ({reviewId, spotId}) => {
  const dispatch = useDispatch()
  const { closeModal } = useModal()
    
  useEffect(() => {
    dispatch(getAllReviewsFromSpotThunk(spotId))
  },[spotId, dispatch])

  const deleteUserReview = async (e) => {
    e.preventDefault()
    await dispatch(deleteAReviewByIdThunk(reviewId))
    closeModal()
    await dispatch(getSpotDetailsThunk(spotId))
    
  }
  
  return (
        <div className="delete-btn">
        <OpenModalButton
            buttonText='Delete This Review'
            className="delete-review-btn"
            modalComponent={
                <div className="delete-modal-con">
                    <div className="delete-modal-content"> 
                    <h2 className="delete-h2">Delete</h2>
                    <p className="delete-text">Are you sure you want to delete this review?</p>
                <div className="delte-buttons-con">
                    <button className="delete-button" onClick={deleteUserReview}>Yes (Delete Review)</button>
                    <button className="keep-button" onClick={() => closeModal()}>No (Keep Review)</button>
                    
                        </div>
                    </div> 
                </div>
            }
         />
         </div>

  )
}
