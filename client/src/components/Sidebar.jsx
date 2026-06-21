import React from 'react'

const Sidebar = () => {
  return (
    <div className="w-64 border-r border-gray-200 bg-white p-6">
      <h1 className="mb-8 text-3xl font-bold text-blue-600">
        ClouD
      </h1>

      <button className="mb-8 rounded-xl bg-blue-600 px-5 py-3 text-white">
        + New
      </button>

      <div className="space-y-4">
        <p>My Files</p>
        <p>Recent</p>
        <p>Favorites</p>
        <p>Trash</p>
      </div>
    </div>
  )
}

export default Sidebar