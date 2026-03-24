import { createContext, useContext, useState, ReactNode } from 'react';

interface ActionMenuContextType {
  isVisible: boolean;
  openMenu: () => void;
  closeMenu: () => void;
}

const ActionMenuContext = createContext<ActionMenuContextType | null>(null);

export function ActionMenuProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <ActionMenuContext.Provider
      value={{
        isVisible,
        openMenu: () => setIsVisible(true),
        closeMenu: () => setIsVisible(false),
      }}
    >
      {children}
    </ActionMenuContext.Provider>
  );
}

export const useActionMenu = () => {
  const context = useContext(ActionMenuContext);
  if (!context) {
    throw new Error('useActionMenu must be used within an ActionMenuProvider');
  }
  return context;
};
