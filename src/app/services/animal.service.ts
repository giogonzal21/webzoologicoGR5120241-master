import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  apiUri = '/api/animals';

  constructor(private http: HttpClient) { }

  getAllAnimalsData(): Observable<any> {

    return this.http.get(this.apiUri, {
      headers:
      {
        'Content-Type': 'application/json'
      }
    });
  }

  newAnimal(token: any, data: any): Observable<any> {
    return this.http.post<any>(
      this.apiUri,
      data,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  }

  updateAnimal(token: any, id: any, data: any): Observable<any> {
    console.log(data)
    return this.http.put<any>(
      this.apiUri + '/' + id,
      data,
      { headers: {
        'Content-Type': 'application/json'
      } });
  }

  getOneAnimal(token: any, id: any): Observable<any> {
    return this.http.get<any>(
      this.apiUri + '/' + id,
      { headers: {
        'Content-Type': 'application/json'
      } });
  }

  deleteAnimal(token: any, id: any) {
    return this.http.delete<any>(
      this.apiUri + "/" + id,
      { headers: {
        'Content-Type': 'application/json'
      } });
  }

}
