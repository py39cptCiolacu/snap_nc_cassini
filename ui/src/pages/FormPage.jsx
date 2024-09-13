import React, { useState } from 'react';
import MapSelector from '../components/MapSelector.jsx';
import './FormPage.css';

function FormPage() {
  const [markers, setMarkers] = useState([]);
  const [selectedParameters, setSelectedParameters] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');

  const handleAreaSelected = (coords) => {
    setMarkers((prevMarkers) => [...prevMarkers, coords]);
  };

  const clearMarkers = () => {
    setMarkers([]);
  };

  // Placeholders -- de schimbat ulterior
  const parameters = [
    { name: 'placeholder1', description: 'Description for placeholder1' },
    { name: 'placeholder2', description: 'Description for placeholder2' },
    { name: 'placeholder3', description: 'Description for placeholder3' },
    { name: 'placeholder4', description: 'Description for placeholder4' },
    { name: 'placeholder5', description: 'Description for placeholder5' },
    { name: 'placeholder6', description: 'Description for placeholder6' },
    { name: 'placeholder7', description: 'Description for placeholder7' },
    { name: 'placeholder8', description: 'Description for placeholder8' },
  ];

  const handleParameterChange = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      setSelectedParameters([...selectedParameters, name]);
    } else {
      setSelectedParameters(selectedParameters.filter((param) => param !== name));
    }
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleFormatChange = (event) => {
    const { value } = event.target;
    if (event.target.checked) {
      setSelectedFormat(value);
    } else {
      setSelectedFormat('');
    }
  };

  // Generate button enabled or not
  const isGenerateDisabled = !(
    selectedParameters.length > 0 &&
    startDate &&
    endDate &&
    selectedFormat
  );

  return (
    <div className="form-page">
      <h1>Select Area for Analysis</h1>
      <div className="content-container">
        <div className="map-wrapper">
          <MapSelector
            onAreaSelected={handleAreaSelected}
            markers={markers}
            clearMarkers={clearMarkers}
          />
        </div>
        <div className="form-wrapper">
          <h2>Parameters</h2>
          <form>
            <div className="parameters">
              {parameters.map((param, index) => (
                <div key={index} className="parameter-item">
                  <input
                    type="checkbox"
                    id={param.name}
                    name={param.name}
                    onChange={handleParameterChange}
                  />
                  <label htmlFor={param.name}>
                    {param.name}
                    <span className="tooltip-text">{param.description}</span>
                  </label>
                </div>
              ))}
            </div>

            {/* Start Date -- End Date */}
            <div className="date-selection">
              <label htmlFor="startDate">Start Date:</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={startDate}
                onChange={handleStartDateChange}
              />

              <label htmlFor="endDate">End Date:</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={endDate}
                onChange={handleEndDateChange}
              />
            </div>

            {/* Format types */}
            <div className="format-selection">
              <label>Output Format:</label>
              <div className="format-options">
                <div className="format-item">
                  <input
                    type="checkbox"
                    id="pdf"
                    value="pdf"
                    checked={selectedFormat === 'pdf'}
                    onChange={handleFormatChange}
                  />
                  <label htmlFor="pdf">PDF</label>
                </div>
                <div className="format-item">
                  <input
                    type="checkbox"
                    id="json"
                    value="json"
                    disabled
                  />
                  <label htmlFor="json">JSON</label>
                </div>
                <div className="format-item">
                  <input
                    type="checkbox"
                    id="nc"
                    value="nc"
                    disabled
                  />
                  <label htmlFor="nc">NC</label>
                </div>
                <div className="format-item">
                  <input
                    type="checkbox"
                    id="xlsx"
                    value="xlsx"
                    disabled
                  />
                  <label htmlFor="xlsx">XLSX</label>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="generate-button-container">
              <button
                type="button"
                disabled={isGenerateDisabled}
                className="generate-button"
                onClick={() => { /* Add functionality later */ }}
              >
                Generate
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormPage;