
// Shared types for MadBoat ecosystem
export interface MadBoatUser {
  id: string;
  email: string;
  persona?: 'kraken' | 'navigator' | 'lighthouse';
}

export interface MadBoatModule {
  id: string;
  name: string;
  progress: number;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface AuthState {
  error?: string;
  success?: boolean;
}
