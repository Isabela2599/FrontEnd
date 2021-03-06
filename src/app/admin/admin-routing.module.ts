import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerifyComponent } from './verify/verify.component';
import { VerifyChargesComponent } from './verify-charges/verify-charges.component';
import { VerifiedListComponent } from './verified-list/verified-list.component';

const routes: Routes = [
  { path: 'verifyUser', component: VerifyComponent},
  { path: 'verifyCharges', component: VerifyChargesComponent},
  { path: 'verifiedList', component: VerifiedListComponent},

];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
