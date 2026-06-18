'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Download, Calendar, Eye, Search, Filter } from 'lucide-react'

const documents = [
  { name: 'April 2026 Statement', type: 'statement', date: '2026-05-01', size: '245 KB' },
  { name: 'March 2026 Statement', type: 'statement', date: '2026-04-01', size: '238 KB' },
  { name: 'February 2026 Statement', type: 'statement', date: '2026-03-01', size: '241 KB' },
  { name: '1099-INT Tax Form 2025', type: 'tax', date: '2026-01-31', size: '156 KB' },
  { name: 'Account Agreement', type: 'agreement', date: '2023-01-15', size: '1.2 MB' },
  { name: 'Fee Schedule', type: 'disclosure', date: '2026-01-01', size: '342 KB' },
  { name: 'Privacy Policy', type: 'disclosure', date: '2026-01-01', size: '289 KB' },
]

export default function DocumentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-poppins)' }}>Documents</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Statements, tax forms, and legal documents</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>All documents</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input className="h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:border-slate-700 dark:bg-slate-800" placeholder="Search documents..." />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {documents.map((doc, i) => (
              <div key={i} className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{doc.size} • {new Date(doc.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] capitalize">{doc.type}</Badge>
                  <Button variant="ghost" size="icon" className="h-10 w-10"><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10"><Download className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
