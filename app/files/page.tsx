"use client";
import React, { useState } from "react";

const Page: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (selectedFile) {
            // Handle file upload logic here
            console.log("Uploading:", selectedFile.name);
            setIsModalOpen(false);
        }
    };

    return (
        <div
            className="flex flex-col justify-start p-4"
            style={{ height: "calc(100vh - 100px)" }}
        >
            <div className="bg-yellow-600 rounded-xl p-4 w-1/4 mb-4 self-center">
                <p className="font-bold text-lg">+ add new file</p>
                <div className="flex float-end">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-yellow-700 text-white px-4 py-2 rounded-full mt-4 right-0"
                    >
                        Upload
                    </button>
                </div>
            </div>

            <div >
                <h1 className="self-start text-xl font-bold">uploaded files</h1>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-black rounded-xl p-4 w-1/4 border-2 border-yellow-500">
                        <p className="font-bold text-lg">Upload File</p>
                        <input type="file" onChange={handleFileChange} className="mt-4" />
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
        </div>
    );
};

export default Page;
