import React, { useState, useEffect } from 'react';
import MapSelector from '../components/MapSelector.jsx';
import {
  MDBTooltip,
  MDBCheckbox,
  MDBBtn,
  MDBTypography
} from 'mdb-react-ui-kit';
import './FormPage.css';

function FormPage() {
  const [markers, setMarkers] = useState([]);
  const [calculatedArea, setCalculatedArea] = useState(0);
  const [selectedParameters, setSelectedParameters] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAreaSelected = (coords) => {
    setMarkers((prevMarkers) => [...prevMarkers, coords]);
  };

  const clearMarkers = () => {
    setMarkers([]);
    setCalculatedArea(0);
  };

  // Parametrii -- placeholder momentan
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

  // Valideaza datele
  useEffect(() => {
    if (startDate && endDate) {
      if (startDate > endDate) {
        setErrorMessage('Start Date cannot be later than End Date.'); // De modificat textul
      } else {
        setErrorMessage('');
      }
    } else {
      // Fara eroare daca nu sunt completate datele
      setErrorMessage('');
    }
  }, [startDate, endDate]);

  const handleFormatChange = (event) => {
    const { value } = event.target;
    if (event.target.checked) {
      setSelectedFormat(value);
    } else {
      setSelectedFormat('');
    }
  };

  // Generate button enabled or nah
  const isGenerateDisabled = !(
    selectedParameters.length > 0 &&
    startDate &&
    endDate &&
    selectedFormat &&
    !errorMessage
  );

  return (
    <div className="form-page">
      <MDBTypography tag="h1" variant="h3" className="mb-4">
        Select Area for Analysis
      </MDBTypography>
      <div className="content-container">
        <div className="map-wrapper">
          <MapSelector
            onAreaSelected={handleAreaSelected}
            markers={markers}
            clearMarkers={clearMarkers}
            setCalculatedArea={setCalculatedArea}
            calculatedArea={calculatedArea}
          />
          {calculatedArea > 0 && (
            <div className="area-display">
              Selected Area: {calculatedArea.toFixed(2)} sq km
            </div>
          )}
        </div>
        <div className="form-wrapper">
          <MDBTypography tag="h2" variant="h4" className="text-center">
            Parameters
          </MDBTypography>
          <form>
            {/* Parametrii -- Checkboxes & Tooltips */}
            <div className="parameters">
              <div className="parameter-grid">
                {parameters.map((param, index) => (
                  <div key={index} className="parameter-item">
                    <MDBTooltip
                      tag="span"
                      title={param.description}
                      placement="top"
                    >
                      <div>
                        <MDBCheckbox
                          name={param.name}
                          id={param.name}
                          label={param.name}
                          onChange={handleParameterChange}
                        />
                      </div>
                    </MDBTooltip>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Selection */}
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

              {/* Error Message */}
              {errorMessage && (
                <div className="error-message">
                  {errorMessage}
                </div>
              )}
            </div>

            {/* Format Selection */}
            <div className="format-selection">
              <label>Output Format:</label>
              <div className="format-options">
                <div className="format-item">
                  <MDBCheckbox
                    id="pdf"
                    value="pdf"
                    label="PDF"
                    checked={selectedFormat === 'pdf'}
                    onChange={handleFormatChange}
                  />
                </div>
                <div className="format-item">
                  <MDBCheckbox
                    id="json"
                    value="json"
                    label="JSON"
                    disabled
                  />
                </div>
                <div className="format-item">
                  <MDBCheckbox
                    id="nc"
                    value="nc"
                    label="NC"
                    disabled
                  />
                </div>
                <div className="format-item">
                  <MDBCheckbox
                    id="xlsx"
                    value="xlsx"
                    label="XLSX"
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="generate-button-container">
              <MDBBtn
                type="button"
                disabled={isGenerateDisabled}
                color="success"
                block
                className={`generate-button ${isGenerateDisabled ? 'disabled-btn' : ''}`}
                onClick={() => { /* Add functionality later */ }}
              >
                Generate
              </MDBBtn>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormPage;