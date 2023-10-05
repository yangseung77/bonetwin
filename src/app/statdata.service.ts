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

  getMono():Observable<any>{
    return this.http.get('assets/koreaMono.csv', { responseType: 'text' })
    
  }
//monolithic us data
  getMonoUS():Observable<any>{
    return this.http.get('assets/usMono.csv', { responseType: 'text' })
    
  }

  getKorea():Observable<any>{
    return this.http.get('assets/koreaconstants.csv', { responseType: 'text' })
    
  }

  getUS():Observable<any>{
    return this.http.get('assets/americaconstants.csv', { responseType: 'text' })
    
  }

}
