import React, {useState} from 'react'
import '../../../styles/components/profile/name-and-picture/picture.css';
import {useDispatch} from "react-redux";
import {updatePicture} from "../../../store/actions/pictureActions";

const Picture = props => {
    const {picture} = props;

    const dispatch = useDispatch();

    const [error, setError] = useState('');

    const choosePicture = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = ".gif,.jpg,.jpeg,.png";

        input.onchange = e => {
            const file = e.target.files[0];

            dispatch(updatePicture(file))
                .then(() => {
                    //No action needed
                })
                .catch(pictureError => {
                    if (pictureError.message) return setError(pictureError.message);
                    setError(pictureError);
                });
        }

        input.click();
    }

    return (
        <div className='picture' onClick={choosePicture}>
            {picture ? (
                <img src={picture} alt='avatar'/>
            ) : (
                <i className="fa-solid fa-user" />
            )}

            {error && (
                <div className="name-and-picture-error">
                    {error.message ? error.message : error}
                </div>
            )}
        </div>
    )
}

export default Picture;
