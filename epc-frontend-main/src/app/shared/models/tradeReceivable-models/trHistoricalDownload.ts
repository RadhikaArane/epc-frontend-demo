export interface HistoricalDownloadResponse {
  success: boolean;
  data: HistoricalDownloadData;
}

export interface HistoricalDownloadData {
  Categories: HistoricalCategory[];
}

export interface HistoricalCategory {
  Category: string;
  SubFolders: HistoricalSubFolder[];
}

export interface HistoricalSubFolder {
  SubFolder: string;
  Files: HistoricalFile[];
}

export interface HistoricalFile {
  FileName: string;
  DisplayDate: string;
  FileSizeKb: string;
  DownloadUrl: string;
}