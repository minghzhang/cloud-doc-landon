import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import FileSearch from "./componments/FileSearch";
import FileList from "./componments/FileList";
import defaultFiles from "./utils/defaultFiles";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faFileImport, faSave} from '@fortawesome/free-solid-svg-icons';
import BottomBtn from "./componments/BottomBtn";
import TabList from "./componments/TabList";
import {useState} from "react";
import {v4 as uuidv4} from 'uuid';
import {flattenArr, objToArray} from "./utils/helper";
import fileHelper from "./utils/fileHelper";

const {join} = window.require("path");
const {app} = window.require("@electron/remote");

function App() {
    const [files, setFiles] = useState(flattenArr(defaultFiles));
    const [activeFileId, setActiveFileId] = useState('');
    const [openedFileIds, setOpenedFileIds] = useState([]);
    const [unSavedFileIds, setUnSavedFileIds] = useState([]);
    const [searchFiles, setSearchFiles] = useState([]);
    const openedFiles = openedFileIds.map(fileId => {
        return files[fileId];
    })
    const filesArr = objToArray(files);
    const fileListArr = searchFiles.length > 0 ? searchFiles : filesArr;
    const activeFile = activeFileId && files[activeFileId];

    const savedLocation = app.getPath("documents");
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
        const newFile = {...files[fileId], body: value};
        setFiles({...files, [fileId]: newFile});

        if (!unSavedFileIds.includes(fileId)) {
            setUnSavedFileIds([...unSavedFileIds, fileId]);
        }
    }

    const fileDelete = (fileId) => {
        fileHelper.deleteFile(join(savedLocation, `${files[fileId].title}.md`)).then(() => {
            delete files[fileId];
            setFiles(files)
            //close the tab
            tabClose(fileId);
        });

    }

    const fileNameChange = (fileId, newTitle, isNew) => {
        const modifiedFile = {...files[fileId], 'title': newTitle, isNew: false};
        if (isNew) {
            fileHelper.writeFile(join(savedLocation, `${newTitle}.md`), files[fileId].body).then(
                () => {
                    setFiles({...files, [fileId]: modifiedFile});
                }
            )
        } else {
            fileHelper.renameFile(join(savedLocation, `${files[fileId].title}.md`),
                join(savedLocation, `${newTitle}.md`)).then(
                () => {
                    setFiles({...files, [fileId]: modifiedFile});
                }
            );
        }

        console.log(modifiedFile);
        setFiles({...files, [fileId]: modifiedFile});
    }

    const fileSearch = (keywords) => {
        let newFiles = filesArr.filter(file => file.title.includes(keywords));
        setSearchFiles(newFiles);
    }

    const createNewFile = () => {
        const newId = uuidv4();
        const newFile = {
            id: newId,
            title: '',
            body: '## please add Markdown content',
            createdAt: new Date().getTime(),
            isNew: true,
        }
        setFiles({...files, [newId]: newFile});
    }

    const saveCurrentActiveFile = () => {
        fileHelper.writeFile(join(savedLocation, `${activeFile.title}.md`), activeFile.body).then(() => {
            setUnSavedFileIds(unSavedFileIds.filter(id => id !== activeFileId));
        })
    }


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
                            <BottomBtn text="new" colorClass="btn-primary" icon={faPlus} onBtnClick={createNewFile}/>
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

                            <BottomBtn text="Save" onBtnClick={saveCurrentActiveFile} colorClass="btn-success"
                                       icon={faSave}/>
                        </>
                    }

                </div>
            </div>
        </div>
    );
}

export default App;
