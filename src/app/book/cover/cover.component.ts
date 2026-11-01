import { Component, Input } from '@angular/core';

export interface BookPage {
  title: string;
  text: string;
}

type FlipDirection = 'forward' | 'back';

@Component({
  selector: 'app-cover',
  imports: [],
  templateUrl: './cover.component.html',
  styleUrl: './cover.component.css'
})
export class CoverComponent {
  @Input() pages: BookPage[] = [];

  spreadIndex = 0;
  flipping = false;
  flipDirection: FlipDirection | null = null;
  leafTurned = false;

  private pointerStartX: number | null = null;
  private pointerStartY: number | null = null;

  get spreadCount(): number {
    return Math.max(1, Math.ceil(this.pages.length / 2));
  }

  get canGoForward(): boolean {
    return this.spreadIndex < this.spreadCount - 1;
  }

  get canGoBack(): boolean {
    return this.spreadIndex > 0;
  }

  get leftPage(): BookPage | null {
    return this.pageAt(this.spreadIndex * 2);
  }

  get rightPage(): BookPage | null {
    return this.pageAt(this.spreadIndex * 2 + 1);
  }

  get nextLeftPage(): BookPage | null {
    return this.pageAt((this.spreadIndex + 1) * 2);
  }

  get nextRightPage(): BookPage | null {
    return this.pageAt((this.spreadIndex + 1) * 2 + 1);
  }

  get prevLeftPage(): BookPage | null {
    return this.pageAt((this.spreadIndex - 1) * 2);
  }

  get prevRightPage(): BookPage | null {
    return this.pageAt((this.spreadIndex - 1) * 2 + 1);
  }

  /** Base left page while animating */
  get baseLeft(): BookPage | null {
    if (this.flipping && this.flipDirection === 'back') {
      return this.prevLeftPage;
    }
    return this.leftPage;
  }

  /** Base right page while animating */
  get baseRight(): BookPage | null {
    if (this.flipping && this.flipDirection === 'forward') {
      return this.nextRightPage;
    }
    return this.rightPage;
  }

  get leafFront(): BookPage | null {
    return this.flipDirection === 'back' ? this.leftPage : this.rightPage;
  }

  get leafBack(): BookPage | null {
    return this.flipDirection === 'back' ? this.prevRightPage : this.nextLeftPage;
  }

  onPointerDown(event: PointerEvent): void {
    if (this.flipping || event.button !== 0) {
      return;
    }
    this.pointerStartX = event.clientX;
    this.pointerStartY = event.clientY;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  onPointerUp(event: PointerEvent): void {
    if (this.flipping || this.pointerStartX === null || this.pointerStartY === null) {
      this.pointerStartX = null;
      this.pointerStartY = null;
      return;
    }

    const dx = event.clientX - this.pointerStartX;
    const dy = event.clientY - this.pointerStartY;
    this.pointerStartX = null;
    this.pointerStartY = null;

    if (Math.abs(dx) < 12 && Math.abs(dy) < 12) {
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const ratio = (event.clientX - rect.left) / rect.width;
      if (ratio >= 0.55) {
        this.flipForward();
      } else if (ratio <= 0.45) {
        this.flipBack();
      }
      return;
    }

    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) {
      return;
    }

    if (dx < 0) {
      this.flipForward();
    } else {
      this.flipBack();
    }
  }

  onPointerCancel(): void {
    this.pointerStartX = null;
    this.pointerStartY = null;
  }

  onLeafTransitionEnd(event: TransitionEvent): void {
    if (!this.flipping || event.propertyName !== 'transform') {
      return;
    }
    if (event.target !== event.currentTarget) {
      return;
    }

    if (this.flipDirection === 'forward') {
      this.spreadIndex += 1;
    } else if (this.flipDirection === 'back') {
      this.spreadIndex -= 1;
    }

    this.flipping = false;
    this.flipDirection = null;
    this.leafTurned = false;
  }

  flipForward(): void {
    if (this.flipping || !this.canGoForward) {
      return;
    }
    this.startFlip('forward');
  }

  flipBack(): void {
    if (this.flipping || !this.canGoBack) {
      return;
    }
    this.startFlip('back');
  }

  private startFlip(direction: FlipDirection): void {
    this.flipping = true;
    this.flipDirection = direction;
    this.leafTurned = false;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.leafTurned = true;
      });
    });
  }

  private pageAt(index: number): BookPage | null {
    if (index < 0 || index >= this.pages.length) {
      return null;
    }
    return this.pages[index];
  }
}
