import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoneCalcComponent } from './bone-calc/bone-calc.component';
import { HelpScreenComponent } from './help/help.component';

const routes: Routes = [
  {
    path: '',
    component: BoneCalcComponent,
    
  },

  {
    path: 'home',
    component: BoneCalcComponent,
    
  },

  {
    path: 'help',
    component: HelpScreenComponent,
   
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
