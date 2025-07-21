import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

function DashServices({ title, description, overview: initialOverview, icon, id, onEdit, onDelete }) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [editData, setEditData] = useState({
    title: title,
    description: description,
    overview: initialOverview || '',
  })

  const handleEditClick = (e) => {
    e.preventDefault()
    setShowEditModal(true)
  }

  const handleDeleteClick = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`https://servies-pro-server.onrender.com/services/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        toast.success('Service deleted successfully!')
        if (onDelete) onDelete(id)
      }
    } catch (error) {
      toast.error('Error deleting service')
      console.error('Error deleting service:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`https://servies-pro-server.onrender.com/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      })
      if (response.ok) {
        toast.success('Service updated successfully!')
        if (onEdit) onEdit(id, editData)
      }
    } catch (error) {
      toast.error('Error updating service')
      console.error('Error updating service:', error)
    }
    setShowEditModal(false)
  }

  return (
    <>
      <Link className="relative bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 group">
        {/* Action buttons container */}
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={handleEditClick}
            className="bg-blue-500 text-white p-1 rounded-md hover:bg-blue-600 transition duration-200 w-8 h-8 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDeleteClick}
            className="bg-red-500 text-white p-1 rounded-md hover:bg-red-600 transition duration-200 w-8 h-8 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-center w-14 h-14 bg-teal-100 text-teal-600 rounded-full mb-4 transition-all duration-300 group-hover:bg-teal-600 group-hover:text-white">
          <img src={icon} className="w-10 h-10" alt="" />
        </div>
        <h3 className="text-xl font-semibold text-zinc-800">{title}</h3>
        <p className="text-zinc-600 pt-3">{description}</p>
      </Link>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Service</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={editData.title}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={editData.description}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-20"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="overview">
                  Overview
                </label>
                <textarea
                  id="overview"
                  name="overview"
                  value={editData.overview}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-20"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default DashServices
