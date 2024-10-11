import React from 'react';
import classNames from 'classnames';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import './TabList.scss'

const TabList = ({files, activeId, unSaveIds, onTabClick, onTabClose}) => {
    var fClassName = classNames({});
    return (
        <>
            <ul className="nav nav-pills tablist-componment">
                {

                    files.filter((file) => file !== undefined).map((file) => {

                        const withUnSavedMark = unSaveIds.includes(file.id);
                        const fClassName = classNames({
                            'active': activeId === file.id,
                            'nav-link': true,
                            'withUnSaved': withUnSavedMark,
                        });


                        return (
                            <li className="nav-item" key={file.id}>
                                <a className={fClassName} href="#" onClick={(event) => {
                                    event.preventDefault();
                                    onTabClick(file.id)
                                }}>
                                    {file.title}
                                    <span className="ms-2 close-icon" onClick={(event) => {
                                        event.stopPropagation();
                                        onTabClose(file.id)
                                    }}>
                                         <FontAwesomeIcon icon={faTimes}/>
                                    </span>

                                    {
                                        withUnSavedMark && <span className="rounded-circle unsaved-icon ms-2"></span>
                                    }
                                </a>

                            </li>
                        )
                            ;
                    })
                }
            </ul>
        </>
    );
}

export default TabList;