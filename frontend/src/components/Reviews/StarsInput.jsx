import {useState} from "react";

const StarInput = ({stars, setStars}) => {
    const [starEffect, setStarEffect] = useState(stars);
    const starRating = [1, 2, 3, 4, 5];
    return(<div className="stars-rating">
        <ul>

            {starRating.map(rating => {
                return(<i 
                    key={`stars-rating-${rating}`}
                    className={`fa-${starEffect >= rating ? "solid" : "regular"} fa-star`}
                    onClick={()=> setStars(starEffect)}
                    onMouseEnter={()=> setStarEffect(rating)}
                    onMouseLeave={()=> setStarEffect(stars)} />)
            })}
            Stars
        </ul>
        
    </div>)
}

export default StarInput;