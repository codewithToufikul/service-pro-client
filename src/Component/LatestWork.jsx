import React from 'react'

function LatestWork({ title, description, image, link }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white"
    >
      <div className="overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold text-zinc-800  mb-2 group-hover:text-teal-600 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-zinc-600 ">{description}</p>
      </div>
    </a>
  )
}

export default LatestWork
