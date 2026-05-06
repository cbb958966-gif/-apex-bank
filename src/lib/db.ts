function get<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

function set<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

const DB_KEYS = {
  USERS: 'apex_users',
  SESSION: 'apex_session',
  ACCOUNTS: 'apex_accounts',
  TRANSACTIONS: 'apex_transactions',
  CARDS: 'apex_cards',
  TRANSFERS: 'apex_transfers',
  BILLS: 'apex_bills',
  BUDGETS: 'apex_budgets',
  GOALS: 'apex_goals',
  NOTIFICATIONS: 'apex_notifications',
  DEVICES: 'apex_devices',
  SECURITY_EVENTS: 'apex_security_events',
} as const

export const db = {
  users: {
    getAll: () => get<any[]>(DB_KEYS.USERS, []),
    setAll: (users: any[]) => set(DB_KEYS.USERS, users),
    add: (user: any) => {
      const users = db.users.getAll()
      users.push(user)
      set(DB_KEYS.USERS, users)
    },
    findByEmail: (email: string) => db.users.getAll().find(u => u.email === email),
    findById: (id: string) => db.users.getAll().find(u => u.id === id),
    update: (id: string, data: any) => {
      const users = db.users.getAll()
      const index = users.findIndex(u => u.id === id)
      if (index !== -1) {
        users[index] = { ...users[index], ...data }
        set(DB_KEYS.USERS, users)
      }
    },
  },
  session: {
    get: () => get<any | null>(DB_KEYS.SESSION, null),
    set: (session: any) => set(DB_KEYS.SESSION, session),
    clear: () => localStorage.removeItem(DB_KEYS.SESSION),
  },
  accounts: {
    getAll: () => get<any[]>(DB_KEYS.ACCOUNTS, []),
    setAll: (accounts: any[]) => set(DB_KEYS.ACCOUNTS, accounts),
    getById: (id: string) => db.accounts.getAll().find(a => a.id === id),
    getByUserId: (userId: string) => db.accounts.getAll().filter(a => a.userId === userId),
    update: (id: string, data: any) => {
      const accounts = db.accounts.getAll()
      const index = accounts.findIndex(a => a.id === id)
      if (index !== -1) {
        accounts[index] = { ...accounts[index], ...data }
        set(DB_KEYS.ACCOUNTS, accounts)
      }
    },
  },
  transactions: {
    getAll: () => get<any[]>(DB_KEYS.TRANSACTIONS, []),
    setAll: (transactions: any[]) => set(DB_KEYS.TRANSACTIONS, transactions),
    add: (transaction: any) => {
      const transactions = db.transactions.getAll()
      transactions.unshift(transaction)
      set(DB_KEYS.TRANSACTIONS, transactions)
    },
    getByAccountId: (accountId: string) => db.transactions.getAll().filter(t => t.accountId === accountId),
    getByCategory: (category: string) => db.transactions.getAll().filter(t => t.category === category),
  },
  cards: {
    getAll: () => get<any[]>(DB_KEYS.CARDS, []),
    setAll: (cards: any[]) => set(DB_KEYS.CARDS, cards),
    add: (card: any) => {
      const cards = db.cards.getAll()
      cards.push(card)
      set(DB_KEYS.CARDS, cards)
    },
    getById: (id: string) => db.cards.getAll().find(c => c.id === id),
    getByUserId: (userId: string) => db.cards.getAll().filter(c => c.userId === userId),
    update: (id: string, data: any) => {
      const cards = db.cards.getAll()
      const index = cards.findIndex(c => c.id === id)
      if (index !== -1) {
        cards[index] = { ...cards[index], ...data }
        set(DB_KEYS.CARDS, cards)
      }
    },
  },
  transfers: {
    getAll: () => get<any[]>(DB_KEYS.TRANSFERS, []),
    setAll: (transfers: any[]) => set(DB_KEYS.TRANSFERS, transfers),
    add: (transfer: any) => {
      const transfers = db.transfers.getAll()
      transfers.unshift(transfer)
      set(DB_KEYS.TRANSFERS, transfers)
    },
    getById: (id: string) => db.transfers.getAll().find(t => t.id === id),
  },
  bills: {
    getAll: () => get<any[]>(DB_KEYS.BILLS, []),
    setAll: (bills: any[]) => set(DB_KEYS.BILLS, bills),
    update: (id: string, data: any) => {
      const bills = db.bills.getAll()
      const index = bills.findIndex(b => b.id === id)
      if (index !== -1) {
        bills[index] = { ...bills[index], ...data }
        set(DB_KEYS.BILLS, bills)
      }
    },
  },
  budgets: {
    getAll: () => get<any[]>(DB_KEYS.BUDGETS, []),
    setAll: (budgets: any[]) => set(DB_KEYS.BUDGETS, budgets),
  },
  goals: {
    getAll: () => get<any[]>(DB_KEYS.GOALS, []),
    setAll: (goals: any[]) => set(DB_KEYS.GOALS, goals),
  },
  notifications: {
    getAll: () => get<any[]>(DB_KEYS.NOTIFICATIONS, []),
    setAll: (notifications: any[]) => set(DB_KEYS.NOTIFICATIONS, notifications),
    markAsRead: (id: string) => {
      const notifications = db.notifications.getAll()
      const index = notifications.findIndex(n => n.id === id)
      if (index !== -1) {
        notifications[index].read = true
        set(DB_KEYS.NOTIFICATIONS, notifications)
      }
    },
    markAllAsRead: () => {
      const notifications = db.notifications.getAll().map(n => ({ ...n, read: true }))
      set(DB_KEYS.NOTIFICATIONS, notifications)
    },
    getUnreadCount: () => db.notifications.getAll().filter(n => !n.read).length,
    add: (notification: any) => {
      const notifications = db.notifications.getAll()
      notifications.unshift(notification)
      set(DB_KEYS.NOTIFICATIONS, notifications)
    },
  },
  devices: {
    getAll: () => get<any[]>(DB_KEYS.DEVICES, []),
    setAll: (devices: any[]) => set(DB_KEYS.DEVICES, devices),
    remove: (id: string) => {
      const devices = db.devices.getAll().filter(d => d.id !== id)
      set(DB_KEYS.DEVICES, devices)
    },
  },
  securityEvents: {
    getAll: () => get<any[]>(DB_KEYS.SECURITY_EVENTS, []),
    setAll: (events: any[]) => set(DB_KEYS.SECURITY_EVENTS, events),
    add: (event: any) => {
      const events = db.securityEvents.getAll()
      events.unshift(event)
      set(DB_KEYS.SECURITY_EVENTS, events)
    },
  },
}

export function initializeDb(data: {
  users: any[]
  accounts: any[]
  transactions: any[]
  cards: any[]
  transfers: any[]
  bills: any[]
  budgets: any[]
  goals: any[]
  notifications: any[]
  devices: any[]
  securityEvents: any[]
}) {
  db.users.setAll(data.users)
  db.accounts.setAll(data.accounts)
  db.transactions.setAll(data.transactions)
  db.cards.setAll(data.cards)
  db.transfers.setAll(data.transfers)
  db.bills.setAll(data.bills)
  db.budgets.setAll(data.budgets)
  db.goals.setAll(data.goals)
  db.notifications.setAll(data.notifications)
  db.devices.setAll(data.devices)
  db.securityEvents.setAll(data.securityEvents)
}
