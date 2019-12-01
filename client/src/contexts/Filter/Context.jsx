import React, { createContext, useState } from 'react';
import moment from 'moment';

const FilterContext = createContext({});

const FilterProvider = ({ children }) => {
  const initialState = {
    isCheckedSN: true,
    isCheckedSB: true,
    isCheckedDB: true,
    isCheckedDN: true,
    matchDay: moment(),
    startTime: null,
    endTime: null,
    isSimilerRank: false,
  };
  const [state, setState] = useState(initialState);

  return (
    <FilterContext.Provider value={[state, setState]}>
      {children}
    </FilterContext.Provider>
  );
};

export { FilterContext, FilterProvider };