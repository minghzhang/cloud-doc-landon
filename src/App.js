import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import FileSearch from "./componments/FileSearch";
import FileList from "./componments/FileList";
import defaultFiles from "./utils/defaultFiles";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faFileImport} from '@fortawesome/free-solid-svg-icons';
import BottomBtn from "./componments/BottomBtn";
import TabList from "./componments/TabList";
import {useState} from "react";

function App() {
    const [files, setFiles] = useState(defaultFiles);
    const [activeFileId, setActiveFileId] = useState('');
    const [openedFileIds, setOpenedFileIds] = useState([]);
    const [unSavedFileIds, setUnSavedFileIds] = useState([]);
    const [searchFiles, setSearchFiles] = useState([]);
    const openedFiles = openedFileIds.map(fileId => {
        return files.find(file => file.id === fileId);
    })


    const activeFile = activeFileId && files.find(file => file.id === activeFileId);

    const fileClick = (fileId) => {
        setActiveFileId(fileId);
        if (!openedFileIds.includes(fileId)) {
            setOpenedFileIds([...openedFileIds, fileId]);
        }
    }

    const tabClick = (fileId) => {
        setActiveFileId(fileId);
    }

    const tabClose = (fileId) => {
        const otherOpenedFileIds = openedFileIds.filter(id => id !== fileId);
        setOpenedFileIds(otherOpenedFileIds);
        if (otherOpenedFileIds.length > 0) {
            setActiveFileId(otherOpenedFileIds[0]);
        } else {
            setActiveFileId('')
        }
    }

    const fileChange = (fileId, value) => {
        let newFiles = files.map(file => {
            if (file.id === fileId) {
                file.body = value;
            }
            return file;
        });
        setFiles(newFiles)

    }

    const fileDelete = (fileId) => {
        const newFiles = files.filter(file => file.id !== fileId);
        setFiles(newFiles)
        //close the tab
        tabClose(fileId);
    }

    const fileNameChange = (fileId, newTitle) => {
        const newFiles = files.map(file => {
            if (file.id === fileId) {
                file.title = newTitle;
            }
            return file;
        });
        setFiles(newFiles);
    }

    const fileSearch = (keywords) => {
        let newFiles = files.filter(file => file.title.includes(keywords));
        setSearchFiles(newFiles);
    }

    const fileListArr = searchFiles.length > 0 ? searchFiles : files;

    return (
        <div className="App container-fluid px-0">
            <div className="row g-0">
                <div className="col-3 left-panel">
                    <FileSearch title="my cloud doc" onFileSearch={fileSearch}/>
                    <FileList files={fileListArr}
                              onFileClick={fileClick}
                              onFileDelete={fileDelete}
                              onSaveEdit={fileNameChange}
                    />
                    <div className="row g-0 button-group">
                        <div className="col-6">
                            <BottomBtn text="new" colorClass="btn-primary" icon={faPlus}/>
                        </div>
                        <div className="col-6">
                            <BottomBtn text="import" colorClass="btn-success" icon={faFileImport}/>
                        </div>
                    </div>

                </div>
                <div className="col-9">
                    {
                        (!openedFileIds || openedFileIds.length === 0) &&
                        <div className="start-page">
                            请打开或者创建文档
                        </div>
                    }
                    {
                        openedFileIds.length > 0 &&
                        <>
                            <TabList files={openedFiles}
                                     activeId={activeFileId}
                                     unSaveIds={unSavedFileIds}
                                     onTabClick={tabClick}
                                     onTabClose={tabClose}
                            />

                            <SimpleMDE
                                value={activeFile && activeFile.body}
                                onChange={(value) => fileChange(activeFile.id, value)}
                                options={{
                                    minHeight: '515px',
                                    autofocus: true

                                }}
                            />
                        </>
                    }

                </div>
            </div>
        </div>
    );
}

export default App;
