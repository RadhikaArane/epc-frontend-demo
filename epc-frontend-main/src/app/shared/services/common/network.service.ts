import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, merge, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private online$ = new BehaviorSubject<boolean>(navigator.onLine);

  constructor() {
    merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(map(() => true)),
      fromEvent(window, 'offline').pipe(map(() => false))
    ).subscribe(status => this.online$.next(status));
  }

  get isOnline$() {
    return this.online$.asObservable();
  }
}
