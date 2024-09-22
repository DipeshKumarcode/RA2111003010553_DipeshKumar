import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select'; // Import react-select for the dropdown
import './App.css'; // Import your custom styles

const options = [
  { value: 'Numbers', label: 'Numbers' },
  { value: 'Alphabets', label: 'Alphabets' },
  { value: 'Highest Lowercase Alphabet', label: 'Highest Lowercase Alphabet' }, // Update for highest lowercase alphabet
];

const App = () => {
  const [inputData, setInputData] = useState(''); // Same input for both `data` and optional `file_b64`
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // New loading state
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Handle input change
  const handleInputChange = (e) => {
    setInputData(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedData = JSON.parse(inputData);

      // Validate that the "data" field is present and is an array
      if (!Array.isArray(parsedData.data)) {
        setError('Invalid JSON input. "data" should be an array.');
        return;
      }

      setError('');
      setLoading(true); // Set loading to true when submit is clicked

      // Prepare the payload to send to the backend
      const payload = {
        data: parsedData.data, // Always send `data`
        ...(parsedData.file_b64 && { file_b64: parsedData.file_b64 }) // Conditionally add `file_b64` if it exists
      };

      // Update the URL to point to your deployed backend on Render
      const response = await axios.post('https://ra2111003010553-dipeshkumar.onrender.com/bfhl', payload);
      setResponseData(response.data);
      setLoading(false); // Set loading to false when data is received
    } catch (err) {
      setLoading(false); // Set loading to false in case of error
      setError('Invalid JSON format.');
    }
  };

  // Handle multi-select dropdown change
  const handleOptionChange = (selected) => {
    const values = selected.map(option => option.value);
    setSelectedOptions(values);
  };

  // Render filtered response based on selected options
  const renderFilteredResponse = () => {
    if (!responseData) return null;

    let filteredResponse = {};

    if (selectedOptions.includes('Numbers')) {
      filteredResponse.numbers = responseData.numbers;
    }
    if (selectedOptions.includes('Alphabets')) {
      filteredResponse.alphabets = responseData.alphabets;
    }
    if (selectedOptions.includes('Highest Lowercase Alphabet')) {
      filteredResponse.highest_lowercase_alphabet = responseData.highest_lowercase_alphabet; // Updated key
    }

    return (
      <div className="filtered-response">
        <h3>Filtered Response</h3>
        {filteredResponse.numbers && <p>Numbers: {filteredResponse.numbers.join(', ')}</p>}
        {filteredResponse.alphabets && <p>Alphabets: {filteredResponse.alphabets.join(', ')}</p>}
        {filteredResponse.highest_lowercase_alphabet && <p>Highest Lowercase Alphabet: {filteredResponse.highest_lowercase_alphabet}</p>}
      </div>
    );
  };

  return (
    <div className="container">
      {/* API Input Section */}
      <div className="label-container">
        <label htmlFor="jsonInput">API Input</label>
        <div className="box-container">
          <textarea
            id="jsonInput"
            placeholder='{"data": ["M", "1", "334", "4", "B", "Z", "a"]}' // Placeholder with only `data`
            value={inputData}
            onChange={handleInputChange}
            rows="6"
            className="input-box"
          ></textarea>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      <button type="submit" className="submit-button" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Loading...' : 'Submit'}
      </button>

      {/* Multi Filter Section */}
      {responseData && (
        <div className="select-container">
          <label htmlFor="multiFilter">Multi Filter</label>
          <div className="multi-select-box">
            <Select
              id="multiFilter"
              isMulti
              options={options}
              className="multi-select"
              onChange={handleOptionChange}
            />
          </div>

          {renderFilteredResponse()}
        </div>
      )}
    </div>
  );
};

export default App;
