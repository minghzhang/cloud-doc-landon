import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import FileSearch from "./componments/FileSearch.js";
import FileList from "./componments/FileList.js";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faFileImport, faSave} from '@fortawesome/free-solid-svg-icons';
import BottomBtn from "./componments/BottomBtn.js";
import TabList from "./componments/TabList.js";
import {useState, useEffect} from "react";
import {v4 as uuidv4} from 'uuid';
import {flattenArr, objToArray} from "./utils/helper.js";
import {getBaseName, getDirName, joinPaths} from "./utils/pathHelper.js";

const saveFilesToStore = (files) => {
    const fileStoreObj = objToArray(files).reduce((result, file) => {
        const {id, path, title, createdAt} = file;
        result[id] = {
            id,
            path,
            title,
            createdAt,
        };
        return result;
    }, {});
    window.electronAPI.saveStoreKV("files", fileStoreObj).then(() => {
        console.log("saveStoreKV success.");
    })
}

const getInitialFiles = async () => {
    return await window.electronAPI.getStoreValue("files");
}

function App() {

    const [files, setFiles] = useState({});
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

    const fetchInitialFiles = async () => {
        const initialFiles = await getInitialFiles();
        if (initialFiles) {
            console.log(`fetchInitialFiles`, initialFiles);
            setFiles(initialFiles);
        } else {
            setFiles({});
        }
    };
    // 使用 useEffect 来处理异步调用
    useEffect(() => {
        fetchInitialFiles();
    }, []);  // 空依赖数组确保这个只在组件挂载时运行一次


    console.log("loadedFiles",files);

    async function fetchAppPath(name) {
        return await window.electronAPI.getSavedLocation(name);
    }

    const fileClick = (fileId) => {
        setActiveFileId(fileId);
        console.log("files", files);
        const currentFile = files[fileId];
        console.log(currentFile);
        if (currentFile.isLoaded === undefined || !currentFile.isLoaded) {
            window.electronAPI.readFile(currentFile.path).then(data => {
                const newFile = {...currentFile, body: data, isLoaded: true};
                setFiles({...files, [fileId]: newFile});

            }).catch(error => {
                if (error.message.includes('ENOENT')) {
                    console.error(`File not found: ${currentFile.path}`);
                    const {[fileId]: value, ...filesAfterDelete} = files;
                    saveFilesToStore(filesAfterDelete);
                    setFiles(filesAfterDelete);
                    tabClose(fileId);
                } else {
                    console.error(`An error occurred:`, error);
                }
            })
        }
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
        const {[fileId]: value, ...afterDelete} = files;
        if (files[fileId].isNew) {
            setFiles(afterDelete)
        } else {
            let path = files[fileId].path;
            window.electronAPI.deleteFile(path).then(() => {
                setFiles(afterDelete)
                saveFilesToStore(afterDelete);
                //close the tab
                tabClose(fileId);
            })
        }
    }

    const fileNameChange = async (fileId, newTitle, isNew) => {
        let newPath = isNew ? await getFullFilePath(`${newTitle}`) : joinPaths(getDirName(files[fileId].path), `${newTitle}.md`);
        const modifiedFile = {...files[fileId], 'title': newTitle, 'path': newPath, isNew: false};
        const newFiles = {...files, [fileId]: modifiedFile};
        if (isNew) {
            await window.electronAPI.writeFile(newPath, files[fileId].body).then(() => {
                setFiles(newFiles);
                saveFilesToStore(newFiles);
            })

        } else {
            let oldPath = files[fileId].path;
            await window.electronAPI.renameFile(oldPath, newPath).then(() => {
                setFiles(newFiles);
                saveFilesToStore(newFiles);
            })
        }

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
        let path = files[activeFileId].path;
        window.electronAPI.writeFile(path, `${activeFile.body}`).then(() => {
            setUnSavedFileIds(unSavedFileIds.filter(id => id !== activeFileId));
        })
    }

    const importFiles = async () => {
        await window.electronAPI.openDialog().then((resp) => {
            if (resp.filePaths.length > 0) {
                console.log("chosen paths: ", resp.filePaths);

                const filterPaths = resp.filePaths.filter(path => {
                    const fileAdded = Object.values(files).find(file => file.path === path);
                    return !fileAdded;
                })

                const waitingImportFiles = filterPaths.map(path => {
                    const newFile = {
                        id: uuidv4(),
                        path: path,
                        title: getBaseName(path, '.md'),
                        createdAt: new Date().getTime(),
                    }
                    return newFile;
                });

                const newFiles = {...files, ...flattenArr(waitingImportFiles)}
                setFiles(newFiles);
                saveFilesToStore(newFiles);
                if (waitingImportFiles.length > 0) {
                    window.electronAPI.showMessageBox('info', `${waitingImportFiles.length} files are imported successfully.`, `${waitingImportFiles.length} files are imported successfully.`);
                }
                console.log(`waitingImportFiles`, waitingImportFiles);

            }

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
                            <BottomBtn text="import" colorClass="btn-success" icon={faFileImport}
                                       onBtnClick={importFiles}/>
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
