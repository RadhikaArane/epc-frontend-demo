export interface Fixassetmodel {
  Id: number
  Name: string
  Location: string;
  StartDate: string
  EndDate: string
  IsActive: boolean
}



export class FixassetCreatePayload {
  Name: string;
  StartDate: string;
  EndDate: string;

  constructor() {
    this.Name = '';
    this.StartDate = '';
    this.EndDate = '';
  }
}
