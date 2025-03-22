export interface ImageType {
  _id: string;
  title: string;
  description ?: string;
  imageUrl: string;
  sequence ?: number;
  uploadDate: Date;
}