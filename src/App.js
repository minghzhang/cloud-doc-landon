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

    const openedFiles = openedFileIds.map(fileId => {
        files.find(file => file.id === fileId);
    })

    const activeFile = files.find(file => file.id === activeFileId);

    return (
        <div className="App container-fluid px-0">
            <div className="row g-0">
                <div className="col-3 left-panel">
                    <FileSearch title="my cloud doc" onFileSearch={(value) => console.log(value)}/>
                    <FileList files={files}
                              onFileClick={(fileId) => console.log('clicking', fileId)}
                              onFileDelete={(fileId) => console.log('deleting ', fileId)}
                              onSaveEdit={(fileId, newValue) => console.log('save', fileId, newValue)}
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
                                     onTabClick={(fileId) => console.log(fileId)}
                                     onTabClose={(fileId) => console.log('tab closed', fileId)}
                            />

                            <SimpleMDE
                                value={activeFile && activeFile.body}
                                onChange={(value) => console.log(value)}
                                options={{
                                    minHeight: '515px'
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
