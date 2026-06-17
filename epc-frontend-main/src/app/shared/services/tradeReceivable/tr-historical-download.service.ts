import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment'; // Adjust path if necessary based on your folder structure
import { HttpEncSrvWrapperService } from '../common/http-enc-srv-wrapper.service'; // Adjust path if necessary
import { Observable } from 'rxjs';
import { HistoricalDownloadResponse } from '../../models/tradeReceivable-models/trHistoricalDownload';

@Injectable({
  providedIn: 'root'
})
export class TrHistoricalDownloadService {

  private apiURL = environment.apiUrl;

  httpWrapper = inject(HttpEncSrvWrapperService);

  constructor() { }

  /**
   * Fetches the complete list of historical downloads
   */
  _getHistoricalDownloads(): Observable<HistoricalDownloadResponse> {
    return this.httpWrapper.get<HistoricalDownloadResponse>(`${this.apiURL}TradeReceivable/api/historical-downloads`);
  }

  /**
   * Downloads a specific file
   */
  _downloadHistoricalFile(payload: { category: string; subFolder: string; fileName: string }): Observable<Blob> {
    return this.httpWrapper.post(
      `${this.apiURL}TradeReceivable/api/historical-downloads/download`, 
      payload, 
      { responseType: 'blob' }
    );
  }

}