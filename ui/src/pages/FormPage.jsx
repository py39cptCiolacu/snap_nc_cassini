import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapSelector from '../components/MapSelector.jsx';
import {
  MDBTooltip,
  MDBCheckbox,
  MDBBtn,
  MDBTypography,
  MDBIcon
} from 'mdb-react-ui-kit';
import './FormPage.css';

function FormPage() {
  const [markers, setMarkers] = useState([]);
  const [calculatedArea, setCalculatedArea] = useState(0);
  const [currentForm, setCurrentForm] = useState(0); // 0 primul, 1 al doilea
  const [selectedParameters, setSelectedParameters] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [areaErrorMessage, setAreaErrorMessage] = useState('');

  const MAX_AREA = 10000;

  const [selectedAreaCorners, setSelectedAreaCorners] = useState([]);

  const handleAreaSelected = (corners) => {
    setSelectedAreaCorners(corners);
  };

  const handleGenerate = async () => {
    try {
      // Prepare the date in 'YYYYMM' format
      const date = startDate.replace('-', '');
  
      // Ensure that the selected area has been defined
      if (selectedAreaCorners.length !== 4) {
        alert('Please select an area on the map.');
        return;
      }

      // Extract corner coordinates
      const topRight = selectedAreaCorners[2];  // NorthEast
      const topLeft = selectedAreaCorners[1];   // NorthWest
      const bottomRight = selectedAreaCorners[3]; // SouthEast
      const bottomLeft = selectedAreaCorners[0];  // SouthWest

      // Display a pop-up to notify the user
      alert('Your download is being processed. Please wait.');

      // Send GET request to the backend
      const response = await axios.get('/api/get_user_interest', {
        params: {
        date: date,
        trLat: topRight.lat,
        trLng: topRight.lng,
        tlLat: topLeft.lat,
        tlLng: topLeft.lng,
        brLat: bottomRight.lat,
        brLng: bottomRight.lng,
        blLat: bottomLeft.lat,
        blLng: bottomLeft.lng,
        },
        responseType: 'blob'
      });
      // Handle the response (PDF file)
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Report_${date}.pdf`); // Set the filename
        document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('An error occurred while generating the report. Please try again.');
  }
};

  const clearMarkers = () => {
    setMarkers([]);
    setCalculatedArea(0);
    setAreaErrorMessage(''); // Clears area error message
  };

  // Formularele -- titluri si parametri
  const forms = [
    {
      header: 'Agriculture',
      parameters: [
        { name: '2m Temperature', description: 'Air temperature at 2 meters above the ground.'},
        { name: '2m Dewpoint Temperature', description: 'Temperature where air becomes saturated with moisture.'},
        { name: 'Volumetric Soil Water', description: 'Soil moisture content in the uppermost soil layer.'},
        { name: 'Surface Pressure', description: 'Atmospheric pressure at the surface level.'},
        { name: 'Evaporation', description: 'Water loss through evaporation from soil and plants.'},
        { name: 'Soil Temperature', description: 'Temperature of the upper soil layer.'}
      ],
      available: true,
    },
    {
      header: 'Urban',
      parameters: [
        { name: 'Air Quality Index', description: 'Measurement of air pollution levels, indicating how clean or polluted the air is, and what associated health effects might be a concern.'},
        { name: 'Noise Pollution Levels', description: 'Assessment of noise levels in urban areas, which can impact human health and quality of life.'},
        { name: 'Traffic Congestion Index', description: 'Indicator of the level of traffic congestion, reflecting the efficiency of transportation networks and potential delays.'},
        { name: 'Urban Heat Island Effect', description: 'Measurement of temperature differences between urban areas and their rural surroundings, caused by human activities and infrastructure.'},
        { name: 'Green Space Coverage', description: 'Percentage of urban areas covered by parks, gardens, and other vegetated land.'},
        { name: 'Building Density', description: 'Evaluation of the number of buildings or floor area per unit of land area, affecting urban planning and infrastructure development.'}
      ],
      available: false,
    }
  ];

  const currentParameters = forms[currentForm].parameters;
  const currentHeader = forms[currentForm].header;
  const isFormAvailable = forms[currentForm].available;

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

  const handleFormatChange = (event) => {
    const { value } = event.target;
    if (event.target.checked) {
      setSelectedFormat(value);
    } else {
      setSelectedFormat('');
    }
  };

  useEffect(() => {
    if (calculatedArea > 0) {
      if (calculatedArea > MAX_AREA) {
        setAreaErrorMessage('The selected area is too large! Please select a smaller area.');
      } else {
        setAreaErrorMessage('');
      }
    } else {
      setAreaErrorMessage('');
    }
  }, [calculatedArea]);

  // Generate button enabled or nah
  const isGenerateDisabled = !(
    isFormAvailable &&
    selectedParameters.length > 0 &&
    startDate &&
    selectedFormat &&
    calculatedArea > 0 && // Area selected
    !errorMessage && // No errors
    !areaErrorMessage // Area size < Threshold
  );

  // Navigare intre formulare
  const handlePrevForm = () => {
    const prevForm = currentForm === 0 ? forms.length - 1 : currentForm - 1;
    setCurrentForm(prevForm);
    resetFormFields();
  };

  const handleNextForm = () => {
    const nextForm = currentForm === forms.length - 1 ? 0 : currentForm + 1;
    setCurrentForm(nextForm);
    resetFormFields();
  };

  const resetFormFields = () => {
    setSelectedParameters([]);
    setStartDate('');
    setSelectedFormat('');
    setAreaErrorMessage('');
  }

  return (
    <div className="form-page">
      <MDBTypography tag="h1" variant="h3" className="mb-4">
        Select Area for Analysis
      </MDBTypography>
      <div className="content-container">
        <div className="map-wrapper">
          <MapSelector
            onAreaSelected={handleAreaSelected}
            clearMarkers={clearMarkers}
            setCalculatedArea={setCalculatedArea}
            calculatedArea={calculatedArea}
          />
        </div>
        <div className="form-wrapper">
          {/* Form Navigation Arrows */}
          <div className="form-navigation">
            <MDBTooltip tag="span" title="Previous">
              <span onClick={handlePrevForm} className="navigation-arrow">
              <MDBIcon fas icon="angle-left" size="2x" />
              </span>
            </MDBTooltip>
             <MDBTooltip
              tag="span"
              title={!isFormAvailable ? 'Feature Temporary Unavailable' : ''}
              >
              <MDBTypography
                tag="h2"
                variant="h4"
                className={`form-header ${!isFormAvailable ? 'unavailable' : ''}`}
              >
                {currentHeader}
              </MDBTypography>
            </MDBTooltip>
            <MDBTooltip tag="span" title="Next">
              <span onClick={handleNextForm} className="navigation-icon">
                <MDBIcon
                  fas
                  icon="angle-right"
                  size="2x"
                  className="navigation-arrow"
                />
              </span>
            </MDBTooltip>
          </div>
          <form>
            {/* Parametetri -- Checkboxes & Tooltips */}
            <div className="parameters">
              <div className="parameter-grid">
                {currentParameters.map((param, index) => (
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
                          disabled={!isFormAvailable}
                        />
                      </div>
                    </MDBTooltip>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div className="date-selection">
              <div className="date-container">
                <label htmlFor="startDate">Please Select Date:</label>
                <input
                  type="month"
                  id="startDate"
                  name="startDate"
                  value={startDate}
                  onChange={handleStartDateChange}
                  disabled={!isFormAvailable}
                />
              </div>
            </div>

            {/* Format Selection */}
            <div className="format-selection">
              <label>Please Select the Output Format:</label>
              <div className="format-options">
                <div className="format-item">
                  <MDBCheckbox
                    id="pdf"
                    value="pdf"
                    label="PDF"
                    checked={selectedFormat === 'pdf'}
                    onChange={handleFormatChange}
                    disabled={!isFormAvailable}
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
              <MDBTooltip
                tag="span"
                title={!isFormAvailable ? 'Feature Temporary Unavailable' : ''}
              >
                <MDBBtn
                  type="button"
                  disabled={isGenerateDisabled}
                  color="success"
                  block
                  className={`generate-button ${isGenerateDisabled ? 'disabled-btn' : ''}`}
                  onClick={() => { handleGenerate}}
              >
                Generate
              </MDBBtn>
              </MDBTooltip>
            </div>
          </form>
          {/* Selected Area Display */}
          {calculatedArea > 0 && (
            <div className="selected-area-display">
              <MDBTypography tag="h5" className={`area-text ${calculatedArea > MAX_AREA ? 'area-error' : ''}`}>
                Selected Area: {calculatedArea.toFixed(2)} km²
              </MDBTypography>
              {areaErrorMessage && (
                <div className="error-message">
                  {areaErrorMessage}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FormPage;