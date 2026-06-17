export type uploadLogs = logs[]

export interface logs {
  EmployeeId: string
  Name: string
  Designation: string
  TableName: string
  RecordsInserted: number
  UploadedAt: string
}
