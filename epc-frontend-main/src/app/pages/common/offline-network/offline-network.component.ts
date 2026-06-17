import { Component, inject } from '@angular/core';
import { NetworkService } from '../../../shared/services/common/network.service';
import { AsyncPipe } from '@angular/common'; 

@Component({
  selector: 'app-offline-network',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './offline-network.component.html',
  styleUrl: './offline-network.component.scss'
   
})
export class OfflineNetworkComponent {
  networkService = inject(NetworkService);

}
