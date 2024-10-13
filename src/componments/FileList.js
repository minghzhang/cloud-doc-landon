import React, {useState, useEffect, useRef} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMarkdown} from "@fortawesome/free-brands-svg-icons";
import {faEdit, faTimes, faTrash} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import useKeyPress from "../hooks/useKeyPress.js";

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

    useEffect(() => {
        // 监听右键点击事件
        const handleContextMenu = (event) => {
            event.preventDefault(); //

            /**
             * 1.	event.target：
             *    •	event 是 contextmenu 事件（即用户右键点击时触发的事件）的对象。
             *    •	event.target 指的是触发事件的元素，即用户右键点击的那个具体 HTML 元素。
             *    2.	closest()：
             *    •	closest() 是 JavaScript 的 DOM 方法，它从当前元素（event.target）开始，沿着 DOM 树向上查找，直到找到匹配给定选择器的第一个祖先元素（包括自身）。
             *    •	换句话说，closest('.file-item') 会检查 event.target 元素自身是否带有 .file-item 类名。如果没有，它会向上寻找其父元素，直到找到带有 .file-item 类名的元素，或者返回 null（如果找不到）。
             *    3.	.file-item：
             *    •	.file-item 是一个类选择器，表示 HTML 元素的 class 属性中包含 file-item 类名。
             *    •	这个类名通常用于标识页面中的某种特定元素，像文件列表中的文件项。
             *
             *    整体作用：
             *
             *    •	这段代码是为了确保用户点击的元素或者其父元素是一个 .file-item。
             *    •	如果用户右键点击了 .file-item 或其内部的某个子元素，closest('.file-item') 会返回这个 .file-item 元素。
             *    •	如果用户右键点击的不是 .file-item 或其内部元素，则返回 null，表示点击位置不在指定的区域内。
             *
             * 使用场景：
             *
             * 在右键菜单的实现中，使用 closest() 可以确保菜单只在特定区域（如 .file-item）被右键点击时触发。例如：
             *
             *    •	如果用户在文件列表中的一个文件项（file-item）上点击右键，菜单会弹出。
             *    •	如果用户在文件列表外的其他地方点击右键，菜单不会弹出，因为 closest('.file-item') 返回 null。
             *
             * 这种机制可以确保右键菜单只在需要的区域内生效，避免不必要的触发。
             */
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
        window.electronAPI.onContextMenuCommand((event, command, targetItemId) => {
            if (command === 'rename') {
                console.log('MenuItem rename clicked', targetItemId);
            } else if (command === 'delete') {
                console.log('MenuItem delete clicked', targetItemId);
            } else if (command === 'open') {
                console.log('MenuItem open clicked', targetItemId);
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