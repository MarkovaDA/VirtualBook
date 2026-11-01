import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookRoutingModule } from './book-routing.module';
import { BookComponent } from './book.component';

@NgModule({
  imports: [
    CommonModule,
    BookRoutingModule,
    BookComponent,
  ]
})
export class BookModule { }
