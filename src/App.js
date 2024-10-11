import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import FileSearch from "./componments/FileSearch";
function App() {
  return (
    <div className="App container-fluid">
      <div className="row">
        <div className="col-3">
          <FileSearch title="my cloud doc" onFileSearch={() => {}} />
        </div>
        <div className="col-9 bg-warning">
          <h1>this is the right</h1>
        </div>
      </div>
    </div>
  );
}

export default App;
