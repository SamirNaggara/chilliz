"use client";
import { useEffect, useState } from "react";
import { getJerseyImage } from "@/lib/utils";

const testJerseys = [
  {
    id: "jersey-mbappe-2024",
    name: "Maillot Mbappé Home 2024",
    assetUrl: "/jerseys/jersey-mbappe-2024.png",
    assetType: "image",
  },
  {
    id: "jersey-messi-2024",
    name: "Maillot Messi Away 2024",
    assetUrl: "/jerseys/jersey-messi-2024.png",
    assetType: "image",
  },
  {
    id: "chiliz-hacking-paris-hat",
    name: "Chiliz Hacking Paris Hat",
    assetUrl: "/jerseys/jersey_hat.mp4",
    assetType: "video",
  },
];

export default function TestJerseyPage() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  useEffect(() => {
    addLog("Page chargée - Test des images");

    testJerseys.forEach((jersey) => {
      const result = getJerseyImage(jersey);
      addLog(`${jersey.name}: ${result}`);
    });
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Test Jersey Images</h1>

      {/* Logs */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Logs:</h2>
        <div className="bg-gray-100 p-4 rounded max-h-64 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="text-sm font-mono">
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* Test des images */}
      <div className="space-y-4">
        {testJerseys.map((jersey) => (
          <div key={jersey.id} className="border p-4 rounded">
            <h3 className="font-bold">{jersey.name}</h3>
            <p>ID: {jersey.id}</p>
            <p>AssetUrl: {jersey.assetUrl}</p>
            <p>AssetType: {jersey.assetType}</p>
            <p>getJerseyImage result: {getJerseyImage(jersey)}</p>
            <img
              src={getJerseyImage(jersey)}
              alt={jersey.name}
              className="w-32 h-32 object-contain border"
              onError={(e) => {
                addLog(
                  `❌ Image failed to load: ${jersey.name} - ${e.currentTarget.src}`
                );
              }}
              onLoad={() => {
                addLog(`✅ Image loaded successfully: ${jersey.name}`);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
