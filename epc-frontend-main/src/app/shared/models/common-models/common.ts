// In your common-models/common.ts file
export interface Toast {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}