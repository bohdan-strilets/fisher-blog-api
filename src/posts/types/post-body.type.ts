export type PostBodyType = {
  id: string;
  type: 'title' | 'paragraph' | 'image' | 'video' | 'line' | 'indent' | 'list' | 'link' | 'comment';
  content: string;
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
  url?: string;
  color?: string;
  background?: string;
  size?: 'small' | 'medium' | 'large';
  lineType?: 'solid' | 'dotted' | 'dashed' | 'double';
  listType?: 'marked' | 'numbered';
  listItems?: string[];
  videoSize?: number;
};
