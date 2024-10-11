import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import FileSearch from "./componments/FileSearch";

function App() {
    return (
        <div className="App container-fluid">
            <div className="row">
                <div className="col-6">
                    <FileSearch title="my cloud doc" onFileSearch={(value) => console.log(value)} />
                </div>
                <div className="col-6 bg-warning">
                    <h1>this is the right</h1>
                </div>
            </div>
        </div>
    );
}

export default App;
