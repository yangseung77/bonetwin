import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from  '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StatDataService {

  constructor(private http: HttpClient) { }

   // read in monolithic korean data
  getMono():Observable<any>{
    return this.http.get('assets/koreaMono.csv', { responseType: 'text' })
    
  }
// read in monolithic us data
  getMonoUS():Observable<any>{
    return this.http.get('assets/usMono.csv', { responseType: 'text' })
    
  }

  // read in monolithic roc data
  getMonoROC():Observable<any>{
    return this.http.get('assets/rocMono.csv', { responseType: 'text' })

  }

  // read in korean constants
  getKorea():Observable<any>{
    return this.http.get('assets/koreaconstants.csv', { responseType: 'text' })
    
  }

  // read in us constants
  getUS():Observable<any>{
    return this.http.get('assets/americaconstants.csv', { responseType: 'text' })
    
  }

  // read in roc constants
  getROC():Observable<any>{
    return this.http.get('assets/rocconstants.csv', { responseType: 'text' })

  }


}
