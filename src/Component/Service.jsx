import React from 'react'
import { Link } from 'react-router-dom'

function Service({ title, description, icon, id }) {
  return (
    <Link to={`/service/${id}`} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 group">
      <div className="flex items-center justify-center w-14 h-14 bg-teal-100 text-teal-600 rounded-full mb-4 transition-all duration-300 group-hover:bg-teal-600 group-hover:text-white">
        <img src={icon} className=' w-10 h-10' alt="" />
      </div>
      <h3 className="text-xl font-semibold text-zinc-800 2">{title}</h3>
      <p className="text-zinc-600 pt-3">{description}</p>
    </Link>
  )
}

export default Service
