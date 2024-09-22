import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select'; 
import './App.css'; 

const options = [
  { value: 'Numbers', label: 'Numbers' },
  { value: 'Alphabets', label: 'Alphabets' },
  { value: 'Highest Lowercase Alphabet', label: 'Highest Lowercase Alphabet' }, 
];

const App = () => {
  const [inputData, setInputData] = useState(''); 
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleInputChange = (e) => {
    setInputData(e.target.value);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedData = JSON.parse(inputData);

      if (!Array.isArray(parsedData.data)) {
        setError('Invalid JSON input. "data" should be an array.');
        return;
      }

      setError('');
      setLoading(true); 


      const payload = {
        data: parsedData.data, 
        ...(parsedData.file_b64 && { file_b64: parsedData.file_b64 }) 
      };


      const response = await axios.post('https://ra2111003010553-dipeshkumar.onrender.com/bfhl', payload);
      setResponseData(response.data);
      setLoading(false); 
    } catch (err) {
      setLoading(false); 
      setError('Invalid JSON format.');
    }
  };


  const handleOptionChange = (selected) => {
    const values = selected.map(option => option.value);
    setSelectedOptions(values);
  };

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
      filteredResponse.highest_lowercase_alphabet = responseData.highest_lowercase_alphabet;
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
      <div className="label-container">
        <label htmlFor="jsonInput">API Input</label>
        <div className="box-container">
          <textarea
            id="jsonInput"
            placeholder='Enter Data and file type' 
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
