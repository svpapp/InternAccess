import React, { createContext, useState } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [selectedNotification, setSelectedNotification] = useState(null);

  return (
    <NotificationContext.Provider value={{ selectedNotification, setSelectedNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
