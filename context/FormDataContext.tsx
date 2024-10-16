// contexts/FormDataContext.tsx

"use client";

import React, { createContext, useState, useContext } from 'react';

interface FormData {
  company: string;
  dealId: string;
  bio: string;
  url: string;
  lumenStatus: string[];
  verificationDocuments: string[];
  otherIncome: string[];
}

interface FormDataContextProps {
  data: FormData;
  setData: React.Dispatch<React.SetStateAction<FormData>>;
}

export const FormDataContext = createContext<FormDataContextProps | undefined>(undefined);

// Custom hook
export const useFormDataContext = () => {
  const context = useContext(FormDataContext);
  if (!context) {
    throw new Error('useFormDataContext must be used within a FormDataProvider');
  }
  return context;
};

export const FormDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<FormData>({
    company: '',
    dealId: '',
    bio: '',
    url: '',
    lumenStatus: [],
    verificationDocuments: [],
    otherIncome: [],
  });

  return (
    <FormDataContext.Provider value={{ data, setData }}>
      {children}
    </FormDataContext.Provider>
  );
};
