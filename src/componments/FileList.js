import React, {useState, useEffect, useRef} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMarkdown} from "@fortawesome/free-brands-svg-icons";
import {faEdit, faTimes, faTrash} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import useKeyPress from "../hooks/useKeyPress.js";

const FileList = ({files, filesRef, onFileClick, onSaveEdit, onFileDelete}) => {
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

    useEffect(() => {
        // 监听右键点击事件
        const handleContextMenu = (event) => {
            event.preventDefault(); //
            let closest = event.target.closest('.file-item');
            if (!closest) return; // 如果不是 file-item，直接返回
            const itemArray = [
                {
                    label: 'open',
                    action: 'open'
                },
                {
                    label: 'rename',
                    action: 'rename'
                },
                {
                    label: 'delete',
                    action: 'delete',
                }
            ];
            window.electronAPI.showContextMenu(itemArray, closest.dataset.id); // 触发主进程显示自定义右键菜单
        };

        // 监听菜单点击命令
        window.electronAPI.onContextMenuCommand((event, command, targetFileId) => {
            if (command === 'rename') {
                console.log('MenuItem rename clicked', targetFileId);
                console.log("filesRef.current", filesRef.current);
                const editFile = filesRef.current[targetFileId];
                setEditFileId(editFile.id);
                setValue(editFile.title);
            } else if (command === 'delete') {
                console.log('MenuItem delete clicked', targetFileId);
                onFileDelete(targetFileId);
            } else if (command === 'open') {
                console.log('MenuItem open clicked', targetFileId);
                if (targetFileId) {
                    onFileClick(targetFileId);
                }
            }
        });

        // 给整个文档添加右键点击事件监听器
        document.addEventListener('contextmenu', handleContextMenu);
        // 组件卸载时清除监听器
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [])

    let node = useRef(null);
    return (<ul className="list-group list-group-flush file-list">
        {files.map((file) => (
            <li className="list-group-item row bg-light d-flex align-content-center mx-0 file-item" data-id={file.id}
                data-title={file.title} key={file.id}>

                {(file.id !== editFileId && !file.isNew) &&
                    <>
                        <span className="col-2">
                            <FontAwesomeIcon icon={faMarkdown}/>
                        </span>
                            <span className="col-6 c-link" onClick={() => onFileClick(file.id)}>
                                    {file.title}
                        </span>
                    </>
                }
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