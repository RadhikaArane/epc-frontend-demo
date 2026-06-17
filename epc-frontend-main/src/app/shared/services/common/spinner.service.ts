import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor() { }
  private spinnerSubject = new BehaviorSubject(false);
  public spinner$ = this.spinnerSubject.asObservable();

  public showSpinner(): void {
    this.spinnerSubject.next(true);
  }

  public hideSpinner(): void {
    this.spinnerSubject.next(false);
  }
}
