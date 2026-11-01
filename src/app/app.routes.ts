import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'book',
    loadChildren: () => import('./book/book.module').then((m) => m.BookModule)
  },
  { path: '', redirectTo: 'book', pathMatch: 'full' }
];
