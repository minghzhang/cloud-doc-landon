import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import FileSearch from "./componments/FileSearch";
import FileList from "./componments/FileList";
import defaultFiles from "./utils/defaultFiles";

function App() {
    return (
        <div className="App container-fluid">
            <div className="row">
                <div className="col-6">
                    <FileSearch title="my cloud doc" onFileSearch={(value) => console.log(value)}/>
                    <FileList files={defaultFiles}
                              onFileClick={(fileId) => console.log('clicking', fileId)}
                              onFileDelete={(fileId) => console.log('deleting ', fileId)}
                              onSaveEdit={(fileId, newValue) => console.log('save', fileId, newValue)}
                    />
                </div>
                <div className="col-6 bg-warning">

                </div>
            </div>
        </div>
    );
}

export default App;
