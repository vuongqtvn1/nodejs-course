/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Folder,
  File,
  Upload,
  Download,
  Loader2,
  ArrowLeft,
  Trash,
} from "lucide-react";

export enum EFileType {
  Folder = "folder",
  File = "file",
}

export interface IFile {
  _id: string;
  name: string; // ten cai file hoac folder
  url: string; // duong dan tuong doi hoac duong dan cloud den cai file do
  size: number; // kich thuoc cua file
  format: string; // image/png minetype
  type: EFileType; // ten cai file hoac folder
  folder: string | null;
}

export default function FileManager() {
  const [files, setFiles] = useState<IFile[]>([]);
  const [newFolder, setNewFolder] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPaths, setCurrentPaths] = useState<
    Array<{ id: string; name: string }>
  >([]);

  const getFolderIdCurrent = () => {
    if (currentPaths.length) return currentPaths[currentPaths.length - 1].id;

    return "";
  };

  const fetchFiles = async () => {
    try {
      setLoading(true);

      const folder = getFolderIdCurrent();
      const { data } = await axios.get("http://localhost:5000/api/files", {
        params: { filters: JSON.stringify({ folder }) },
      });
      setFiles(data.data);
      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      setFiles([]);
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;

    const formData = new FormData();
    const selectedFolder = getFolderIdCurrent();
    if (selectedFolder) formData.append("folder", selectedFolder);
    formData.append("file", file);
    setLoadingUpload(true);
    await axios.post("http://localhost:5000/api/files/file", formData);
    setLoadingUpload(false);
    fetchFiles();
  };

  const createFolder = async () => {
    if (!newFolder) return;
    setLoadingUpload(true);
    const selectedFolder = getFolderIdCurrent();
    await axios.post("http://localhost:5000/api/files/folder", {
      name: newFolder,
      folder: selectedFolder ? selectedFolder : null,
    });
    setNewFolder("");
    setLoadingUpload(false);
    fetchFiles();
  };

  const openFolder = (folder: IFile) => {
    setCurrentPaths((prev) => [...prev, { id: folder._id, name: folder.name }]);
  };

  const goBack = () => {
    if (!currentPaths.length) return;
    const clonePaths = [...currentPaths];
    clonePaths.pop();

    setCurrentPaths(clonePaths);
  };

  const handleDeleteFile = async (file: IFile) => {
    try {
      setLoadingDelete(true);

      await axios.delete(
        `http://localhost:5000/api/files/${file.type}/${file._id}`
      );
      setLoadingDelete(false);
      fetchFiles();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      setFiles([]);
      setLoadingDelete(false);
    }
  };

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPaths]);

  const pathList = currentPaths.map((item) => item.name).join("/");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">File Manager</h1>
      <div className="flex gap-2 mb-4">
        <input
          disabled={loadingUpload}
          type="file"
          onChange={handleUpload}
          className="hidden"
          id="fileUpload"
        />
        <label
          htmlFor="fileUpload"
          className="w-60 cursor-pointer bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Upload size={18} /> Upload File
        </label>
        <Input
          disabled={loadingUpload}
          placeholder="Folder name"
          value={newFolder}
          onChange={(e) => setNewFolder(e.target.value)}
        />
        <Button
          disabled={loadingUpload}
          onClick={createFolder}
          className="bg-green-500 text-white"
        >
          Create Folder
        </Button>
      </div>
      <div className="p-3 flex gap-4 items-center">
        {currentPaths.length > 0 && (
          <Button
            disabled={loadingUpload}
            onClick={goBack}
            className="bg-gray-500 text-white"
          >
            <ArrowLeft size={18} /> Back
          </Button>
        )}
        <h1>Folder Directory: ROOT/{pathList}</h1>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="animate-spin" size={24} /> Loading...
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {files.map((item, index) => (
            <div
              key={index}
              className="p-4 border rounded flex items-center gap-2 cursor-pointer"
              onClick={() => item.type === "folder" && openFolder(item)}
            >
              {item.type === "folder" ? (
                <Folder size={20} />
              ) : (
                <File size={20} />
              )}
              <span>{item.name}</span>

              <div className="ml-auto inline-flex gap-4">
                <button
                  className="cursor-pointer"
                  disabled={loadingDelete}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(item);
                  }}
                >
                  <Trash size={18} />
                </button>
                {item.type !== "folder" && (
                  <a
                    href={`http://localhost:5000/api/files/download/${item._id}`}
                  >
                    <Download size={18} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
