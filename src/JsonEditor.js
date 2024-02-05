import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './jsoneditor.css'

const JsonEditor = ({ onUiSchemaChange }) => {
  const [jsonInput, setJsonInput] = useState('');

  const jsonErrMsg = () => {
    toast.warning("Invalid JSON !", {
    //   position: toast.POSITION,
    });
  };

  const handleJsonInputChange = (event) => {
    const newJsonInput = event.target.value;
    setJsonInput(newJsonInput);

    try {
      const parsedUiSchema = JSON.parse(newJsonInput);
      onUiSchemaChange(parsedUiSchema);
    } catch (error) {
      console.error('Invalid JSON input');
      jsonErrMsg('Invalid JSON input')
    }
  };

  return (
    <div className="json-editor">
      <h3 className='json_title'>Input JSON Data</h3>
      <textarea style={{width: '436px',
    height: '595px'}}
        value={jsonInput}
        onChange={handleJsonInputChange}
        placeholder="Paste UI Schema JSON here"
      />
      <ToastContainer />
    </div>
  );
};

export default JsonEditor;

