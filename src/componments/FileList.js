import React, {useState, useEffect, useRef} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMarkdown} from "@fortawesome/free-brands-svg-icons";
import {faEdit, faTimes, faTrash} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import useKeyPress from "../hooks/useKeyPress";

const FileList = ({files, onFileClick, onSaveEdit, onFileDelete}) => {
    const [editFileId, setEditFileId] = useState(null);
    const [value, setValue] = useState('');

    const closeSearch = () => {
        setEditFileId(null);
        setValue('');
    }

    const enterKeyPressed = useKeyPress(13);
    const escKeyPressed = useKeyPress(27);
    useEffect(() => {
        const editFile = files.find(file => file.id === editFileId);
        if (enterKeyPressed && editFile) {
            onSaveEdit(editFile.id, value);
            setEditFileId(editFile.id);

            closeSearch();
        } else if (escKeyPressed && editFile) {
            closeSearch();
        }
    })

    useEffect(() => {
        if (editFileId != null) {
            node.current.focus();
        }
    })

    let node = useRef(null);
    return (<ul className="list-group list-group-flush file-list">
        {files.map((file) => (<li className="list-group-item row bg-light d-flex align-content-center mx-0" key={file.id}>

            {file.id !== editFileId && <>

                <span className="col-2">
                    <FontAwesomeIcon icon={faMarkdown}/>
                </span>
                <span className="col-6 c-link" onClick={() => onFileClick(file.id)}>
                            {file.title}
                </span>

                <button className="icon-button col-2" type="button"
                        onClick={() => {
                            setEditFileId(file.id);
                            setValue(file.title);
                        }}
                >
                    <FontAwesomeIcon icon={faEdit}/>
                </button>
                <button className="icon-button col-2" type="button"
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