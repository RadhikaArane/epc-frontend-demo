import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';  
import { EpcLoaderService } from './shared/services/common/epc-loader.service';
import { EpcLoaderComponent } from "./pages/common/epc-loader/epc-loader.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EpcLoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'mahindraAgriBusiness';

  epcLoaderService = inject(EpcLoaderService);

}
