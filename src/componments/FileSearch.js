import React, {useState, useEffect, useRef} from 'react';

const FileSearch = ({title, onFileSearch}) => {
    const [inputActive, setInputActive] = useState(false);
    const [value, setValue] = useState('');

    const closeSearch = (event) => {
        event.preventDefault();
        setInputActive(false);
        setValue('');
    }

    let node = useRef(null);

    useEffect(() => {
        const handleInputEvent = (event) => {
            const {keyCode} = event;
            //Enter
            if (keyCode === 13 && inputActive) {
                onFileSearch(value);
            } else if (keyCode === 27 && inputActive) {//esc
                closeSearch(event);
            }
        }
        document.addEventListener('keyup', handleInputEvent);
        return () => {
            document.removeEventListener('keyup', handleInputEvent);
        }
    })

    //input 自动获取光标
    useEffect(() => {
        if (inputActive) {
            node.current.focus();
        }
    }, [inputActive])
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
                            <input type="text" className="form-control" value={value} ref={node}
                                   onChange={(e) => setValue(e.target.value)}/>
                        </div>
                        <div className="col-4">
                            <button type="button" className="btn btn-primary"
                                    onClick={closeSearch}>
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