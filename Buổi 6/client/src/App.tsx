/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [loading, setLoading] = useState<boolean>(false)
  const [fileList, setFileList] = useState([])
  const [folder, setFolder] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as any

    if (files[0]) setFile(files[0])
  }

  const uploadFile = async () => {
    if (file) {
      setLoading(true)
      const formData = new FormData()
      formData.append('file', file)
      await axios.post('http://localhost:5000/api/files/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      fetchFiles()

      setLoading(false)
    }
  }

  const handleUpload = async () => {
    if (!file) return alert('Please select a file')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    try {
      await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      fetchFiles({ folder })
    } catch (err) {
      console.error(err)
    }
  }

  const fetchFiles = async (
    filters: { keyword?: string; folder?: string } = {}
  ) => {
    try {
      const res = await axios.get(`http://localhost:5000/files`, {
        params: { filters: JSON.stringify(filters) },
      })
      setFileList(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  return (
    <>
      <div>
        <button onClick={uploadFile}>Upload File</button>
        <input type="file" onChange={onChangeFile} />
      </div>

      <h1>Danh sach file</h1>

      {loading ? (
        <h1>Loading...</h1>
      ) : (
        files.map((file) => {
          return (
            <div
              style={{
                padding: 15,
                border: 1,
                marginBottom: 10,
                borderRadius: 10,
              }}
            >
              {JSON.stringify(file)}
            </div>
          )
        })
      )}
    </>
  )
}

export default App
