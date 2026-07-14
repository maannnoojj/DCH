export type ToolCategory = 'pdf' | 'image' | 'document';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string; // Lucide icon name
  badge?: string;
  requiresOptions?: boolean;
}

export interface ActiveToolState {
  tool: Tool;
  files: File[];
  progress: number; // 0 to 100
  status: 'idle' | 'uploading' | 'processing' | 'ready' | 'error';
  statusMessage: string;
  resultUrl?: string;
  resultFileName?: string;
  options?: any;
}

export interface SignatureConfig {
  x: number;
  y: number;
  page: number;
  width: number;
  height: number;
  imageUri?: string;
}
