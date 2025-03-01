"use client"

import { createContext, useContext, useState, useEffect } from 'react';

const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [company, setCompany] = useState(() => {
    // Initialize from localStorage if available
    const savedCompany = localStorage.getItem('company');
    return savedCompany ? JSON.parse(savedCompany) : null;
  });

  // Update localStorage whenever company changes
  useEffect(() => {
    if (company) {
      localStorage.setItem('company', JSON.stringify(company));
    } else {
      localStorage.removeItem('company');
    }
  }, [company]);

  const updateCompany = (newCompany) => {
    setCompany(newCompany);
  };

  return (
    <CompanyContext.Provider value={{ company, updateCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
}; 