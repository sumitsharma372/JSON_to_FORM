import React, { useState, useEffect } from 'react';
// import { Switch } from '@headlessui/react'
import { Switch } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
// import { Tooltip } from 'react-tooltip'
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import './formpreview.css'; // Import your CSS file for styling

const FormPreview = ({ uiSchema }) => {
  const [selectedTab, setSelectedTab] = useState('');
  const immutables = uiSchema ? uiSchema.filter(obj => obj.validate && obj.validate.immutable === true) : [];
  const non_immutables = uiSchema ? uiSchema.filter(obj => obj.validate && obj.validate.immutable === false): [];
  // console.log(immutables)

  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [formData, setFormData] = useState({})

  const handleToggle = () => {
    setShowAdditionalFields(!showAdditionalFields);
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    // console.log(selectedTab)
  };

  const handleInputChange = (jsonKey, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [jsonKey]: value,
    }));
  };

  const handleSubmit = () => {
    console.log(formData)
    alert(JSON.stringify(formData, null, 2));
  }

  useEffect(() => {
    // Set the selectedTab based on the default value of a radio button
    const radioDefaultValue = uiSchema.find(
      (element) => element.uiType === 'Radio'
    )?.validate.defaultValue;
  
    if (radioDefaultValue) {
      setSelectedTab(radioDefaultValue);
    }

    
  }, [uiSchema]);

  const renderFormElements = (schema, parentConditions = []) => {
    if (!schema) return null;   
    return schema.map((element, index) => {
      const fullJsonKey = parentConditions.length
        ? `${parentConditions.join('.')} . ${element.jsonKey}`
        : element.jsonKey;

      switch (element.uiType) {
        case 'Input':
          // {formData[fullJsonKey] = ''}
          return (
            <div key={index} className="form-element input">
              <div style={{display:'flex', alignItems: 'center'}}>
              <label htmlFor={fullJsonKey}>{element.label}</label>
              {element.description && 
                <Tooltip title={element.description} fontSize="small">
                    <IconButton>
                      <InfoIcon />
                    </IconButton>
                </Tooltip>
              }
              </div>
              <input
                type="text"
                value={formData[fullJsonKey] || ''}
                onChange={(e) => handleInputChange(fullJsonKey, e.target.value)}
                name = {element.jsonKey}
                id={fullJsonKey}
                placeholder={element.placeholder}
                required
              />
            </div>
          );
        case 'Group':
          parentConditions.push(element.jsonKey)
          return (
            <div key={index} className="form-group">
              <div style={{display:'flex', alignItems: 'center'}}>
              <h4 style={{marginLeft: '9px', fontWeight:500, padding: 0, margin: 0, fontSize: '1.1rem'}}>{element.label}</h4>
              {element.description && 
                <Tooltip title={element.description} sx={{ fontSize: '5px' }} 
                >
                    <IconButton>
                      <InfoIcon />
                    </IconButton>
                </Tooltip>
              }
              </div>
              {renderFormElements(element.subParameters, [
                ...parentConditions,
                element.jsonKey,
              ])}
            </div>
          );
        case 'Select':
          return (
            <div key={index} className="form-element select">
              <div style={{display:'flex', alignItems: 'center'}}>
              <label htmlFor={fullJsonKey}>{element.label}</label>
              {element.description && 
                <Tooltip title={element.description} fontSize="small">
                    <IconButton>
                      <InfoIcon />
                    </IconButton>
                </Tooltip>
              }
              </div>
              {/* {
                setFormData((prevData) => ({
                  ...prevData,
                  [fullJsonKey]: element.validate.defaultValue
                }))
              } */}
              <select 
                id={fullJsonKey} 
                defaultValue={element.validate.defaultValue}
                value={formData[fullJsonKey] || ''}
                onChange={(e) => handleInputChange(fullJsonKey, e.target.value)}
              >
                {element.validate.options.map((option, optionIndex) => (
                  <option key={optionIndex} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          );
        
        case 'Radio':
                  // {setSelectedTab(element.validate.defaultValue)}
            return (
                <div key={index} className="form-element radio">
                  <div style={{display:'flex', alignItems: 'center'}}>
                  <label>{element.label}</label>
                  {element.description && 
                <Tooltip title={element.description} fontSize="small">
                    <IconButton>
                      <InfoIcon />
                    </IconButton>
                </Tooltip>

              }
              </div>
                  <div className="radio-options">
                    {element.validate.options.map((option, optionIndex) => (
                      <div key={optionIndex} className={`radio-option ${selectedTab === option.value ? 'active': ''}`} style={{display:'flex'}}>
                        <input
                          type="radio"
                          id={`${element.jsonKey}_${option.value}`}
                          name={element.jsonKey}
                          value={option.value}
                          checked={selectedTab === option.value}
                          onChange={() => handleTabChange(option.value)}
                        />
                        <label htmlFor={`${element.jsonKey}_${option.value}`} style={{cursor:'pointer'}}>
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              );
            
            case 'Ignore':
                // console.log(selectedTab)
                const condition = element.conditions[0]
                const conditionMet = condition.op === '==' && condition.value === selectedTab;
                // console.log(conditionMet)
                if (conditionMet) {
                    return(
                        <div>
                            {renderFormElements(element.subParameters, [
                                ...parentConditions,
                                element.jsonKey,
                            ])}
                        </div>
                    )
                }else {
                    return null;
                }
            
        default:
          return null;
      }
    });
  };

  return (
    <div className="form-preview">
      <h3 className='pizza_title'>New Pizza</h3>

      {renderFormElements(non_immutables)}

      {immutables.length !== 0 && 
        <div>
            {showAdditionalFields && <div>
                {renderFormElements(immutables)}
                </div>}
            <div className='show_additional'>
                {showAdditionalFields ? <h5>Hide Additional Fields</h5> : <h5>Show Additional Fields</h5>}
                <Switch
                    checked={showAdditionalFields}
                    onChange={handleToggle}
                    className={`${
                        showAdditionalFields ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                />
                
            </div>
        </div>
    }
    

    {uiSchema && <div className='submit'>
      <button className='cancel_btn'>
        Cancel
      </button>
    <button className='submit_btn' onClick={handleSubmit}>
        Submit
      </button>
    </div>}
    </div>
  );
};

export default FormPreview;
