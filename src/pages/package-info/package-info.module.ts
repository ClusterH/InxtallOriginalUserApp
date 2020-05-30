import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PackageInfoPage } from './package-info';

@NgModule({
  declarations: [
    PackageInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(PackageInfoPage),
  ],
})
export class PackageInfoPageModule {}
