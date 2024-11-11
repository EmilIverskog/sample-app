import React, { createContext, useState, useContext } from 'react'

interface goalsContextType{
    goalRefresh: boolean
    setGoalRefresh: (value: boolean) => void
}

const goalsContext = createContext<goalsContextType>({
    goalRefresh: false,
    setGoalRefresh: () => {}
})

export const GoalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [goalRefresh, setGoalRefresh] = useState(false);
  
    return (
      <goalsContext.Provider value={{ goalRefresh, setGoalRefresh }}>
        {children}
      </goalsContext.Provider>
    );
  };
  
  
  export const useGoals = () => useContext(goalsContext);