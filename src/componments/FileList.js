import React, {useState, useEffect, useRef} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMarkdown} from "@fortawesome/free-brands-svg-icons";
import {faEdit, faTimes, faTrash} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import useKeyPress from "../hooks/useKeyPress";

const FileList = ({files, onFileClick, onSaveEdit, onFileDelete}) => {
    const [editFileId, setEditFileId] = useState(null);
    const [value, setValue] = useState('');

    const closeSearch = (editFile) => {
        setEditFileId(null);
        setValue('');
        if (editFile.isNew) {
            onFileDelete(editFile.id);
        }
    }

    const enterKeyPressed = useKeyPress(13);
    const escKeyPressed = useKeyPress(27);
    useEffect(() => {
        const editFile = files.find(file => file.id === editFileId);
        if (enterKeyPressed && editFile && value.trim().length > 0) {
            onSaveEdit(editFile.id, value, editFile.isNew);
            setEditFileId(null);
            setValue('')
        } else if (escKeyPressed && editFile) {
            closeSearch(editFile);
        }
    })

    useEffect(() => {
        if (editFileId != null) {
            node.current.focus();
        }
    })

    useEffect(() => {
        const newFile = files.find(file => file.isNew);
        if (newFile) {
            console.log(newFile)
            setEditFileId(newFile.id);
            setValue(newFile.title);
        }
    }, [files])

    let node = useRef(null);
    return (<ul className="list-group list-group-flush file-list">
        {files.map((file) => (
            <li className="list-group-item row bg-light d-flex align-content-center mx-0" key={file.id}>

                {(file.id !== editFileId && !file.isNew) && <>

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
                {(file.id === editFileId || file.isNew) &&
                    <>
                        <input type="text" className=" col-10" value={value} ref={node}
                               placeholder="please input file name"
                               onChange={(e) => setValue(e.target.value)}/>

                        <button type="button" className="icon-button col-2" onClick={() => closeSearch(file)}>
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