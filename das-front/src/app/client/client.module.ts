import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from './services/';
import { ListClientComponent } from './list-client/';

import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    ListClientComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  providers: [
    ClientService,
  ]
})
export class ClientModule { }