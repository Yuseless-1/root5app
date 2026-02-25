
export enum ProposalStatus {
  ACTIVE = 'Active',
  PENDING = 'Pending',
  PASSED = 'Passed',
  REJECTED = 'Rejected',
  EXECUTED = 'Executed'
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: ProposalStatus;
  votesFor: number;
  votesAgainst: number;
  createdAt: string;
  expiresAt: string;
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isSigned: boolean;
}

export enum ProposalStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  PASSED = 'passed',
  REJECTED = 'rejected',
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: ProposalStatus;
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number; // Added abstain votes
  createdAt: string;
  expiresAt: string;
  budget?: number; // Optional budget field
  subject?: string; // Optional subject field
}
export interface DevUpdate {
  id: string;
  title: string;
  content: string;
  date: string;
  tag: 'Core' | 'UI' | 'Infrastructure' | 'Security';
}

export interface TreasuryAsset {
  symbol: string;
  name: string;
  balance: number;
  valueUsd: number;
  color: string;
}
