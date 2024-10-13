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

    async function fetchAppPath(name) {
        return await window.electronAPI.getSavedLocation(name);
    }

    //readFile("hello.md")
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

    const fileDelete = async (fileId) => {
        let path = await getFullFilePath(`${files[fileId].title}`);
        window.electronAPI.deleteFile(path).then(() => {
            delete files[fileId];
            setFiles(files)
            //close the tab
            tabClose(fileId);
        })
    }

    const fileNameChange = async (fileId, newTitle, isNew) => {
        const modifiedFile = {...files[fileId], 'title': newTitle, isNew: false};
        if (isNew) {
            let path = await getFullFilePath(`${newTitle}`);
            console.log(`path`, path);
            await window.electronAPI.writeFile(path, files[fileId].body);

        } else {
            let oldPath = await getFullFilePath(`${files[fileId].title}`);
            let newPath = await getFullFilePath(`${newTitle}`);
            console.log("oldPath", oldPath);
            console.log("newPath", newPath);
            await window.electronAPI.renameFile(oldPath, newPath);
        }
        setFiles({...files, [fileId]: modifiedFile});
    }

    const fileSearch = (keywords) => {
        let newFiles = filesArr.filter(file => file.title.includes(keywords));
        setSearchFiles(newFiles);
    }

    const createNewFile = async () => {
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

    const getFullFilePath = async (name) => {
        let path = await fetchAppPath("documents");
        path += `/${name}.md`;
        return path;
    }

    const saveCurrentActiveFile = async () => {
        let path = await getFullFilePath(`${activeFile.title}`);
        window.electronAPI.writeFile(path, `${activeFile.body}`).then(() => {
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
