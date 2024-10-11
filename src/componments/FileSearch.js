import React, {useState, useEffect, useRef} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch, faTimes} from '@fortawesome/free-solid-svg-icons';

const FileSearch = ({title, onFileSearch}) => {
    const [inputActive, setInputActive] = useState(false);
    const [value, setValue] = useState('');

    const closeSearch = (event) => {
        event.preventDefault();
        setInputActive(false);
        setValue('');
    }

    let node = useRef(null);

    useEffect(() => {
        const handleInputEvent = (event) => {
            const {keyCode} = event;
            //Enter
            if (keyCode === 13 && inputActive) {
                onFileSearch(value);
            } else if (keyCode === 27 && inputActive) {//esc
                closeSearch(event);
            }
        }
        document.addEventListener('keyup', handleInputEvent);
        return () => {
            document.removeEventListener('keyup', handleInputEvent);
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
            <div className="alert alert-primary d-flex justify-content-between align-items-center">
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

export default FileSearch;