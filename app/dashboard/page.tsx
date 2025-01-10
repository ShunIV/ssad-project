"use client";
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";

const DashboardPage: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);
  const [sharedFiles, setSharedFiles] = useState<SharedFileData[]>([]);
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
  const user_id = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string).id : 0;

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

  useEffect(() => {
    fetchSharedFiles();
    fetchUploadedFiles();
  }, []);

  return (
    <div className="px-4 py-4 flex flex-col gap-4">
      <div>
        <div className="flex justify-start items-center gap-8">
          <div className="p-4 bg-zinc-800 font-bold rounded-md text-white h-32 w-72 flex justify-between items-center border-yellow-600 border-2">
            <div className="flex justify-between flex-col gap-3 ">
              <h3 className="text-5xl">{uploadedFiles.length}</h3>
              <p className="text-gray-500">Uploaded Files</p>
            </div>
            <img src="file.svg" alt="" className="h-24" />
          </div>

          <div className="p-4 bg-zinc-800 font-bold rounded-md text-white h-32 w-72 flex justify-between items-center border-yellow-600 border-2">
            <div className="flex justify-between flex-col gap-3 ">
              <h3 className="text-5xl">{sharedFiles.length}</h3>
              <p className="text-gray-500">Shared Files</p>
            </div>
            <img src="file.svg" alt="" className="h-24" />
          </div>
        </div>
      </div>
      <div className="w-5/12 ">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
          initialView="dayGridMonth"
        />
      </div>
    </div>
  );
};

export default DashboardPage;
