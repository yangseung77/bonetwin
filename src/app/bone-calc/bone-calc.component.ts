import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Statclass } from '../statclass';
import { Koreaconstants } from '../koreaconstants';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StatDataService } from '../statdata.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Injectable({ providedIn: 'root' })

@Component({
  selector: 'app-bone-calc',
  templateUrl: './bone-calc.component.html',
  styleUrls: ['./bone-calc.component.scss']
})
export class BoneCalcComponent {

  public csvData: any[] = [];
  public femurMeanFemale: any[] = []; //array holds femur mean data for females
  public femurSDFemale: any[] = []; //array holds femur sd data for females
  //public headers: any[] = [];
  public koreaCon: any[] = []; //array holds constants for korea data. b0, b1, b2 are array entires 0, 1 , 2

  applyForm = new FormGroup({
    gender: new FormControl(''),
    bone: new FormControl(''),
    calcChoice: new FormControl(''),
    mean: new FormControl(''),
    sd: new FormControl(''),
  
  });

  constructor(private sd: StatDataService) {}
  
  ngOnInit(): void {
    this.sd.getData().subscribe(temp => {
      let csvRecordsArray = (<string>temp).split(/\r\n|\n/);  
  
        let headersRow = this.getHeaderArray(csvRecordsArray); 
  
        this.femurMeanFemale = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);  
        //console.log(this.femurMeanFemale)
    })

    this.sd.getFemurSDFemale().subscribe(temp => {
      let csvRecordsArray = (<string>temp).split(/\r\n|\n/);  
  
        let headersRow = this.getHeaderArray(csvRecordsArray); 
  
        this.femurSDFemale = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);  
        //console.log(this.femurSDFemale)
    })



    this.sd.getKorea().subscribe(temp => {
      let csvRecordsArray = (<string>temp).split(/\r\n|\n/);  
  
        let headersRow = this.getHeaderArray(csvRecordsArray); 
  
        this.koreaCon = this.getConstantsFromCSVFile(csvRecordsArray, headersRow.length);
        console.log(this.koreaCon[0].gender)  
        console.log(this.koreaCon)
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
    /*for (let i=0; i<24; i++) {
        let curr = document.getElementById(this.elements[i]) as HTMLInputElement;
        this.data.push(parseFloat(curr!.value));
    }*/
    let gender = this.applyForm.value.gender ?? '';
    let bone = this.applyForm.value.bone ?? '';
    let calcChoice = this.applyForm.value.calcChoice ?? '';
    let mean = Number(this.applyForm.value.mean ?? 0);
    let sd = Number(this.applyForm.value.sd ?? 0)

    //let res = this.PofY(0.1, 0.25, 0.5, 0.6, 0.75);
    let res = this.getKorCons(bone, gender, calcChoice, this.koreaCon, mean, sd)
    console.log(this.data);
    window.alert("Calculated Probability: " + res.toString());
}

getKorCons(bone: any, gender: any, choice: any, consArray: any, mean: number, sd: number) {
  let b0 : any;
  let b1 : any;
  let b2 : any;
  for (let i = 0; i < consArray.length; i++){
    if (consArray[i].gender.tolower() == gender.tolower() && consArray.bone.tolower() == bone.tolower()) {
      if (choice.tolower() == "mean"){
        b0 = (consArray[i].mean[0]);
        b1 = consArray[i].mean[1];
        b2 = consArray[i].mean[2];
      }
      else if (choice.tolower() == "sd"){
          b0 = consArray[i].sd[0];
          b1 = consArray[i].sd[1];
          b2 = consArray[i].sd[2];
      }
      else if (choice.tolower() == "both"){
        b0 = consArray[i].both[0];
        b1 = consArray[i].both[1];
        b2 = consArray[i].both[2];
    }
        
    }
    
  }
  let prob = this.PofY(Number(b0), Number(b1), Number(b2), mean, sd);
  return prob;
}




// this function creates an array of objects that holds stat data for bones
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

//this functions creates an array of objects that holds the korean constant data
getConstantsFromCSVFile(csvRecordsArray: any, headerLength: any) {  
  let csvArr = [];  

  for (let i = 1; i < csvRecordsArray.length; i++) {  
    let curruntRecord = (<string>csvRecordsArray[i]).split(',');  
    if (curruntRecord.length == headerLength) {  
      let csvRecord: Koreaconstants = new Koreaconstants();  
      csvRecord.bone = curruntRecord[0].trim();  
      csvRecord.gender = curruntRecord[1].trim();  
      csvRecord.mean[0] = curruntRecord[2].trim();
      csvRecord.mean[1] = curruntRecord[3].trim();
      csvRecord.mean[2] = curruntRecord[4].trim();
      csvRecord.sd[0] = curruntRecord[5].trim();
      csvRecord.sd[1] = curruntRecord[6].trim();
      csvRecord.sd[2] = curruntRecord[7].trim();
      csvRecord.both[0] = curruntRecord[8].trim();
      csvRecord.both[1] = curruntRecord[9].trim();
      csvRecord.both[2] = curruntRecord[10].trim();


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
