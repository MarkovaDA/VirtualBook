import { Injectable } from '@angular/core';
import { BookPage } from '../cover/cover.component';

/**
 * Loads arbitrary source text and splits it into book pages.
 * Pagination logic will be added later.
 */
@Injectable({
  providedIn: 'root',
})
export class LoadTextToBookService {
  /**
   * Converts source text into pages for the book viewer.
   * Currently returns a single page stub — real measurement-based split comes next.
   */
  load(sourceText: string, title = ''): BookPage[] {
    const text = sourceText.trim();

    if (!text) {
      return [];
    }

    return [
      {
        title,
        text,
      },
    ];
  }
}
