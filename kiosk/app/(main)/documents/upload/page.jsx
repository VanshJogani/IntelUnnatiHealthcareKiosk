"use client";

import React, { useState, useRef } from "react";
import { FileUp } from "lucide-react";

export default function UploadDocumentsPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSuccess(false);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload-document", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Upload failed");

      setSuccess(true);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-10 bg-white rounded-lg shadow-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <h1 className="flex items-center text-3xl font-semibold mb-6 text-gray-900 dark:text-gray-100 gap-2">
        <FileUp className="w-8 h-8 text-emerald-600" />
        Upload Your Documents
      </h1>

      {/* Hidden file input */}
      <input
        type="file"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
        id="file-upload"
        accept=".pdf,.png,.jpg,.jpeg"
      />

      {/* Custom choose file button - styled same as upload */}
      <label
        htmlFor="file-upload"
        className="inline-flex items-center justify-center gap-2 w-full py-3 mb-6 cursor-pointer rounded-md bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition shadow-md"
      >
        Choose File
      </label>

      {/* Show selected file name */}
      {file && (
        <p className="mb-6 text-gray-700 dark:text-gray-300 break-words text-center">
          Selected file:{" "}
          <span className="font-medium">
            {file.name.length > 40 ? file.name.slice(0, 37) + "..." : file.name}
          </span>
        </p>
      )}

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="w-full bg-emerald-600 text-white py-3 rounded-md font-semibold disabled:opacity-50 hover:bg-emerald-700 transition shadow"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {/* Success & Error messages */}
      {success && (
        <p className="mt-5 text-green-600 font-semibold text-center">
          Upload successful!
        </p>
      )}
      {error && (
        <p className="mt-5 text-red-600 font-semibold text-center">{error}</p>
      )}
    </div>
  );
}
