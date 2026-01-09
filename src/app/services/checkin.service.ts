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

export interface CommunityCheckInRequest {
  networkId: string;
  visitorId: string;
}

export interface CommunityCheckInResponse {
  isSuccess: boolean;
  errors: Array<{ errorMessage: string }>;
  message?: string;
  networkName?: string;
  networkId?: string;
  checkedInDateUtc?: string;
}

export interface GetCommunityCheckInsRequest {
  networkId: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface CommunityCheckInDisplayItem {
  id: string;
  visitorId: string;
  visitorName: string;
  visitorAvatarUrl: string;
  visitorBorderColor: string;
  checkedInDateUtc: string;
}

export interface GetCommunityCheckInsResponse {
  isSuccess: boolean;
  errors: Array<{ errorMessage: string }>;
  checkIns: CommunityCheckInDisplayItem[];
  totalCount: number;
}

export interface ClearCommunityCheckInsRequest {
  networkId: string;
  vendorId: string;
}

export interface ClearCommunityCheckInsResponse {
  isSuccess: boolean;
  errors: Array<{ errorMessage: string }>;
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

  createCommunityCheckIn(networkId: string, visitorId: string): Observable<CommunityCheckInResponse> {
    const url = `${this.apiUrl}/CheckIns/CreateCommunityCheckIn`;
    const body: CommunityCheckInRequest = { networkId, visitorId };

    return this.http.post<CommunityCheckInResponse>(url, body);
  }

  getCommunityCheckIns(networkId: string, pageNumber: number = 1, pageSize: number = 20): Observable<GetCommunityCheckInsResponse> {
    const url = `${this.apiUrl}/CheckIns/GetCommunityCheckIns`;
    const body: GetCommunityCheckInsRequest = {
      networkId,
      pageNumber,
      pageSize
    };

    return this.http.post<GetCommunityCheckInsResponse>(url, body);
  }

  clearCommunityCheckIns(networkId: string, vendorId: string): Observable<ClearCommunityCheckInsResponse> {
    const url = `${this.apiUrl}/CheckIns/ClearCommunityCheckIns`;
    const body: ClearCommunityCheckInsRequest = { networkId, vendorId };

    return this.http.post<ClearCommunityCheckInsResponse>(url, body);
  }
}
