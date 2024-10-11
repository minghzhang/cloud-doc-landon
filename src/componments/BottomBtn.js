import React from 'react';
import PropTypes from "prop-types";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const BottomBtn = ({text, colorClass, icon, onBtnClick}) => {

    return (
        <>
            <button type="button" onClick={onBtnClick} className={`btn w-100 border-0 ${colorClass}`}>
                <FontAwesomeIcon icon={icon} size="lg" className="me-2"/>
                {text}
            </button>
        </>
    );
}
BottomBtn.propTypes = {
    text: PropTypes.string,
    colorClass: PropTypes.string,
    icon: PropTypes.element,
    onBtnClick: PropTypes.func,
}

export default BottomBtn;