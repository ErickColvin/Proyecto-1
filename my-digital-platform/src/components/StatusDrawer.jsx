import React from 'react';

const StatusDrawer = ({
    isOpen,
    onClose,
    statusOptions,
    selectedStatusService,
    setServices
}) => {
    if (!isOpen) return null;

    const handleStatusSelect = (status) => {
        setServices(prev =>
            prev.map(service =>
                service.requestId === selectedStatusService.requestId
                    ? { ...service, status }
                    : service
            )
        );
        onClose();
    };

    return (
        <div className="fixed inset-y-0 right-0 w-80 bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-50">
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Cambiar Estado</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                        aria-label="Cerrar"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-2">
                    {statusOptions.map((status, index) => (
                        <button
                            key={index}
                            onClick={() => handleStatusSelect(status)}
                            className={`
                w-full p-3 text-left rounded
                ${selectedStatusService?.status === status
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-700 text-white hover:bg-gray-600'
                                }
              `}
                        >
                            <div className="flex items-center">
                                <span className="flex-grow">{status}</span>
                                {selectedStatusService?.status === status && (
                                    <span className="text-white">✓</span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StatusDrawer;