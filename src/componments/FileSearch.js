import React, {useState} from 'react';

const FileSearch = ({title, onFileSearch}) => {
    const [inputActive, setInputActive] = useState(false);
    const [value, setValue] = useState('');

    return (
        <>
            <div className="alert alert-primary">
                {!inputActive &&
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="">{title}</span>
                        <button type="button" className="btn btn-primary" onClick={() => setInputActive(true)}>
                            search
                        </button>
                    </div>
                }
                {inputActive &&
                    <div className="row">
                        <div className="col-8">
                            <input type="text" className="form-control" value={value}
                                   onChange={(e) => setValue(e.target.value)}/>
                        </div>
                        <div className="col-4">
                            <button type="button" className="btn btn-primary"
                                    onClick={() => setInputActive(false)}>
                                close
                            </button>
                        </div>
                    </div>
                }
            </div>

        </>


    );

}

export default FileSearch;