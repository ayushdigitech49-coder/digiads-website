import React, { createContext, useContext, useState, useEffect } from 'react';

interface ModalContextType {
  isAuditModalOpen: boolean;
  openAuditModal: () => void;
  closeAuditModal: () => void;
  isConsultationModalOpen: boolean;
  openConsultationModal: (serviceName?: string) => void;
  closeConsultationModal: () => void;
  selectedService: string;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('All Services');

  const openAuditModal = () => setIsAuditModalOpen(true);
  const closeAuditModal = () => setIsAuditModalOpen(false);

  const openConsultationModal = (serviceName?: string) => {
    if (serviceName) setSelectedService(serviceName);
    setIsConsultationModalOpen(true);
  };
  const closeConsultationModal = () => setIsConsultationModalOpen(false);

  // Prevent Background Page Body Scroll when ANY Modal is Open
  useEffect(() => {
    if (isAuditModalOpen || isConsultationModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
    };
  }, [isAuditModalOpen, isConsultationModalOpen]);

  return (
    <ModalContext.Provider
      value={{
        isAuditModalOpen,
        openAuditModal,
        closeAuditModal,
        isConsultationModalOpen,
        openConsultationModal,
        closeConsultationModal,
        selectedService,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
