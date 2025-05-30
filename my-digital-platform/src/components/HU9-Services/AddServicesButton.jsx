import React, { useState } from 'react'
import AddServiceForm from './AddServicesForm'

const AddServiceButton = ({ onAddService }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const handleAdd = (service) => {
    onAddService(service)
    handleClose()
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
      >
        Agregar Servicio
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <AddServiceForm
            onAddService={handleAdd}
            onClose={handleClose}
          />
        </div>
      )}
    </>
  )
}

export default AddServiceButton