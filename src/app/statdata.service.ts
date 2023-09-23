import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from  '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StatDataService {

  constructor(private http: HttpClient) { }

  //getData is for femur mean female
  getData():Observable<any>{
    return this.http.get('assets/FemurMeanFemale.csv', { responseType: 'text' })
    
  }

  getFemurSDFemale():Observable<any>{
    return this.http.get('assets/FemurSDFemale.csv', { responseType: 'text' })
    
  }

  getFemurBothFemale():Observable<any>{
    return this.http.get('assets/FemurBothFemale.csv', { responseType: 'text' })
    
  }

  getKorea():Observable<any>{
    return this.http.get('assets/koreaconstants.csv', { responseType: 'text' })
    
  }

}
