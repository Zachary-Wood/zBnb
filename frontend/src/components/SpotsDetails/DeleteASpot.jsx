import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal"
import { deleteASpotThunk } from "../../store/spots"
// import { useEffect } from "react";
// import { useParams } from "react-router-dom"






export const DeleteASpot = ({spotId}) => {

    // const {spotId} = useParams()
    console.log(spotId);
    const {closeModal} = useModal()
    const dispatch = useDispatch()
    
    const deleteYourSpot = async(e) => {
        e.preventDefault()


        await dispatch(deleteASpotThunk(spotId))
        closeModal()
    }


    

return (
    <div className="delete-your-spot-con">
        <form onSubmit={deleteYourSpot} className="delete-form container">
        <h2 className="delete-warning">Are you sure you want to remove this from your listings?</h2>

        <div className="warning message">
            <p>{'ARE YOU SURE YOUR WANT TO DELETE THIS SPOT'}</p>

        </div>

    <div className="button-delete-con">
        <button className="yes-btn" type="submit">{`Yes(Delete Spot)`}</button>
        <button onClick={() => closeModal()} className="no-btn">{`No(Keep Spot)`}</button>
    </div>
        


        </form>
    </div>
  )
}



export default DeleteASpot;
