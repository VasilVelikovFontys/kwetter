import React from 'react'
import '../../../styles/components/profile/name-and-picture/picture.css';
import {useDispatch} from "react-redux";
import {updatePicture} from "../../../store/actions/pictureActions";

const Picture = props => {
    const {picture, own} = props;

    const dispatch = useDispatch();

    const choosePicture = () => {
        if (!own) return;

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = ".gif,.jpg,.jpeg,.png";

        input.onchange = e => {
            const file = e.target.files[0];

            dispatch(updatePicture(file))
                .then(() => {
                    //No action needed
                });
        }

        input.click();
    }

    return (
        <div className={`picture ${own ? 'picture-own' : ''}`} onClick={choosePicture}>
            {picture ? (
                <img src={picture} alt='avatar'/>
            ) : (
                <i className="fa-solid fa-user" />
            )}
        </div>
    )
}

export default Picture;
