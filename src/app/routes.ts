import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HelpScreenComponent } from './help-screen/help-screen.component';

const routeConfig: Routes = [
    {
      path: '',
      component: AppComponent,
      title: 'Home page'
    },
    {
      path: 'help-screen',
      component: HelpScreenComponent,
      title: 'Help Screen'
    }
  ];
  
  export default routeConfig;