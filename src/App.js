// import logo from './logo.svg';
import { useState } from 'react';
import JsonEditor from './JsonEditor';
import FormPreview from './FormPreview';
import './App.css';

function App() {
  const [uiSchema, setUiSchema] = useState([]);

  const handleUiSchemaChange = (newUiSchema) => {
    setUiSchema(newUiSchema);
  };

  return (
    <div className="app-container">
      <JsonEditor onUiSchemaChange={handleUiSchemaChange}/>

      <FormPreview uiSchema={uiSchema} />
    </div>
  );
}

export default App;
