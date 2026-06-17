import { Component, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpinnerService } from '../../../shared/services/common/spinner.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {
  private subscription?: Subscription;
  public showSpinner: boolean = false;
  private spinnerSrv = inject(SpinnerService)
  constructor() { }

  ngOnInit(): void {
    this.subscription = this.spinnerSrv.spinner$.subscribe((showSpinner) => {
      this.showSpinner = showSpinner;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
