'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { HelpCircle, MessageSquare, Phone, Mail, Search, FileText, AlertTriangle, ChevronRight, ArrowRight, Send } from 'lucide-react'

const faqs = [
  { q: 'How do I transfer money to another bank?', a: 'Go to Transfers > New Transfer, select "External Transfer", enter the recipient details and amount. ACH transfers take 1-3 business days.' },
  { q: 'How do I freeze my card?', a: 'Go to Cards, select the card you want to freeze, and click "Freeze Card". You can unfreeze it at any time.' },
  { q: 'What are my transfer limits?', a: 'Daily limits vary by account type. Checking accounts have a $10,000 daily limit. View your specific limits in Cards > Limits.' },
  { q: 'How do I set up direct deposit?', a: 'Go to Accounts, select your checking account, and click "Direct Deposit" to get your routing and account numbers.' },
  { q: 'How do I dispute a transaction?', a: 'Find the transaction in your history, click "Dispute", select a reason, and provide any supporting documentation.' },
]

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [message, setMessage] = useState('')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-poppins)' }}>Support</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Get help with your account</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-all">
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-8 w-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold">Live Chat</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Chat with support now</p>
            <Badge variant="success" className="mt-3">Online</Badge>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-all">
          <CardContent className="p-6 text-center">
            <Phone className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-semibold">Call Us</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">1-800-APEX-BANK</p>
            <p className="text-xs text-slate-400 mt-2">Mon-Fri 8am-8pm EST</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-all">
          <CardContent className="p-6 text-center">
            <Mail className="h-8 w-8 text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold">Email</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">support@apexbank.com</p>
            <p className="text-xs text-slate-400 mt-2">Response within 24hrs</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><HelpCircle className="h-5 w-5" /> Frequently asked questions</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <span className="text-sm font-medium">{faq.q}</span>
                    <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4">
                      <p className="text-sm text-slate-500 dark:text-slate-400">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Quick actions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { icon: AlertTriangle, label: 'Report fraud', desc: 'Report suspicious activity', color: 'text-red-500' },
              { icon: FileText, label: 'Dispute transaction', desc: 'File a dispute for a charge', color: 'text-amber-500' },
              { icon: FileText, label: 'Request statement', desc: 'Download account statements', color: 'text-blue-500' },
              { icon: ArrowRight, label: 'Account closure', desc: 'Close an account', color: 'text-slate-500' },
            ].map((action, i) => (
              <button key={i} className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors text-left">
                <action.icon className={`h-5 w-5 ${action.color}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{action.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{action.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
