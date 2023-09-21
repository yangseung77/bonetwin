import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Statclass } from '../statclass';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StatDataService } from '../statdata.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })

@Component({
  selector: 'app-bone-calc',
  templateUrl: './bone-calc.component.html',
  styleUrls: ['./bone-calc.component.scss']
})
export class BoneCalcComponent {

  public csvData: any[] = [];
  public records: any[] = [];
  public headers: any[] = [];

  constructor(private sd: StatDataService) {}
  
  ngOnInit(): void {
    this.sd.getData().subscribe(temp => {
      let csvRecordsArray = (<string>temp).split(/\r\n|\n/);  
  
        let headersRow = this.getHeaderArray(csvRecordsArray);  
  
        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);  
        console.log(this.records)
       
      

    })
  }


  loginForm = document.getElementById("dataform");

public  data :any[] = [];

elements = ['femur_dmean_male', 
                'femur_dmean_female',
                'femur_dsd_male',
                'femur_dsd_female',
                'tibia_dmean_male',
                'tibia_dmean_female',
                'tibia_dsd_male',
                'tibia_dsd_female',
                'fibula_dmean_male',
                'fibula_dmean_female',
                'fibula_dsd_male',
                'fibula_dsd_female',
                'humerus_dmean_male',
                'humerus_dmean_female',
                'humerus_dsd_male',
                'humerus_dsd_female',
                'radius_dmean_male',
                'radius_dmean_female',
                'radius_dsd_male',
                'radius_dsd_female',
                'ulna_dmean_male',
                'ulna_dmean_female',
                'ulna_dsd_male', 
                'ulna_dsd_female',];

PofY(b0: number, b1: number, b2: number, dmean: number, dsd: number) {
    var py = 1 / (1 + Math.exp(-1 * (b0 + (b1 * dmean) + (b2 * dsd))));
    return py;
}

/*
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
*/
calc(_event?: MouseEvent){
    for (let i=0; i<24; i++) {
        let curr = document.getElementById(this.elements[i]) as HTMLInputElement;
        this.data.push(parseFloat(curr!.value));
    }
    let res = this.PofY(0.1, 0.25, 0.5, 0.6, 0.75);
    console.log(this.data);
    window.alert("Calculated Probability: " + res.toString());
}

getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {  
  let csvArr = [];  

  for (let i = 1; i < csvRecordsArray.length; i++) {  
    let curruntRecord = (<string>csvRecordsArray[i]).split(',');  
    if (curruntRecord.length == headerLength) {  
      let csvRecord: Statclass = new Statclass();  
      csvRecord.stat = curruntRecord[0].trim();  
      csvRecord.sensitivity = curruntRecord[1].trim();  
      csvRecord.specificity = curruntRecord[2].trim();  
      csvArr.push(csvRecord);  
    }  
  }  
  return csvArr;  
}  

getHeaderArray(csvRecordsArr: any) {  
  let headers = (<string>csvRecordsArr[0]).split(',');  
  let headerArray = [];  
  for (let j = 0; j < headers.length; j++) {  
    headerArray.push(headers[j]);  
  }  
  return headerArray;  
}  


}
