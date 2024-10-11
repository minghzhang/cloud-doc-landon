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

                    files.map((file,) => {
                        const fClassName = classNames({
                            'active': activeId === file.id,
                            'nav-link': true,
                        });

                        return (
                            <li className="nav-item" key={file.id}>
                                <a className={fClassName} href="#" onClick={(event) => {
                                    event.preventDefault();
                                    onTabClick(file.id)
                                }}>
                                    {file.title}
                                    <span className="ms-2">
                                         <FontAwesomeIcon icon={faTimes}/>
                                    </span>

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