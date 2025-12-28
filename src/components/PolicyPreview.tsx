"use client";

import { useState } from "react";
import { Copy, Download, Check, FileText, FileCode, FileType, File } from "lucide-react";
import { exportToPDF, exportToWord, exportToHTML, copyToClipboard } from "@/lib/export";

interface PolicyPreviewProps {
  content: string;
  policyType: string;
  businessName: string;
}

export function PolicyPreview({ content, policyType, businessName }: PolicyPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);

  const formattedContent = content.replace("[LAST_UPDATED_DATE]", new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }));

  const handleCopy = async () => {
    await copyToClipboard(formattedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = async (format: "pdf" | "docx" | "html" | "txt" | "md") => {
    setExporting(format);
    try {
      if (format === "pdf") {
        await exportToPDF(formattedContent, policyType, businessName);
      } else if (format === "docx") {
        await exportToWord(formattedContent, policyType, businessName);
      } else if (format === "html") {
        exportToHTML(formattedContent, policyType, businessName);
      } else {
        // Plain text or markdown
        const extension = format === "md" ? "md" : "txt";
        const mimeType = format === "md" ? "text/markdown" : "text/plain";
        const blob = new Blob([formattedContent], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${policyType.toLowerCase().replace(/\s+/g, "-")}-${businessName.toLowerCase().replace(/\s+/g, "-")}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export. Please try again.");
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">{policyType}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              {exporting ? "Exporting..." : "Download"}
            </button>
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <div className="py-1">
                <button
                  onClick={() => handleExport("pdf")}
                  disabled={exporting !== null}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  <File className="w-4 h-4 text-red-600" />
                  <div className="text-left">
                    <div className="font-medium">PDF Document</div>
                    <div className="text-xs text-gray-500">Best for printing</div>
                  </div>
                </button>
                <button
                  onClick={() => handleExport("docx")}
                  disabled={exporting !== null}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium">Word Document</div>
                    <div className="text-xs text-gray-500">Editable in Microsoft Word</div>
                  </div>
                </button>
                <button
                  onClick={() => handleExport("html")}
                  disabled={exporting !== null}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  <FileCode className="w-4 h-4 text-orange-600" />
                  <div className="text-left">
                    <div className="font-medium">HTML File</div>
                    <div className="text-xs text-gray-500">Ready for your website</div>
                  </div>
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => handleExport("md")}
                  disabled={exporting !== null}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  <FileType className="w-4 h-4 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium">Markdown</div>
                    <div className="text-xs text-gray-500">For documentation tools</div>
                  </div>
                </button>
                <button
                  onClick={() => handleExport("txt")}
                  disabled={exporting !== null}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  <FileText className="w-4 h-4 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium">Plain Text</div>
                    <div className="text-xs text-gray-500">Simple text format</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 max-h-[600px] overflow-y-auto">
        <div className="prose prose-gray max-w-none">
          {formattedContent.split("\n").map((line, i) => {
            if (line.startsWith("# ")) {
              return <h1 key={i} className="text-2xl font-bold text-gray-900 mb-4">{line.slice(2)}</h1>;
            }
            if (line.startsWith("## ")) {
              return <h2 key={i} className="text-xl font-semibold text-gray-900 mt-6 mb-3 pb-2 border-b border-gray-200">{line.slice(3)}</h2>;
            }
            if (line.startsWith("### ")) {
              return <h3 key={i} className="text-lg font-medium text-gray-900 mt-4 mb-2">{line.slice(4)}</h3>;
            }
            if (line.startsWith("- ")) {
              return <li key={i} className="ml-4 text-gray-700">{line.slice(2)}</li>;
            }
            if (line.trim() === "") {
              return <br key={i} />;
            }
            return <p key={i} className="text-gray-700 my-2">{line}</p>;
          })}
        </div>
      </div>
    </div>
  );
}
