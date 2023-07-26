import React, { createContext, useContext, useState } from "react";

type AvatarContextType = {
  isAvatar: boolean;
  setIsAvatar: React.Dispatch<React.SetStateAction<boolean>>;
};

const AvatarContext = createContext<AvatarContextType>({
  isAvatar: false,
  setIsAvatar: () => {},
});

export const useAvatarContext = () => useContext(AvatarContext);

type AvatarProviderProps = {
  children: React.ReactNode;
};

export const AvatarProvider: React.FC<AvatarProviderProps> = ({ children }) => {
  const [isAvatar, setIsAvatar] = useState<boolean>(false);

  return (
    <AvatarContext.Provider value={{ isAvatar, setIsAvatar }}>
      {children}
    </AvatarContext.Provider>
  );
};
