import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, CheckCircle2, Loader2, Link as LinkIcon, X } from 'lucide-react';
import { adminService } from '../../services/admin.service';

interface ImageUploadInputProps {
  label: string;
  value: string;
  onChange: (newUrl: string) => void;
  placeholder?: string;
  helpText?: string;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'https://... or upload local image',
  helpText,
}) => {
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMsg('Please select a valid image file (.jpg, .png, .webp, .svg)');
      return;
    }

    setUploading(true);
    setMsg(null);

    try {
      const res = await adminService.uploadImage(file);
      if (res && res.success && res.url) {
        onChange(res.url);
        setMsg('Image uploaded successfully from computer!');
      } else {
        // Fallback to FileReader Base64 data URL
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            onChange(event.target.result as string);
            setMsg('Image uploaded successfully!');
          }
        };
        reader.readAsDataURL(file);
      }
    } catch {
      // Fallback to FileReader Base64 data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange(event.target.result as string);
          setMsg('Image uploaded successfully!');
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
      setTimeout(() => setMsg(null), 4000);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-700">{label}</label>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        
        {/* Preview Thumbnail */}
        {value ? (
          <div className="relative group shrink-0 w-12 h-12 rounded-xl border border-slate-300 overflow-hidden bg-slate-100 flex items-center justify-center">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="shrink-0 w-12 h-12 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400">
            <ImageIcon className="w-5 h-5" />
          </div>
        )}

        {/* Text Input for URL */}
        <div className="relative flex-1">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <LinkIcon className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 font-medium text-xs text-slate-900 bg-white focus:ring-2 focus:ring-[#1352D0]/20 focus:border-[#1352D0] outline-none transition-all"
          />
        </div>

        {/* File Browse Button */}
        <div className="shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Browse Computer</span>
              </>
            )}
          </button>
        </div>
      </div>

      {helpText && <p className="text-[11px] text-slate-500 font-medium">{helpText}</p>}

      {msg && (
        <div className={`text-xs font-bold flex items-center space-x-1.5 ${msg.includes('success') ? 'text-emerald-600' : 'text-red-600'}`}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{msg}</span>
        </div>
      )}
    </div>
  );
};
