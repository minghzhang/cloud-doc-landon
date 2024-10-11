import React, {useState, useEffect, useRef} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMarkdown} from "@fortawesome/free-brands-svg-icons";
import {faEdit, faTimes, faTrash} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

const FileList = ({files, onFileClick, onSaveEdit, onFileDelete}) => {
    const [editFileId, setEditFileId] = useState(null);
    const [value, setValue] = useState('');

    const closeSearch = (event) => {
        event.preventDefault();
        setEditFileId(null);
        setValue('');
    }

    const handleInputEvent = (event) => {
        const {keyCode} = event;
        const editFile = files.find(file => file.id === editFileId);
        if (keyCode === 13) {
            onSaveEdit(editFile.id, event.target.value);
            setEditFileId(editFile.id);
            closeSearch(event);
        } else if (keyCode === 27) {
            closeSearch(event);
        }
    }
    useEffect(() => {
        document.addEventListener('keyup', handleInputEvent);

        return () => {
            document.removeEventListener('keyup', handleInputEvent);
        }
    })

    useEffect(() => {
        if (editFileId != null) {
            node.current.focus();
        }
    })

    let node = useRef(null);
    return (<ul className="list-group list-group-flush file-list">
        {files.map((file) => (<li className="list-group-item row bg-light d-flex align-content-center" key={file.id}>

            {file.id !== editFileId && <>

                <span className="col-2">
                    <FontAwesomeIcon icon={faMarkdown}/>
                </span>
                <span className="col-7 c-link" onClick={() => onFileClick(file.id)}>
                            {file.title}
                </span>

                <button className="icon-button col-1" type="button"
                        onClick={() => {
                            setEditFileId(file.id);
                            setValue(file.title);
                        }}
                >
                    <FontAwesomeIcon icon={faEdit}/>
                </button>
                <button className="icon-button col-1" type="button"
                        onClick={() => onFileDelete(file.id)}>
                    <FontAwesomeIcon icon={faTrash}/>
                </button>
            </>}
            {file.id === editFileId &&
                <>
                    <input type="text" className=" col-10" value={value} ref={node}
                           onChange={(e) => setValue(e.target.value)}/>

                    <button type="button" className="icon-button col-2" onClick={closeSearch}>
                        <FontAwesomeIcon icon={faTimes} size="lg"/>
                    </button>
                </>
            }
        </li>))}
    </ul>);
}

FileList.propTypes = {
    files: PropTypes.array,
    onFileClick: PropTypes.func,
    onFileDelete: PropTypes.func,
    onSaveEdit: PropTypes.func,
}
export default FileList;