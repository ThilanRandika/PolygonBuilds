import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

export const ModelContext = createContext();

export const ModelProvider = ({ children }) => {
  const [modelLink, setModelLink] = useState(() => {
    // Get the initial value from localStorage if it exists
    return localStorage.getItem("modelLink") || "";
  });

  useEffect(() => {
    // Update localStorage whenever modelLink changes
    localStorage.setItem("modelLink", modelLink);
  }, [modelLink]);

  return (
    <ModelContext.Provider value={{ modelLink, setModelLink }}>
      {children}
    </ModelContext.Provider>
  );
};

ModelProvider.propTypes = {
  children: PropTypes.node.isRequired, // Validates the `children` prop
};
