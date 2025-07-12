"use client";

import React, { useEffect, useState } from "react";

export default function ViewDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetch("/api/documents");
        if (!res.ok) throw new Error("Failed to fetch documents");
        const data = await res.json();
        setDocuments(data.documents || []); // Adjust this if your API returns differently
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
      <h1 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-6">Your Uploaded Documents</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : documents.length === 0 ? (
        <p className="text-gray-500">No documents uploaded yet.</p>
      ) : (
        <ul className="space-y-4">
          {documents.map((doc) => (
            <li key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-md">
              <div>
                <p className="font-medium">{doc.fileName}</p>
                <p className="text-sm text-gray-500">Type: {doc.type}</p>
              </div>
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 sm:mt-0 inline-block text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-md transition"
              >
                View
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
