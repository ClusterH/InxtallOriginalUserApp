import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MarchantPage } from './marchant';

@NgModule({
  declarations: [
    MarchantPage,
  ],
  imports: [
    IonicPageModule.forChild(MarchantPage),
  ],
})
export class MarchantPageModule {}
