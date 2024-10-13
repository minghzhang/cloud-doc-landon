import React, {useState, useEffect, useRef} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch, faTimes} from '@fortawesome/free-solid-svg-icons';
import PropTypes from "prop-types";
import useKeyPress from "../hooks/useKeyPress.js";

const FileSearch = ({title, onFileSearch}) => {
    const [inputActive, setInputActive] = useState(false);
    const [value, setValue] = useState('');

    const closeSearch = () => {
        setInputActive(false);
        setValue('');
        onFileSearch('');
    }

    let node = useRef(null);
    let enterKeyPressed = useKeyPress(13);
    let escKeyPressed = useKeyPress(27);
    useEffect(() => {
        if (enterKeyPressed && inputActive) {
            onFileSearch(value);
        }
        if (escKeyPressed && inputActive) {
            closeSearch();
        }

    })

    //input 自动获取光标
    useEffect(() => {
        if (inputActive) {
            node.current.focus();
        }
    }, [inputActive])
    return (
        <>
            <div className="alert alert-primary d-flex justify-content-between align-items-center mb-0">
                {!inputActive &&
                    <>
                        <span className="">{title}</span>
                        <button type="button" className="icon-button" onClick={() => setInputActive(true)}>
                            <FontAwesomeIcon icon={faSearch} size="lg"/>
                        </button>
                    </>
                }

                {inputActive &&
                    <>
                        <input type="text" className="form-control" value={value} ref={node}
                               onChange={(e) => setValue(e.target.value)}/>

                        <button type="button" className="icon-button" onClick={closeSearch}>
                            <FontAwesomeIcon icon={faTimes} size="lg"/>
                        </button>
                    </>
                }
            </div>
        </>
    );

}

FileSearch.propTypes = {
    title: PropTypes.string,
    onFileSearch: PropTypes.func.isRequired
}


export default FileSearch;