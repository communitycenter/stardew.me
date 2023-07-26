import React, { createContext, useContext, useState } from 'react';

type UploadContextType = {
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
};

const UploadContext = createContext<UploadContextType | null>(null);

export const useUploadContext = () => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error('useUploadContext must be used within an UploadProvider');
  }
  return context;
};

type UploadProviderProps = {
  children: React.ReactNode;
};

export const UploadProvider: React.FC<UploadProviderProps> = ({ children }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <UploadContext.Provider value={{ selectedFile, setSelectedFile }}>
      {children}
    </UploadContext.Provider>
  );
};
