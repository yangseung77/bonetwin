import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Statclass } from '../statclass';
import { Koreaconstants } from '../koreaconstants';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StatDataService } from '../statdata.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Superstats } from '../superstats';
import { Koreamonostats } from '../koreamonostats';
import { formatCurrency } from '@angular/common';

@Injectable({ providedIn: 'root' })

@Component({
  selector: 'app-bone-calc',
  templateUrl: './bone-calc.component.html',
  styleUrls: ['./bone-calc.component.scss']
})
export class BoneCalcComponent {

 // public csvData: any[] = [];
  public femurMeanFemale: any[] = []; //array holds femur mean data for females
  public femurSDFemale: any[] = []; //array holds femur sd data for females
  //public headers: any[] = [];
  public koreaCon: any[] = []; //array holds constants for korea data. b0, b1, b2 are array entires 0, 1 , 2
  public boneDataArr: any[] = []; //this will holds bone data arrays
  public superArr: any[] = [];
  //public monoData: any[] = []; //array holds monolithic data

  public boneDataArrMono: any[] = []; //this will holds bone data arrays for monolithic data

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
        //this.boneDataArr.push(this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length));
        let tempSuper: Superstats = new Superstats();
        tempSuper.headerData = headersRow;
        tempSuper.boneStats  = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
        this.boneDataArr.push(tempSuper)
        //console.log(this.femurMeanFemale)
    })

    this.sd.getFemurSDFemale().subscribe(temp => {
      let csvRecordsArray = (<string>temp).split(/\r\n|\n/);  
  
        let headersRow = this.getHeaderArray(csvRecordsArray); 
  
        this.femurSDFemale = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
        //this.boneDataArr.push(this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length)) 
        let tempSuper: Superstats = new Superstats();
        tempSuper.headerData = headersRow;
        tempSuper.boneStats  = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
        this.boneDataArr.push(tempSuper) 
        //console.log(this.femurSDFemale)
        console.log(this.boneDataArr[0].headerData[0])
    })

    this.sd.getFemurBothFemale().subscribe(temp => {
      let csvRecordsArray = (<string>temp).split(/\r\n|\n/);  
  
        let headersRow = this.getHeaderArray(csvRecordsArray); 
  
        //this.femurSDFemale = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
        //this.boneDataArr.push(this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length)) 
        let tempSuper: Superstats = new Superstats();
        tempSuper.headerData = headersRow;
        tempSuper.boneStats  = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
        this.boneDataArr.push(tempSuper) 
        //console.log(this.femurSDFemale)
    })

    //this gets monolithic data
    this.sd.getMono().subscribe(temp => {
      let csvRecordsArray = (<string>temp).split(/\r\n|\n/);  
  
        let headersRow = this.getHeaderArray(csvRecordsArray); 
        this.boneDataArrMono = this.getMonoRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
        //this.boneDataArrMono.push(tempSuper) 
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
//_event?: MouseEvent
calc(){
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
   // let stat = this.getStatValue(this.boneDataArr, gender, bone, calcChoice, res) //this is single file version
    let stat = this.getStatValueMono(this.boneDataArrMono, gender, bone, calcChoice, res) //this is for monodata
    console.log(this.data);
    window.alert("Calculated Probability: " + res.toString() + "\n" + stat);
    this.applyForm.reset();
}

getKorCons(bone: any, gender: any, choice: any, consArray: any, mean: number, sd: number) {
  let b0 : any;
  let b1 : any;
  let b2 : any;
  for (let i = 0; i < consArray.length; i++){
    if (consArray[i].gender == gender && consArray[i].bone == bone) {
      if (choice == "mean"){
        b0 = (consArray[i].mean[0]);
        b1 = consArray[i].mean[1];
        b2 = consArray[i].mean[2];
      }
      else if (choice == "sd"){
          b0 = consArray[i].sd[0];
          b1 = consArray[i].sd[1];
          b2 = consArray[i].sd[2];
      }
      else if (choice == "both"){
        b0 = consArray[i].both[0];
        b1 = consArray[i].both[1];
        b2 = consArray[i].both[2];
    }
        
    }
    
  }
  console.log(b0 + b1 + b2);
  let prob = this.PofY(Number(b0), Number(b1), Number(b2), mean, sd);
  return prob;
}

//bone gender type header data bone stats
//this version is the one that used individual stat data files
getStatValue(statArr: any, gender: any, bone: any, choice: any, prob: number){
  let closest: number;
  let data: string = '';
  let decimal : number;
  for (let i = 0; i < statArr.length; i++){
    if (statArr[i].headerData[1] == gender && statArr[i].headerData[0] == bone && statArr[i].headerData[2] == choice) {
    decimal = Number(prob.toFixed(7))
    //console.log(statArr[i].boneStats)
    closest = this.closestIndex(decimal, statArr[i].boneStats);
      data = "stat value: " + statArr[i].boneStats[closest].stat + " sensitivity: " + statArr[i].boneStats[closest].sensitivity + " specificity " + statArr[i].boneStats[closest].specificity;

    }
  }

  return data;
}

//this version uses monolithic data
getStatValueMono(statArr: any, gender: any, bone: any, choice: any, prob: number){
  let closest: number = -9999;
  let data: string = '';
  let decimal : number;
  var tempArr : any[] = [];
  let tempData : Koreamonostats = new Koreamonostats();
  //get data you need from monolithic set
  //console.log (bone + gender + choice )
  for (let i = 0; i < statArr.length; i++){
    if (statArr[i].bone == bone && statArr[i].gender == gender && statArr[i].type == choice){
      console.log(statArr[i].bone)
      tempArr.push(statArr[i])
    }
  }


  //for (let i = 0; i < tempArr.length; i++){
    //if (statArr[i].headerData[1] == gender && statArr[i].headerData[0] == bone && statArr[i].headerData[2] == choice) {
    decimal = Number(prob.toFixed(7))
    //console.log(statArr[i].boneStats)
    closest = this.closestIndexMono(decimal, tempArr);
      data = "stat value: " + tempArr[closest].prob + " sensitivity: " + tempArr[closest].sensitivity + " specificity " + tempArr[closest].specificity;

    //}
  

  return data;
}


// this function creates an array of objects that holds stat data for bones single file version
getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {  
  let csvArr = [];  
//bone gender type
  for (let i = 1; i < csvRecordsArray.length; i++) {  
    let curruntRecord = (<string>csvRecordsArray[i]).split(',');  
    if (curruntRecord.length == headerLength) {  
      let csvRecord: Statclass = new Statclass();  
      //csvRecord.bone = curruntRecord[0].trim();
      //csvRecord.gender = curruntRecord[1].trim();
     //csvRecord.type = curruntRecord[2].trim();
      csvRecord.stat = curruntRecord[0].trim();  
      csvRecord.sensitivity = curruntRecord[1].trim();  
      csvRecord.specificity = curruntRecord[2].trim();  
      csvArr.push(csvRecord);  
    }  
  }  
  return csvArr;  
}  

//This creates records array from monolithic data
getMonoRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {  
  let csvArr = [];  
//bone gender type
  for (let i = 1; i < csvRecordsArray.length; i++) {  
    let curruntRecord = (<string>csvRecordsArray[i]).split(',');  
    if (curruntRecord.length == headerLength) {  
      let csvRecord1: Koreamonostats = new Koreamonostats();  
      csvRecord1.bone = curruntRecord[0].trim();
      csvRecord1.gender = curruntRecord[1].trim();
     csvRecord1.type = curruntRecord[2].trim();
      csvRecord1.prob = curruntRecord[3].trim();  
      csvRecord1.sensitivity = curruntRecord[4].trim();  
      csvRecord1.specificity = curruntRecord[5].trim();  
      csvArr.push(csvRecord1);  
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

//this is single file version
closestIndex = (num:number, arr:any) => {
  //console.log(num)
  let curr = Number(arr[0].stat)
  //console.log(arr[0].stat)
  //console.log(curr) 
  let diff = Math.abs(num - curr);
  console.log(diff)
  let index = 0;
  for (let val = 0; val < arr.length; val++) {
     let newdiff = Math.abs(Number(num) - Number(arr[val].stat));
     console.log(newdiff)
     if (newdiff < diff) {
        diff = newdiff;
        curr = Number(arr[val].stat);
        index = val;
     };
  };
  return index;
}

//this is monolithic version
closestIndexMono = (num:number, arr:any) => {
  //console.log(num)
  let curr = Number(arr[0].prob)
  //console.log(arr[0].stat)
  //console.log(curr) 
  let diff = Math.abs(num - curr);
  console.log(diff)
  let index = 0;
  for (let val = 0; val < arr.length; val++) {
     let newdiff = Math.abs(Number(num) - Number(arr[val].prob));
     console.log(newdiff)
     if (newdiff < diff) {
        diff = newdiff;
        curr = Number(arr[val].prob);
        index = val;
     };
  };
  return index;
}


/*
// Returns element closest to target in arr[]
findClosest(arr:any, target:any)
{
    let n = arr.length;
 
    // Corner cases
    if (target <= arr[0])
        return arr[0];
    if (target >= arr[n - 1])
        return arr[n - 1];
 
    // Doing binary search
    let i = 0, j = n, mid = 0;
    while (i < j)
    {
        mid = (i + j) / 2;
 
        if (arr[mid] == target)
            return arr[mid];
 
        // If target is less than array
        // element,then search in left
        if (target < arr[mid])
        {
      
            // If target is greater than previous
            // to mid, return closest of two
            if (mid > 0 && target > arr[mid - 1])
                return this.getClosest(arr[mid - 1],
                                  arr[mid], target);
               
            // Repeat for left half
            j = mid;             
        }
 
        // If target is greater than mid
        else
        {
            if (mid < n - 1 && target < arr[mid + 1])
                return this.getClosest(arr[mid],
                                  arr[mid + 1],
                                  target);               
            i = mid + 1; // update i
        }
    }
 
    // Only single element left after search
    return arr[mid];
  
}
 
// Method to compare which one is the more close
// We find the closest by taking the difference
//  between the target and both values. It assumes
// that val2 is greater than val1 and target lies
// between these two.
getClosest(val1:any, val2:any, target:any)
{
    if (target - val1 >= val2 - target)
        return val2;       
    else
        return val1;       
}
 */

}
