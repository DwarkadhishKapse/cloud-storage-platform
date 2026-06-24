import React from 'react'
import { useParams } from 'react-router-dom'

const FolderPage = () => {
    const { folderId } = useParams()
  return (
    <div>
        <h1 className='text-4xl font-bold text-slate-900'>Folder {folderId}</h1>
    </div>
  )
}

export default FolderPage