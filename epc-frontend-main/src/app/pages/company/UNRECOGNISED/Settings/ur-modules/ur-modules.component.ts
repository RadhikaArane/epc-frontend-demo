// import { Component, signal, OnInit, inject } from '@angular/core'; 
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
// import { breadCrumbItems } from './../../../../../shared/models/models';
// import { ActivatedRoute } from '@angular/router';

// interface RoleFeature {
//   id: number;
//   name: string;
//   isActive: boolean;
//   subFeatures?: RoleFeature[];
// }

// interface Role {
//   id: number;
//   name: string;
//   isEnabled: boolean;
//   features: RoleFeature[];
// }

// @Component({
//   selector: 'app-ur-modules',
//   standalone: true,
//   imports: [CommonModule, FormsModule, BreadcrumbsComponent],
//   templateUrl: './ur-modules.component.html',
//   styleUrl: './ur-modules.component.scss'
// })
// export class UrModulesComponent implements OnInit {

//   private route = inject(ActivatedRoute);
//   breadCrumbItems = signal<breadCrumbItems[]>([]);
//   selectedRoleId: number = 1; 
//   currentRole: Role | undefined;
//   currentProjectTitle: string = '';
//   activeRoles: Role[] = [];

//   // Master Data
  
//   roles: Role[] = [
//     {
//       id: 1,
//       name: 'Unrecognised Invoices',
//       isEnabled: false, 
//       features: [
//         { id: 101, name: 'Pan India Summary', isActive: false },
//         { id: 102, name: 'State-Wise Stage Summary', isActive: false },
//         { id: 103, name: 'Area-Wise Aging', isActive: false },
//       ]
//     },
//     {
//       id: 2,
//       name: 'Consignment Stock',
//       isEnabled: false,
//       features: [
//         { id: 201, name: 'Pan India Summary', isActive: false },
//         { id: 202, name: 'State-Wise Stage Summary', isActive: false },
//         { id: 203, name: 'Area-Wise Aging', isActive: false },
//       ]
//     },
//     {
//       id: 3,
//       name: 'Manage Data',
//       isEnabled: false,
//       features: [
//         { id: 301, name: 'Dealer Master', isActive: false },
//         { id: 302, name: 'User Master', isActive: false },
//         { id: 303, name: 'Stage Master', isActive: false },
//       ]
//     },
//     {
//       id: 4,
//       name: 'Upload Center',
//       isEnabled: false,
//       features: [
//         { id: 401, name: 'Upload', isActive: false },
//       ]
//     },
//     {
//       id: 5,
//       name: 'Reports',
//       isEnabled: false,
//       features: [
//         { id: 501, name: 'Remarks', isActive: false },
//         { id: 502, name: 'Remarks Master', isActive: false },
//         { id: 503, name: 'Audit Logs', isActive: false },
//         { id: 504, name: 'User Logs', isActive: false },
//       ]
//     }
//   ];

//   constructor() {
//     this.breadCrumbItems.set([
//       { label: 'Modules' },
//     ]);
//   }

//   ngOnInit() {
//     this.updateCurrentRole();
//   }

//   onRoleChange() {
//     this.updateCurrentRole();
//   }

//   updateCurrentRole() {
//     const id = typeof this.selectedRoleId === 'string' ? parseInt(this.selectedRoleId, 10) : this.selectedRoleId;
//     this.currentRole = this.roles.find(r => r.id === id);
//   }

//   getGridClass(roleId: number): string {
//     return roleId === 5 ? 'col-12 col-md-3' : 'col-12 col-md-4';
//   }
// }


//================ NEW ADDED ===================================
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbsComponent } from '../../../../common/breadcrumbs/breadcrumbs.component';
import { breadCrumbItems } from './../../../../../shared/models/models';

// --- Data Models ---
export interface Feature {
  id: number;
  name: string;
  isActive: boolean;
}

export interface SubModule {
  id: number;
  name: string;
  isActive: boolean;
  features: Feature[];
}

export interface Module {
  id: number;
  name: string;
  isEnabled: boolean;
  subModules: SubModule[];
}

export interface UserRole {
  id: number;
  name: string;
  modules: Module[];
}

@Component({
  selector: 'app-ur-modules',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbsComponent],
  templateUrl: './ur-modules.component.html',
  styleUrl: './ur-modules.component.scss'
})
export class UrModulesComponent implements OnInit {

  private route = inject(ActivatedRoute);
  breadCrumbItems = signal<breadCrumbItems[]>([]);
  
  // State
  selectedRoleId: number = 1; 
  currentUserRole: UserRole | undefined;
  currentProjectTitle: string = '';
  availableUserRoles: UserRole[] = [];

  constructor() {
    this.breadCrumbItems.set([{ label: 'Settings' }, { label: 'Manage Modules', active: true }]);
  }

  ngOnInit() {
    // Get Project Name from Route Data (defined in app.routes.ts)
    const projectKey = this.route.snapshot.data['targetModule'] || 'Unrecognised Invoice';
    this.currentProjectTitle = projectKey;
    this.loadProjectData(projectKey);
  }

  // --- Toggle Logic ---

  // 1. When a Module (Parent) is toggled
  onModuleToggle(module: Module) {
    if (!module.isEnabled) {
      // If Parent is OFF -> Turn OFF all children and grandchildren
      module.subModules.forEach(sub => {
        sub.isActive = false;
        this.onSubModuleToggle(sub); 
      });
    }
  }

  // 2. When a Sub-Module (Child) is toggled
  onSubModuleToggle(subModule: SubModule) {
    if (!subModule.isActive) {
      // If Sub-Module is OFF -> Turn OFF all features
      subModule.features.forEach(feat => feat.isActive = false);
    }
  }

  // --- Table Rowspan Helpers ---

  getModuleRowSpan(module: Module): number {
    let totalRows = 0;
    if (module.subModules && module.subModules.length > 0) {
      for (const sub of module.subModules) {
        // Add row count of each sub-module
        totalRows += this.getSubModuleRowSpan(sub);
      }
    } else {
      totalRows = 1; // Minimum 1 row
    }
    return totalRows;
  }

  getSubModuleRowSpan(subModule: SubModule): number {
    // Return count of features, or 1 if empty
    return (subModule.features && subModule.features.length > 0) ? subModule.features.length : 1;
  }

  // --- Data Loading & Selection ---

  onRoleChange() {
    const id = Number(this.selectedRoleId);
    this.currentUserRole = this.availableUserRoles.find(r => r.id === id);
  }

  loadProjectData(projectKey: string) {
    // Mock Data Construction
    this.availableUserRoles = [
      {
        id: 1,
        name: 'National Sales Head',
        modules: [
          {
            id: 101, name: 'Unrecognised Invoices', isEnabled: false,
            subModules: [
              {
                id: 1011, name: 'Pan India Summary', isActive: false, 
                features: [{ id: 10111, name: 'Invoice Pan-wise Bucket', isActive: false }]
              },
              { id: 1012, name: 'State-wise Stage Summary', isActive: false, features: [] },
              { id: 1013, name: 'Area-Wise Aging', isActive: false, features: [] }
            ]
          },
          {
            id: 102, name: 'Consignment Stock', isEnabled: false,
            subModules: [
              {
                id: 1021, name: 'Pan India Summary', isActive: false, 
                features: [{ id: 10211, name: 'COGS Pan-wise Bucket', isActive: false }]
              },
              { id: 1022, name: 'State-wise Stage Summary', isActive: false, features: [] },
              { id: 1023, name: 'Area-Wise Aging', isActive: false, features: [] }
            ]
          },
          {
            id: 103, name: 'Manage Data', isEnabled: false,
            subModules: [
              { id: 1031, name: 'Dealer Master', isActive: false, features: [] },
              { id: 1032, name: 'User Master', isActive: false, features: [] },
              { id: 1033, name: 'Stage Master', isActive: false, features: [] }
            ]
          },
          {
            id: 104, name: 'Upload Center', isEnabled: false,
            subModules: [
              { id: 1041, name: 'Upload', isActive: false, features: [] }
            ]
          },
          {
            id: 105, name: 'Reports', isEnabled: false,
            subModules: [
              { id: 1051, name: 'Audit Logs', isActive: false, features: [] },
              { id: 1052, name: 'User Logs', isActive: false, features: [] }
            ]
          }
        ]
      },
      {
        id: 2, name: 'Zonal Manager',
        modules: [] // Add mock data for ZM here if needed
      }
    ];

    // Auto-select first role
    if (this.availableUserRoles.length > 0) {
      this.selectedRoleId = this.availableUserRoles[0].id;
      this.onRoleChange();
    }
  }
}