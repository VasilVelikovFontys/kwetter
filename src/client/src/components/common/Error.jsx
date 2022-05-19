import React from 'react'
import '../../styles/components/common/error.css';

const Error = props => {
    const {message, handleOk} = props

    return (
        <div className='error-container'>
            <span className='error-message'>{message}</span>
            <div className='error-ok-button' onClick={handleOk}>OK</div>
        </div>
    )
}

export default Error;
