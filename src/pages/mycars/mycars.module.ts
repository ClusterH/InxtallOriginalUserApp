import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MycarsPage } from './mycars';

@NgModule({
  declarations: [
    MycarsPage,
  ],
  imports: [
    IonicPageModule.forChild(MycarsPage),
  ],
})
export class MycarsPageModule {}
