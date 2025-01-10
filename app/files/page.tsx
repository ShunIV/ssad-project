"use client";
import React, { useState, useEffect } from "react";

interface FileData {
    id: number;
    file: string;
    description: string;
    file_name: string;
    size: string;
    last_modified: string;
    owner: number;
}

interface SharedFileData {
    id: number;
    file_id: number;
    shared_with_user: number | null;
    shared_with_group: number | null;
    re_share: boolean;
}

const Page: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [shareWith, setShareWith] = useState<string[]>([]);
    const [fileName, setFileName] = useState("");
    const [fileDescription, setFileDescription] = useState("");
    let [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);
    let [sharedFiles, setSharedFiles] = useState<SharedFileData[]>([]);
    const [selectedFileId, setSelectedFileId] = useState<number | null>(null);

    const user_id = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string).id : 0;

    const fetchUploadedFiles = async () => {
        try {
            const response = await fetch(
                `https://localhost:443/uploaded-files?user_id=${user_id}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch uploaded files");
            }
            const data: FileData[] = await response.json();
            setUploadedFiles(data);
        } catch (error) {
            console.error("Error fetching uploaded files:", error);
        }
    };

    const fetchSharedFiles = async () => {
        try {
            const response = await fetch(
                `https://localhost:443/users/${user_id}/shared-files/`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch shared files");
            }
            const data: SharedFileData[] = await response.json();
            setSharedFiles(data);
        } catch (error) {
            console.error("Error fetching shared files:", error);
        }
    };

    useEffect(() => {
        fetchUploadedFiles();
        fetchSharedFiles();
    }, [user_id]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (selectedFile) {
            console.log("Uploading:", selectedFile.name);
            setIsModalOpen(false);
            setIsDetailsModalOpen(true);  
        }
    };

    const handleShare = async () => {
        if (selectedFileId === null) return;

        const shareData = {
            file: selectedFileId.toString(),
            chef: shareWith.includes("chef"),
            departement: shareWith.includes("dep"),
        };

        try {
            const response = await fetch(`https://localhost:443/users/${user_id}/shared-files/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(shareData),
            });

            if (!response.ok) {
                throw new Error("Failed to share file");
            }

            console.log("File shared successfully");
        } catch (error) {
            console.error("Error sharing file:", error);
        }

        setTimeout(() => {
            alert("File shared successfully!");
        }, 1000);

        setIsShareModalOpen(false);
    };

    const handleSend = async () => {
        if (!selectedFile) return;
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("description", fileDescription);
        formData.append("file_name", fileName);
        const formattedDate = new Date()
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
        formData.append("last_modified", formattedDate);
        formData.append("owner", user_id);
        formData.append("size", selectedFile.size.toString());

        try {
            const response = await fetch("https://localhost:443/uploaded-files/", {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to upload file");
            }

            console.log("File uploaded successfully");
            // Fetch the updated list of uploaded files
            const updatedFiles = await response.json();
            setUploadedFiles(updatedFiles);
        } catch (error) {
            console.error("Error uploading file:", error);
        }

        setIsDetailsModalOpen(false);
        setTimeout(() => {
            alert("File uploaded successfully!");
        }, 1000);
        fetchUploadedFiles();
    };

    const toggleShareWith = (role: string) => {
        setShareWith((prev) =>
            prev.includes(role)
                ? prev.filter((item) => item !== role)
                : [...prev, role]
        );
    };

    const DownloadFile = async (
        fileUrl: string,
        fileName: string,
        fileExtention: string
    ) => {
        try {
            const response = await fetch(
                `https://localhost:443/uploaded-files/${fileUrl}`
            );
            fileExtention = fileExtention.split(".").pop() || "";
            console.log(fileExtention);
            console.log("test test");

            if (!response.ok) {
                console.error("Error fetching file:", response.statusText);
                return;
            }

            const blob = await response.blob();
            console.log(blob);
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = fileName + "." + fileExtention; // Specify the file name and extension
            a.click();

            URL.revokeObjectURL(url); // Clean up memory
        } catch (error) {
            console.error("Error during file download:", error);
        }
    };

    return (
        <div
            className="flex flex-col justify-start p-4"
            style={{ height: "calc(100vh - 100px)" }}
        >
            <div className="bg-yellow-600 rounded-xl p-4 w-1/4 mb-4 self-center">
                <p className="font-bold text-lg">+ Add New File</p>
                <div className="flex float-end">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-yellow-700 text-white px-4 py-2 rounded-full mt-4 right-0"
                    >
                        Upload
                    </button>
                </div>
            </div>

            <div>
                <h1 className="self-start text-xl font-bold">Uploaded Files</h1>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {uploadedFiles.length > 0 ? (
                        uploadedFiles.map((file) => (
                            <div key={file.id} className="bg-zinc-800 p-4 rounded-md mb-4">
                                <p className="font-bold">Title : {file.file_name}</p>
                                <p>{file.description}</p>
                                <p>Size: {file.size} KB</p>
                                <p>
                                    Last Modified: {new Date(file.last_modified).toLocaleString()}
                                </p>

                                <div className="flex justify-end">
                                    <button
                                        onClick={() => {
                                            setIsShareModalOpen(true);
                                            setSelectedFileId(file.id);
                                        }}
                                        className="bg-yellow-700 text-white px-4 py-2 rounded-full mt-4 mr-4"
                                    >
                                        Share
                                    </button>
                                    <button
                                        onClick={() =>
                                            DownloadFile(file.id.toString(), file.file_name, file.file)
                                        }
                                        className="bg-yellow-700 text-white px-4 py-2 rounded-full mt-4"
                                    >
                                        Download
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-zinc-800 p-4 rounded-md mb-4">
                            <p className="font-bold text-center">No uploaded files yet</p>
                        </div>
                    )}
                </div>
            </div>

            <div>
                <h1 className="self-start text-xl font-bold">Shared Files</h1>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {sharedFiles.length > 0 ? (
                        Array.from(new Set(sharedFiles.map((file) => file.file_id))).map((file_id) => {
                            const sharedFile = sharedFiles.find((file) => file.file_id === file_id);
                            return (
                                <div key={sharedFile?.id} className="bg-zinc-800 p-4 rounded-md mb-4">
                                    <p className="font-bold">Title : {sharedFile?.id}</p>
                                    <p>desc</p>
                                    <p>Size: 10 KB</p>
                                    <p>
                                        Last Modified: {new Date().toLocaleString()}
                                    </p>

                                    <div className="flex justify-end">
                                        <button
                                            onClick={() =>
                                                DownloadFile(sharedFile?.file_id.toString() || "", sharedFile?.file_id.toString() || "", "txt")
                                            }
                                            className="bg-yellow-700 text-white px-4 py-2 rounded-full mt-4"
                                        >
                                            Download
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-zinc-800 p-4 rounded-md mb-4">
                            <p className="font-bold text-center">No shared files yet</p>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-zinc-900 bg-opacity-50">
                    <div className="bg-zinc-900 rounded-xl p-6 w-1/4 border-2 border-yellow-500">
                        <p className="font-bold text-lg">Upload File</p>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="mt-4 p-2 border-2 border-yellow-500 rounded-md bg-transparent text-white"
                        />
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={handleUpload}
                                className="bg-yellow-700 text-white px-4 py-2 rounded-full mr-2"
                            >
                                Upload
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded-full"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isShareModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-zinc-900 rounded-xl p-6 w-1/4 border-2 border-yellow-500">
                        <p className="font-bold text-lg">Share File</p>
                        <div className="mt-4">
                            <label className="block bg-zinc-800 p-4 rounded-md mb-4 shadow-xl hover:shadow-2xl">
                                <input
                                    type="checkbox"
                                    checked={shareWith.includes("chef")}
                                    onChange={() => toggleShareWith("chef")}
                                    className="mr-2 focus:ring-yellow-500 bg-transparent"
                                />
                                Chef
                            </label>
                            <label className="block p-4 rounded-md bg-zinc-800">
                                <input
                                    type="checkbox"
                                    checked={shareWith.includes("dep")}
                                    onChange={() => toggleShareWith("dep")}
                                    className="mr-2 focus:ring-yellow-500 bg-transparent"
                                />
                                Department
                            </label>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={handleShare}
                                className="bg-yellow-700 text-white px-4 py-2 rounded-full mr-2"
                            >
                                Share
                            </button>
                            <button
                                onClick={() => setIsShareModalOpen(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded-full"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isDetailsModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-zinc-900 rounded-xl p-6 w-1/4 border-2 border-yellow-500">
                        <p className="font-bold text-lg">File Details</p>
                        <div className="mt-4">
                            <input
                                type="text"
                                placeholder="File Name"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                className="w-full p-2 border-2 border-yellow-500 rounded-md bg-transparent text-white mb-4"
                            />
                            <textarea
                                placeholder="File Description"
                                value={fileDescription}
                                onChange={(e) => setFileDescription(e.target.value)}
                                className="w-full p-2 border-2 border-yellow-500 rounded-md bg-transparent text-white"
                            />
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={handleSend}
                                className="bg-yellow-700 text-white px-4 py-2 rounded-full mr-2"
                            >
                                Send
                            </button>
                            <button
                                onClick={() => setIsDetailsModalOpen(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded-full"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;
