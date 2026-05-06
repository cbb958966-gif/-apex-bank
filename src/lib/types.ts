export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  address: {
    street: string
    city: string
    state: string
    zip: string
  }
  avatar?: string
  createdAt: string
  isVerified: boolean
  twoFactorEnabled: boolean
  preferences: {
    currency: string
    language: string
    theme: 'light' | 'dark' | 'system'
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
      transactionAlerts: boolean
      securityAlerts: boolean
      marketingEmails: boolean
    }
  }
}

export interface Account {
  id: string
  userId: string
  type: 'checking' | 'savings' | 'credit' | 'investment'
  name: string
  nickname: string
  balance: number
  availableBalance: number
  currency: string
  accountNumber: string
  routingNumber: string
  status: 'active' | 'frozen' | 'closed'
  createdAt: string
  overdraftProtection: boolean
  overdraftLimit: number
  dailyLimit: number
  monthlyLimit: number
}

export interface Transaction {
  id: string
  accountId: string
  type: 'credit' | 'debit'
  category: string
  amount: number
  currency: string
  description: string
  merchant: string
  merchantIcon?: string
  status: 'completed' | 'pending' | 'failed' | 'processing'
  date: string
  balance: number
  isRecurring: boolean
  tags: string[]
  location?: {
    city: string
    state: string
  }
}

export interface Card {
  id: string
  userId: string
  type: 'debit' | 'credit' | 'virtual'
  name: string
  number: string
  expiry: string
  cvv: string
  holderName: string
  network: 'visa' | 'mastercard' | 'amex'
  status: 'active' | 'frozen' | 'expired' | 'cancelled'
  balance: number
  limit: number
  availableCredit: number
  color: string
  design: string
  contactless: boolean
  internationalEnabled: boolean
  onlinePurchasesEnabled: boolean
  atmWithdrawalEnabled: boolean
  spendingLimits: {
    daily: number
    atm: number
    online: number
    international: number
  }
  categoryLimits: Record<string, number>
  createdAt: string
  expiresAt: string
}

export interface Transfer {
  id: string
  type: 'internal' | 'external' | 'wire' | 'p2p' | 'bill' | 'international'
  fromAccount: string
  toAccount: string
  toName: string
  recipientEmail?: string
  amount: number
  currency: string
  fee: number
  description: string
  status: 'completed' | 'pending' | 'failed' | 'processing' | 'scheduled'
  date: string
  scheduledDate?: string
  recurrence?: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly'
  reference: string
}

export interface Bill {
  id: string
  name: string
  category: string
  amount: number
  dueDate: string
  frequency: 'once' | 'monthly' | 'quarterly' | 'yearly'
  status: 'upcoming' | 'paid' | 'overdue'
  account: string
  autoPay: boolean
}

export interface Budget {
  id: string
  category: string
  limit: number
  spent: number
  period: 'monthly' | 'weekly'
  color: string
  alerts: {
    at80Percent: boolean
    at100Percent: boolean
  }
}

export interface Goal {
  id: string
  name: string
  target: number
  current: number
  icon: string
  color: string
  deadline: string
  autoSave: number
  status: 'active' | 'completed' | 'paused'
}

export interface Notification {
  id: string
  type: 'transaction' | 'security' | 'system' | 'marketing'
  title: string
  message: string
  read: boolean
  date: string
  actionUrl?: string
}

export interface CreditScore {
  score: number
  date: string
  previousScore: number
  factors: {
    name: string
    impact: 'positive' | 'negative' | 'neutral'
    description: string
  }[]
}

export interface Insight {
  id: string
  type: 'warning' | 'tip' | 'alert' | 'congratulation'
  title: string
  message: string
  icon: string
  date: string
}

export interface Device {
  id: string
  name: string
  type: string
  browser: string
  os: string
  lastActive: string
  location: string
  isCurrent: boolean
}

export interface SecurityEvent {
  id: string
  type: 'login' | 'logout' | 'password_change' | '2fa_enabled' | 'device_added' | 'failed_login'
  date: string
  ip: string
  location: string
  device: string
  status: 'success' | 'failed' | 'blocked'
}
