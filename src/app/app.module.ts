import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoneCalcComponent } from './bone-calc/bone-calc.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HelpScreenComponent } from './help/help.component';
import { RouterModule } from '@angular/router';
import { NgxImageZoomModule } from 'ngx-image-zoom';



@NgModule({
  declarations: [
    AppComponent,
    BoneCalcComponent,
    HelpScreenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgxImageZoomModule
    
  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
