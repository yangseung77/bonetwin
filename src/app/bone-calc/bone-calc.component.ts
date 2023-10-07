import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Koreaconstants } from '../koreaconstants';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StatDataService } from '../statdata.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Koreamonostats } from '../koreamonostats';
import { formatCurrency } from '@angular/common';
import { HelpScreenComponent } from '../help/help.component';
import { RouterModule } from '@angular/router';

@Injectable({ providedIn: 'root' })

@Component({
  selector: 'app-bone-calc',
  templateUrl: './bone-calc.component.html',
  styleUrls: ['./bone-calc.component.scss']
})
export class BoneCalcComponent {

 
  calculationResult: string = ''; // Property to store the calculation result
  
  public koreaCon: any[] = []; //array holds constants for korea data. b0, b1, b2 are array entires 0, 1 , 2
  public americaCon: any[] = []; //array holds constants for american data. b0, b1, b2 are array entires 0, 1 , 2

  public selectedImage: string = '';

  public boneDataArrMono: any[] = []; //this will holds bone data arrays for monolithic data
  public boneDataArrMonoUS: any[] = []; //this will holds bone data arrays for monolithic data for american data


  public selectedOption = ""; // This stores what option (mean, sd, both) was chosen.

  applyForm = new FormGroup({
    population: new FormControl(''),
    gender: new FormControl(''),
    bone: new FormControl(''),
    calcChoice: new FormControl(''),
    mean: new FormControl(''),
    sd: new FormControl(''),
  
  });

  constructor(private sd: StatDataService) {}
  
  ngOnInit(): void {



    //this gets monolithic data for korea
    this.sd.getMono().subscribe(temp => {
      let csvRecordsArray = (<string>temp).split(/\r\n|\n/);  
  
        let headersRow = this.getHeaderArray(csvRecordsArray); 
        this.boneDataArrMono = this.getMonoRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
        //this.boneDataArrMono.push(tempSuper) 
        //console.log(this.femurSDFemale)
    })

    // get mono data for us
    this.sd.getMonoUS().subscribe(temp => {
      let csvRecordsArray = (<string>temp).split(/\r\n|\n/);  
  
        let headersRow = this.getHeaderArray(csvRecordsArray); 
        this.boneDataArrMonoUS = this.getMonoRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
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

    //this gets american constants
    this.sd.getUS().subscribe(temp => {
      let csvRecordsArray = (<string>temp).split(/\r\n|\n/);  
  
        let headersRow = this.getHeaderArray(csvRecordsArray); 
  
        this.americaCon = this.getConstantsFromCSVFile(csvRecordsArray, headersRow.length);
        //console.log(this.koreaCon[0].gender)  
        //console.log(this.koreaCon)
    })





  }


// this function calculates the probability
PofY(b0: number, b1: number, b2: number, dmean: number, dsd: number) {
    var py = 1 / (1 + Math.exp(-1 * (b0 + (b1 * dmean) + (b2 * dsd))));
    return py;
}


//this function will reset page data
reset(): void {
  this.applyForm.reset();
  this.selectedImage = '';
  this.calculationResult = '';
}


//This function calculates stat data
calc(){
    /*for (let i=0; i<24; i++) {
        let curr = document.getElementById(this.elements[i]) as HTMLInputElement;
        this.data.push(parseFloat(curr!.value));
    }*/
    let population = this.applyForm.value.population ?? '';
    let gender = this.applyForm.value.gender ?? '';
    let bone = this.applyForm.value.bone ?? '';
    let calcChoice = this.applyForm.value.calcChoice ?? '';
    let mean = Number(this.applyForm.value.mean ?? 0);
    let sd = Number(this.applyForm.value.sd ?? 0)

    if (this.applyForm.value.calcChoice == "mean"){
      sd = 0;
    }

    if (this.applyForm.value.calcChoice == "sd"){
      mean = 0;
  }

    console.log(mean);
    console.log(sd);


    //let res = this.PofY(0.1, 0.25, 0.5, 0.6, 0.75);
    if (population == "korean") {
      let res = this.getKorCons(bone, gender, calcChoice, this.koreaCon, mean, sd)
   // let stat = this.getStatValue(this.boneDataArr, gender, bone, calcChoice, res) //this is single file version
      let stat = this.getStatValueMono(this.boneDataArrMono, gender, bone, calcChoice, res) //this is for monodata
     // console.log(this.data);
      this.calculationResult = `Calculated Probability: ${res.toString()} \n${stat}`;
      window.alert("Calculated Probability: " + res.toString() + "\n" + stat);
    }

    else {
      let res = this.getKorCons(bone, gender, calcChoice, this.americaCon, mean, sd)
   // let stat = this.getStatValue(this.boneDataArr, gender, bone, calcChoice, res) //this is single file version
      let stat = this.getStatValueMono(this.boneDataArrMonoUS, gender, bone, calcChoice, res) //this is for monodata
     // console.log(this.data);
      this.calculationResult = `Calculated Probability: ${res.toString()} \n${stat}`;
      window.alert("Calculated Probability: " + res.toString() + "\n" + stat);
    }
    //window.alert("Calculated Probability: " + res.toString() + "\n" + stat);
    //this.applyForm.reset();
}

//This function gets the constants needed for both american and korean data
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
  //console.log(b0 + b1 + b2);
  let prob = this.PofY(Number(b0), Number(b1), Number(b2), mean, sd);
  prob = Number(prob.toFixed(7))
  return prob;
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
      //console.log(statArr[i].bone)
      tempArr.push(statArr[i])
    }
  }


  //for (let i = 0; i < tempArr.length; i++){
    //if (statArr[i].headerData[1] == gender && statArr[i].headerData[0] == bone && statArr[i].headerData[2] == choice) {
    decimal = Number(prob.toFixed(7))
    //console.log(statArr[i].boneStats)
    closest = this.closestIndexMono(decimal, tempArr);
      data = "Stat value: " + tempArr[closest].prob + "\n" + "Sensitivity: " + tempArr[closest].sensitivity + "\n" + "Specificity " + tempArr[closest].specificity;

    //}
  

  return data;
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

// this function will create an array of header data from a csv file
getHeaderArray(csvRecordsArr: any) {  
  let headers = (<string>csvRecordsArr[0]).split(',');  
  let headerArray = [];  
  for (let j = 0; j < headers.length; j++) {  
    headerArray.push(headers[j]);  
  }  
  return headerArray;  
} 



//this is monolithic version that finds the closest index of the calculated stat value to the one stored in the csv
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

// this function selects the correct auc chart to be displayed based on user input
onOptionChange(event: Event) {
  const selectedOption = this.applyForm.value.bone;
  const population = this.applyForm.value.population;
  const gender = this.applyForm.value.gender;

  // Logic to determine the image source based on the selected option
  // Update selectedImage accordingly
  //use this.applyForm.value.gender hint
  const imageMappings: { [key: string]: string } = {
    // Korean Male
    'femur_korean_male': 'assets/AocPictures/KMalFemurAoc.png',
    'fibula_korean_male': 'assets/AocPictures/KMalFibulaAoc.png',
    'tibia_korean_male': 'assets/AocPictures/KMalTibiaAoc.png',
    'humerus_korean_male': 'assets/AocPictures/KMalHumerusAoc.png',
    'ulna_korean_male': 'assets/AocPictures/KMalUlnaAoc.png',
    'radius_korean_male': 'assets/AocPictures/KMalRadiusAoc.png',

    // Korean Female
    'femur_korean_female': 'assets/AocPictures/KFemFemurAoc.png',
    'fibula_korean_female': 'assets/AocPictures/KFemFibulaAoc.png',
    'tibia_korean_female': 'assets/AocPictures/KFemTibiaAoc.png',
    'humerus_korean_female': 'assets/AocPictures/KFemHumerusAoc.png',
    'ulna_korean_female': 'assets/AocPictures/KFemUlnaAoc.png',
    'radius_korean_female': 'assets/AocPictures/KFemRadiusAoc.png',
    
    // American Male
    'femur_american_male': 'assets/AocPictures/UMalFemurAoc.png',
    'fibula_american_male': 'assets/AocPictures/UMalFibulaAoc.png',
    'tibia_american_male': 'assets/AocPictures/UMalTibiaAoc.png',
    'humerus_american_male': 'assets/AocPictures/UMalHumerusAoc.png',
    'ulna_american_male': 'assets/AocPictures/UMalUlnaAoc.png',
    'radius_american_male': 'assets/AocPictures/UMalRadiusAoc.png',

    // American Female
    'femur_american_female': 'assets/AocPictures/UFemFemurAoc.png',
    'fibula_american_female': 'assets/AocPictures/UFemFibulaAoc.png',
    'tibia_american_female': 'assets/AocPictures/UFemTibiaAoc.png',
    'humerus_american_female': 'assets/AocPictures/UFemHumerusAoc.png',
    'ulna_american_female': 'assets/AocPictures/UFemUlnaAoc.png',
    'radius_american_female': 'assets/AocPictures/UFemRadiusAoc.png',
  };
  const key = `${selectedOption}_${population}_${gender}`;
  this.selectedImage = imageMappings[key];
}



}
