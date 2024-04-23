import React, { useState } from "react";

const UnitContext = React.createContext();


function UnitContextProvider({ children }) {
  const [unit, setUnit] = useState("imperial");

  const updateUnit = (newUnit) => {
    setUnit(newUnit);
  }

  return (
    <UnitContext.Provider value={[unit, updateUnit]}>
      {children}
    </UnitContext.Provider>
  );
}

export { UnitContext, UnitContextProvider};