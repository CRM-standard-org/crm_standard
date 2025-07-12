export interface blobToFile extends File {
  index: string;
  id: string;
  status: string;
  imageURL: string;
  url: string;
  file_url: string;
  error: boolean;
  file_name?: string;
  file_type?: string;
  file_size?: string;
}
