import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import './UpdateASpot.css'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { useEffect } from 'react'
import { updateASpotThunk } from '../../store/spots'
import { getSpotDetailsThunk } from '../../store/spots'
import { useDispatch } from 'react-redux'

const UpdateASpot = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {spotId} = useParams()
    // console.log(spotId, 'spotId');
    const spotToUpdate = useSelector(state => state.spots[spotId])
    // console.log(spotToUpdate);
    const currentUser = useSelector(state => state.session.user)
    const [country, setCountry] = useState(spotToUpdate?.country)
    const [address, setAddress] = useState(spotToUpdate?.address)
    const [city, setCity] = useState(spotToUpdate?.city)
    const [state, setState] = useState(spotToUpdate?.state)
    // const [lat, setLat] = useState(spotToUpdate?.lat)
    // const [lng, setLng] = useState(spotToUpdate?.lng)
    const [name, setName] = useState(spotToUpdate?.name)
    const [description, setDescription] = useState(spotToUpdate?.description)
    const [price, setPrice] = useState(spotToUpdate?.price)



    const [errors, setErrors] = useState({})

    useEffect(() => {


        const errorsObj = {}

        if(!currentUser) {
          navigate('/')
        }


        if(!address) errorsObj.address = 'Please provide a valid address'
        if(!city) errorsObj.city = 'Please provide a valid city'
        if(!state) errorsObj.state = 'Please provide a valid state'
        if(!country) errorsObj.country = 'Please provide a valid country'
        if(!name) errorsObj.name = 'Please provide a valid spot name'
        if(!description) errorsObj.description = 'Please provide a descriptive message for your place with at least 30 characters'
        if(!price) errorsObj.price = 'Please provide a price that is a number'

        setErrors(errorsObj)

    } ,[address, city, state, country, name, description, price, currentUser, navigate])


    const handleSubmit = async (e) => {
        e.preventDefault()



        const updatedUserSpot = {
          ownerId: currentUser.id,
          address,
          city,
          state,
          country,
          name,
          description,
          price,
          lat: 89,
          lng: 179
        }


        const updatedSpot = await dispatch(updateASpotThunk(updatedUserSpot, spotId))
        dispatch(getSpotDetailsThunk(updatedUserSpot))
        navigate(`/spots/${updatedSpot.id}`)



    }

  return (
    <div className='update-form-con'>
        <h1 className='update-h1'>Update Your Spot</h1>
        <div className="spot-text-con">
          <h3 className="place-heading">{`Where's your place located?`}</h3>
          <p className="place-text">Guests will only get your exact address once they book a reservation.</p>
        </div>

        <form onSubmit={handleSubmit}>
        <div className="country-address-con">
            
            <label>
              <div className="errors-con">
              Country {errors.country && <p className="errors-mess">{errors.country}</p>}
              </div>
              
              
              <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="country-input"
              placeholder="Country"
            />
            </label>
  
            <label>
  
            <div className="errors-con">
              Street Address
              {errors.address && <p className="errors-mess">{errors.address}</p>}
              </div>
              <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="address-input"
              placeholder="Address"
            />
            </label>
            </div>

            <div className="city-state-con">
          <label>
          <div className="errors-con">
            City
            {errors.city && <p className="errors-mess">{errors.city}</p>}
            </div>
            <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="city-input"
            placeholder="City"
          /> 
          </label>
         
         <label>
         <div className="errors-con">
            State
            {errors.state && <p className="errors-mess">{errors.state}</p>}
            </div>
            <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="state-input"
            placeholder="STATE"
          />
          </label>
          </div>

          {/* <div className="lat-lng-con">

          <label>
            Latitude
            <input
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            className="lat-input"
            placeholder="Latitude"
          />
          </label>

          <label>
            Longitude
            <input
            type="text"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            className="lng-input"
            placeholder="Longitude"
          />
          </label>
          </div> */}

          <div className="spot-description-post-con">
            <h3 className="spot-heading">Describe your place to guests</h3>
            <p className="place-text">Mention the best features of your space, any special amentities like fast wifi, or 
            parking, and what</p>
            <p> you love about your area!</p>
         </div>
         < textarea
          
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="desc-input"
            placeholder="Description"
          
          />
          {errors.description && <p className="errors-mess">{errors.description}</p>}


          <div className="spot-title-post-con">
            <h3 className="spot-heading-title">Create a title for your spot</h3>
            <p className="spot-title"> Catch guests attention with a spot title that highlights what makes your 
            place special.
            </p>
         </div>

         <label>
          
            <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="name-input"
            placeholder="Name of your spot"
          />
          
          </label>
          {errors.name && <p className="errors-mess">{errors.name}</p>}
          


          <div className="spot-price-post-con">
            <h3 className="spot-heading-price">Set a base price for our spot</h3>
            <p className="spot-price-update"> Competitive pricing can help your listing stand out and rank higher 
            in search results
            </p>
         </div>
          <label>
            <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="price-input"
            placeholder="Price per night(USD)"
          />
          </label>
          {errors.price && <p className="errors-mess">{errors.price}</p>}
          


          <div className="post-submit-container">
          <button className="submit-button" 
          type="submit"
          onClick={(e) => e.console.log('button was clicked')}
          disabled={Object.values(errors).length > 0}

          >Update Your Spot</button>
          </div>
            





        </form>
    </div>
  )
}



export default UpdateASpot
