import React, {useState, useEffect, useRef} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMarkdown} from "@fortawesome/free-brands-svg-icons";
import {faEdit, faTrash} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

const FileList = ({files, onFileClick, onSaveEdit, onFileDelete}) => {

    return (
        <ul className="list-group list-group-flush file-list">
            {
                files.map((file) => (
                    <li className="list-group-item row bg-light d-flex align-content-center" key={file.id}>
                        <span className="col-2">
                            <FontAwesomeIcon icon={faMarkdown}/>
                        </span>
                        <span className="col-7">
                            {file.title}
                        </span>

                        <button className="icon-button col-1" type="button" onClick={() => {
                        }}>
                            <FontAwesomeIcon icon={faEdit}/>
                        </button>
                        <button className="icon-button col-1" type="button" onClick={() => {
                        }}>
                            <FontAwesomeIcon icon={faTrash}/>
                        </button>
                    </li>))
            }
        </ul>
    );
}

FileList.propTypes = {
    files: PropTypes.array,
}
export default FileList;