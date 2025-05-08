
import { ChangeEvent, useState } from "react";
import { Button } from "./button";
import { Upload, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onUpload: (file: File, content?: string) => void;
  acceptedFileTypes?: string;
  maxSize?: number;
  className?: string;
}

export function FileUpload({
  onUpload,
  acceptedFileTypes = ".csv",
  maxSize = 5, // in MB
  className,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    setSuccess(false);
    
    if (!file) return;

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize} MB limit`);
      return;
    }

    setIsUploading(true);
    
    try {
      // For CSV files, we can parse the content
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        const content = await file.text();
        onUpload(file, content);
      } else {
        onUpload(file);
      }
      
      setSuccess(true);
    } catch (err) {
      setError("Error processing file");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <label 
          htmlFor="file-upload" 
          className="cursor-pointer"
        >
          <div className="relative">
            <Button 
              type="button" 
              variant={success ? "default" : "outline"} 
              className={cn(
                "flex items-center gap-2",
                success ? "bg-green-600 hover:bg-green-700" : ""
              )}
            >
              {isUploading ? (
                "Uploading..."
              ) : success ? (
                <>
                  <Check size={16} />
                  File Uploaded
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Upload {acceptedFileTypes}
                </>
              )}
            </Button>
            <input
              id="file-upload"
              type="file"
              accept={acceptedFileTypes}
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={isUploading}
            />
          </div>
        </label>
      </div>
      
      {error && (
        <div className="text-destructive text-sm flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  );
}
