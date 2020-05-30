import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BookingConformationPage } from './booking-conformation';

@NgModule({
  declarations: [
    BookingConformationPage,
  ],
  imports: [
    IonicPageModule.forChild(BookingConformationPage),
  ],
})
export class BookingConformationPageModule {}
