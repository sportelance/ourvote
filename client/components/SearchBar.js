import React, { useState, useContext } from 'react';
import { HomeContext } from '../state/contexts';
const { constructURI, encodeCode } = require('../../URIMethods.js');

const SearchBar = () => {
  const { homeDispatch } = useContext(HomeContext);
  const [address, setAddress] = useState('');

  const onChange = (e) => {
    setAddress(e.target.value);
  }

  const onSubmit = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault(); // prevent page refesh
    }

    // don't submit an empty string
    if (!address) return;
    const addressAscii = encodeCode(address);

    fetch('/politicians/?address=' + addressAscii, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(res => res.json())
    .then(data => {
      setAddress('');
      homeDispatch({
        type: 'OPEN_SEARCH_RESULTS',
        payload: data
      });
    })
    .catch(err => console.error('ERROR getting politicians:', err));
  }

  return (
    <div className="searchBarContainer">
      <div className="formContainer">
        <form className="form"
        onSubmit={onSubmit}>
          <label>Find your representatives:
            <input className="formField"
            type="text"
            id="search"
            placeholder="Home address..."
            onChange={onChange} />
          </label>
          <button className="searchSubmit" onClick={onSubmit}>Search</button>
        </form>
      </div>
    </div>
  )
}

export default SearchBar;