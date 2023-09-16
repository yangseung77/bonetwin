import { Component } from '@angular/core';

@Component({
  selector: 'app-bone-calc',
  templateUrl: './bone-calc.component.html',
  styleUrls: ['./bone-calc.component.scss']
})
export class BoneCalcComponent {


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
    for (let i=0; i<24; i++) {
        let curr = document.getElementById(elements[i]);
        this.data.push(parseFloat(curr.value));
    }
    let res = PofY(0.1, 0.25, 0.5, 0.6, 0.75);
    console.log(data);
    window.alert("Calculated Probability: " + res.toString());
}); */


}
