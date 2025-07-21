import React, { useState } from 'react'

function DashLatest({ title, description, image, link, id, onDelete, onEdit }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editTitle, setEditTitle] = useState(title)
  const [editDescription, setEditDescription] = useState(description)

  const handleEditSubmit = (e) => {
    e.preventDefault()
    onEdit(id, { title: editTitle, description: editDescription })
    setIsModalOpen(false)
  }

  return (
    <>
      <div className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white relative">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-5">
            <h3 className="text-xl font-semibold text-zinc-800 mb-2 group-hover:text-teal-600 transition-colors duration-300">
              {title}
            </h3>
            <p className="text-zinc-600">{description}</p>
          </div>
        </a>

        {/* Edit & Delete Buttons */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1 text-sm bg-teal-500 text-white rounded hover:bg-teal-600"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(id)}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Item</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default DashLatest
