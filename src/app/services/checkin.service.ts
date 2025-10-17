import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckInDisplay } from '../models/check-in-display';
import { environment } from 'src/environments/environment';

export interface CheckInRequest {
  vendorId: string;
  visitorId: string;
}

export interface CheckInResponse {
  isSuccess: boolean;
  errors: Array<{ errorMessage: string }>;
  message?: string;
  vendorName?: string;
  vendorId?: string;
  checkedInDateUtc?: string;
}

export interface CheckInsHistoryRequest {
  userId: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface CheckInsHistoryResponse {
  isSuccess: boolean;
  errors: Array<{ errorMessage: string }>;
  checkIns: Array<any>;
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CheckinService {
  private apiUrl = environment.lociApiBaseUrl;

  constructor(private http: HttpClient) {}

  createCheckIn(vendorId: string, visitorId: string): Observable<CheckInResponse> {
    const url = `${this.apiUrl}/CheckIns/CreateCheckIn`;
    const body: CheckInRequest = { vendorId, visitorId };

    return this.http.post<CheckInResponse>(url, body);
  }

  getUserCheckInsHistory(userId: string, pageNumber: number = 1, pageSize: number = 20): Observable<CheckInDisplay[]> {
    const url = `${this.apiUrl}/CheckIns/GetCheckInsHistory`;
    const body: CheckInsHistoryRequest = {
      userId,
      pageNumber,
      pageSize
    };

    return this.http.post<CheckInsHistoryResponse>(url, body).pipe(
      map(response => {
        if (response.isSuccess && response.checkIns) {
          return response.checkIns.map(checkIn => new CheckInDisplay(checkIn));
        }
        return [];
      })
    );
  }
}
