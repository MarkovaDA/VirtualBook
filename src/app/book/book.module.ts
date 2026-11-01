import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookRoutingModule } from './book-routing.module';
import { BookComponent } from './book.component';
import { CoverComponent } from './cover/cover.component';

@NgModule({
  imports: [
    CommonModule,
    BookRoutingModule,
    BookComponent,
    CoverComponent,
  ]
})
export class BookModule { }
