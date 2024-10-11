import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import FileSearch from "./componments/FileSearch";
import FileList from "./componments/FileList";
import defaultFiles from "./utils/defaultFiles";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faFileImport} from '@fortawesome/free-solid-svg-icons';
import BottomBtn from "./componments/BottomBtn";

function App() {
    return (
        <div className="App container-fluid px-0">
            <div className="row g-0">
                <div className="col-6">
                    <FileSearch title="my cloud doc" onFileSearch={(value) => console.log(value)}/>
                    <FileList files={defaultFiles}
                              onFileClick={(fileId) => console.log('clicking', fileId)}
                              onFileDelete={(fileId) => console.log('deleting ', fileId)}
                              onSaveEdit={(fileId, newValue) => console.log('save', fileId, newValue)}
                    />
                    <div className="row g-0">
                        <div className="col-6">
                            <BottomBtn text="new" colorClass="btn-primary" icon={faPlus}/>
                        </div>
                        <div className="col-6">
                            <BottomBtn text="import" colorClass="btn-success" icon={faFileImport}/>
                        </div>
                    </div>

                </div>
                <div className="col-6 bg-warning">

                </div>
            </div>
        </div>
    );
}

export default App;
