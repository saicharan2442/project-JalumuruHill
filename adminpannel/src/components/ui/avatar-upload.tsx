
import { ChangeEvent, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Upload, User } from "lucide-react";

interface AvatarUploadProps {
  initialImageUrl?: string;
  onImageChange: (imageUrl: string) => void;
  className?: string;
}

export function AvatarUpload({ 
  initialImageUrl, 
  onImageChange,
  className 
}: AvatarUploadProps) {
  const [imageUrl, setImageUrl] = useState(initialImageUrl || "");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // In a real app, you would upload to a server
      // For this demo, we'll use a data URL
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImageUrl(result);
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    onImageChange(e.target.value);
  };

  return (
    <div className={className}>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <Avatar className="h-24 w-24">
          <AvatarImage src={imageUrl} alt="Avatar" />
          <AvatarFallback className="bg-muted">
            <User className="h-12 w-12 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Button type="button" variant="outline" className="flex items-center gap-2">
                <Upload size={16} />
                Upload image
              </Button>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <div className="text-sm text-muted-foreground mt-2 sm:mt-2.5 sm:ml-2">
              or enter image URL:
            </div>
          </div>
          <input
            type="url"
            value={imageUrl}
            onChange={handleUrlChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>
      </div>
    </div>
  );
}
