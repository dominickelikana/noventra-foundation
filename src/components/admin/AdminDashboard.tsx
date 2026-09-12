import React, { useState } from 'react';
import { 
  X, 
  LogOut, 
  LayoutDashboard, 
  FolderKanban, 
  HeartHandshake, 
  Users, 
  Newspaper, 
  Image, 
  Mail, 
  Sparkles, 
  ShieldAlert, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Edit3, 
  RefreshCw,
  TrendingUp,
  FileSpreadsheet,
  Check,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { 
  Project, 
  Donation, 
  VolunteerApplication, 
  NewsArticle, 
  GalleryItem, 
  ContactMessage, 
  AuditLog,
  Language,
  SiteSettings
} from '../../types';
import { 
  createProject, 
  updateProject, 
  deleteProject, 
  createNewsArticle, 
  updateVolunteerStatus, 
  createGalleryItem, 
  deleteGalleryItem, 
  addAuditLog 
} from '../../lib/db';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  adminUser?: { email: string; displayName?: string } | null;
  projects: Project[];
  donations: Donation[];
  volunteers: VolunteerApplication[];
  articles: NewsArticle[];
  gallery: GalleryItem[];
  contacts: ContactMessage[];
  auditLogs: AuditLog[];
  siteSettings: SiteSettings;
  onRefreshData: () => Promise<void>;
  onLogout: () => void;
}

type TabType = 'overview' | 'projects' | 'donations' | 'volunteers' | 'news' | 'gallery' | 'contacts' | 'audit' | 'ai_copilot';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  currentLang,
  adminUser,
  projects,
  donations,
  volunteers,
  articles,
  gallery,
  contacts,
  auditLogs,
  onRefreshData,
  onLogout
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // New Project Form State
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjTitleSw, setNewProjTitleSw] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjDescSw, setNewProjDescSw] = useState('');
  const [newProjCategory, setNewProjCategory] = useState<any>('education');
  const [newProjTarget, setNewProjTarget] = useState<number>(10000000);
  const [newProjLocation, setNewProjLocation] = useState('Dar es Salaam');
  const [newProjBeneficiaries, setNewProjBeneficiaries] = useState(500);
  const [newProjImage, setNewProjImage] = useState('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop');

  // AI Copilot state
  const [copilotAction, setCopilotAction] = useState('generate_news');
  const [copilotTopic, setCopilotTopic] = useState('');
  const [copilotLocation, setCopilotLocation] = useState('Tanzania');
  const [copilotResult, setCopilotResult] = useState('');
  const [copilotLoading, setCopilotLoading] = useState(false);

  // Stats Calculations
  const totalDonationsAmount = donations
    .filter(d => d.status === 'completed' && d.amount)
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const pendingVolunteers = volunteers.filter(v => v.status === 'pending').length;
  const pendingInquiries = contacts.filter(c => c.status === 'unread').length;

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createProject({
        title: newProjTitle,
        titleSw: newProjTitleSw || newProjTitle,
        description: newProjDesc,
        descriptionSw: newProjDescSw || newProjDesc,
        category: newProjCategory,
        targetAmount: Number(newProjTarget),
        amountRaised: 0,
        currency: 'TZS',
        status: 'active',
        featuredImage: newProjImage,
        gallery: [newProjImage],
        location: newProjLocation,
        beneficiariesCount: Number(newProjBeneficiaries),
        startDate: new Date().toISOString().split('T')[0],
      });
      await onRefreshData();
      setShowNewProjectModal(false);
    } catch (err) {
      console.error('Failed to create project:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVolunteerStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateVolunteerStatus(id, status);
      await onRefreshData();
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleRunAICopilot = async () => {
    if (!copilotTopic) return;
    setCopilotLoading(true);
    setCopilotResult('');
    try {
      const res = await fetch('/api/ai/admin-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: copilotAction,
          payload: { topic: copilotTopic, location: copilotLocation },
          language: currentLang
        })
      });
      const data = await res.json();
      setCopilotResult(data.result || 'No output generated');
    } catch (err) {
      console.error('Copilot error:', err);
      setCopilotResult('AI assistant error. Check connection.');
    } finally {
      setCopilotLoading(false);
    }
  };

  const exportDonationsCSV = () => {
    const headers = ['Receipt', 'Donor', 'Email', 'Phone', 'Amount', 'Currency', 'Project', 'Method', 'Reference', 'Status', 'Date'];
    const rows = donations.map(d => [
      d.receiptNumber,
      `"${d.donorName}"`,
      d.donorEmail,
      d.donorPhone,
      d.amount || 0,
      d.currency,
      `"${d.projectName || 'General Fund'}"`,
      d.paymentMethod || d.donationType,
      d.transactionReference,
      d.status,
      d.createdAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Noventra_Donations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-slate-950/80 backdrop-blur-sm overflow-hidden">
      
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 shrink-0">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-sm">
                N
              </div>
              <div>
                <span className="font-extrabold text-white text-sm block">Noventra Admin</span>
                <span className="text-[10px] text-emerald-400 font-semibold">HQ Executive Portal</span>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1 text-xs font-semibold">
            {[
              { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
              { id: 'projects', label: `Projects (${projects.length})`, icon: FolderKanban },
              { id: 'donations', label: `Donations (${donations.length})`, icon: HeartHandshake },
              { id: 'volunteers', label: `Volunteers (${volunteers.length})`, icon: Users, badge: pendingVolunteers },
              { id: 'news', label: `News & Dispatches (${articles.length})`, icon: Newspaper },
              { id: 'gallery', label: `Field Gallery (${gallery.length})`, icon: Image },
              { id: 'contacts', label: `Inquiries (${contacts.length})`, icon: Mail, badge: pendingInquiries },
              { id: 'ai_copilot', label: 'AI Foundation Copilot', icon: Sparkles, highlight: true },
              { id: 'audit', label: 'Security & Audit Logs', icon: ShieldAlert },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : tab.highlight
                      ? 'bg-slate-800 text-emerald-300 hover:bg-slate-700'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && tab.badge > 0 ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-900 font-black text-[10px]">
                      {tab.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="text-[11px] text-slate-400 px-2 overflow-hidden">
            <div className="truncate">Logged in as: <strong className="text-white">{adminUser?.displayName || adminUser?.email || 'Executive Admin'}</strong></div>
            <div className="text-emerald-400 text-[10px] truncate">{adminUser?.email || 'Authenticated Staff'}</div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold text-center"
            >
              Exit View
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="py-2 px-3 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 text-xs font-semibold flex items-center justify-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content View */}
      <main className="flex-1 bg-slate-100 flex flex-col overflow-hidden">
        
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
              {String(activeTab || '').replace(/_/g, ' ')}
            </h2>
            <p className="text-xs text-slate-500">
              Noventra Charity Foundation Management Platform
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onRefreshData()}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              title="Refresh database records"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Close Admin Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Tab Content Container */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* ================= OVERVIEW TAB ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Metric KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Funds Raised</span>
                  <div className="text-2xl font-black text-emerald-700">
                    TZS {totalDonationsAmount.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Verified via M-Pesa & Bank</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Projects</span>
                  <div className="text-2xl font-black text-slate-900">
                    {projects.filter(p => p.status === 'active').length} of {projects.length}
                  </div>
                  <div className="text-[11px] text-slate-500">Across 8 regions in Tanzania</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Volunteers</span>
                  <div className="text-2xl font-black text-slate-900">
                    {volunteers.length} Total
                  </div>
                  <div className="text-[11px] text-amber-600 font-semibold">
                    {pendingVolunteers} pending review
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Inquiries</span>
                  <div className="text-2xl font-black text-slate-900">
                    {contacts.length} Messages
                  </div>
                  <div className="text-[11px] text-blue-600 font-semibold">
                    {pendingInquiries} unread messages
                  </div>
                </div>

              </div>

              {/* Recent Donations & Recent Volunteers */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Recent Donations */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Donations</h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('donations')}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                    >
                      View All ({donations.length})
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {donations.slice(0, 5).map((d) => (
                      <div key={d.id} className="py-3 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-xs text-slate-900">
                            {d.isAnonymous ? 'Anonymous Donor' : d.donorName}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {d.paymentMethod || d.donationType} • {new Date(d.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-emerald-700">
                            {d.amount ? `${d.currency} ${d.amount.toLocaleString()}` : 'In-Kind Items'}
                          </span>
                          <span className="block text-[10px] text-slate-400 font-mono">{d.receiptNumber}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending Volunteers */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Pending Volunteer Applications</h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('volunteers')}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                    >
                      Manage ({volunteers.length})
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {volunteers.slice(0, 5).map((v) => (
                      <div key={v.id} className="py-3 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-xs text-slate-900">{v.fullName}</div>
                          <div className="text-[10px] text-slate-500">{v.occupation} • {v.location}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleVolunteerStatus(v.id, 'approved')}
                            className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold hover:bg-emerald-200"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleVolunteerStatus(v.id, 'rejected')}
                            className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[11px] font-bold hover:bg-slate-200"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ================= PROJECTS TAB ================= */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase">Manage Foundation Projects</h3>
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Project</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                    <tr>
                      <th className="p-3.5">Project Title</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Target (TZS)</th>
                      <th className="p-3.5">Raised (TZS)</th>
                      <th className="p-3.5">Location</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {projects.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-3.5 font-bold text-slate-900">{p.title}</td>
                        <td className="p-3.5 uppercase">{p.category}</td>
                        <td className="p-3.5 font-mono">{p.targetAmount.toLocaleString()}</td>
                        <td className="p-3.5 font-mono text-emerald-700 font-bold">{p.amountRaised.toLocaleString()}</td>
                        <td className="p-3.5">{p.location}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= DONATIONS TAB ================= */}
          {activeTab === 'donations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase">Donation Records & Verification</h3>
                  <p className="text-xs text-slate-500">Official ledger of mobile money, bank and in-kind gifts</p>
                </div>

                <button
                  type="button"
                  onClick={exportDonationsCSV}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                    <tr>
                      <th className="p-3.5">Receipt #</th>
                      <th className="p-3.5">Donor</th>
                      <th className="p-3.5">Amount / Items</th>
                      <th className="p-3.5">Method</th>
                      <th className="p-3.5">Ref Code</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {donations.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50">
                        <td className="p-3.5 font-mono font-bold text-emerald-700">{d.receiptNumber}</td>
                        <td className="p-3.5">
                          <strong className="block text-slate-900">{d.isAnonymous ? 'Anonymous' : d.donorName}</strong>
                          <span className="text-[10px] text-slate-400">{d.donorPhone}</span>
                        </td>
                        <td className="p-3.5 font-bold">
                          {d.amount ? `${d.currency} ${d.amount.toLocaleString()}` : d.physicalItemsDescription}
                        </td>
                        <td className="p-3.5 uppercase">{d.paymentMethod || d.donationType}</td>
                        <td className="p-3.5 font-mono text-[11px] text-slate-500">{d.transactionReference}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {d.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500">{new Date(d.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= VOLUNTEERS TAB ================= */}
          {activeTab === 'volunteers' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase">Volunteer Application Portal</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {volunteers.map((v) => (
                  <div key={v.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{v.fullName}</h4>
                        <p className="text-xs text-slate-500">{v.occupation} • {v.location}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        v.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {v.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <div><strong>Email:</strong> {v.email} | <strong>Phone:</strong> {v.phone}</div>
                      <div><strong>Skills:</strong> {v.skills.join(', ')}</div>
                      <div><strong>Availability:</strong> {v.availability}</div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-700 italic">
                        "{v.motivation}"
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400">Code: {v.applicationCode}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleVolunteerStatus(v.id, 'approved')}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => handleVolunteerStatus(v.id, 'rejected')}
                          className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= AI COPILOT TAB ================= */}
          {activeTab === 'ai_copilot' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-6 rounded-3xl border border-slate-800 space-y-2">
                <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase">
                  <Sparkles className="w-4 h-4" />
                  <span>Gemini 2.5 Intelligence Engine</span>
                </div>
                <h3 className="text-xl font-extrabold text-white">Foundation Administrative AI Assistant</h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  Draft inspiring news updates, generate bilateral project proposals, translate diplomatic releases between English and Kiswahili, or summarize volunteer credentials.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Select Copilot Tool</label>
                    <select
                      value={copilotAction}
                      onChange={(e) => setCopilotAction(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="generate_news">Draft News Release / Article</option>
                      <option value="generate_campaign">Draft Fundraising Campaign Strategy</option>
                      <option value="translate">Diplomatic Translation (EN &lt;-&gt; SW)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Target Location / Project Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Dodoma Water Well or Rufiji Emergency Aid"
                      value={copilotLocation}
                      onChange={(e) => setCopilotLocation(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Prompt / Topic Details</label>
                  <textarea
                    rows={3}
                    placeholder="Enter what you want Gemini to draft or translate..."
                    value={copilotTopic}
                    onChange={(e) => setCopilotTopic(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  ></textarea>
                </div>

                <button
                  type="button"
                  onClick={handleRunAICopilot}
                  disabled={copilotLoading || !copilotTopic}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 disabled:opacity-40"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{copilotLoading ? 'Gemini is Generating...' : 'Generate with AI'}</span>
                </button>

                {copilotResult && (
                  <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 whitespace-pre-line">
                    <strong className="block text-emerald-800 font-bold mb-2">AI Copilot Generated Content:</strong>
                    {copilotResult}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= AUDIT LOGS TAB ================= */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase">System Security & Audit Trail</h3>
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                    <tr>
                      <th className="p-3.5">Action</th>
                      <th className="p-3.5">Entity</th>
                      <th className="p-3.5">Performed By</th>
                      <th className="p-3.5">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="p-3.5 font-bold font-mono text-emerald-700">{log.action}</td>
                        <td className="p-3.5">{log.entityType} ({log.entityId})</td>
                        <td className="p-3.5">{log.performedBy}</td>
                        <td className="p-3.5 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Create New Foundation Project</h3>
              <button onClick={() => setShowNewProjectModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Project Title (English) *</label>
                <input
                  type="text"
                  required
                  value={newProjTitle}
                  onChange={(e) => setNewProjTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Project Title (Swahili)</label>
                <input
                  type="text"
                  value={newProjTitleSw}
                  onChange={(e) => setNewProjTitleSw(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Category</label>
                  <select
                    value={newProjCategory}
                    onChange={(e) => setNewProjCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="education">Education</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="orphans">Orphans & Vulnerable</option>
                    <option value="women_youth">Women & Youth</option>
                    <option value="environment">Environment</option>
                    <option value="emergency">Emergency Relief</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Target Amount (TZS) *</label>
                  <input
                    type="number"
                    required
                    value={newProjTarget}
                    onChange={(e) => setNewProjTarget(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Description (English) *</label>
                <textarea
                  rows={3}
                  required
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Location</label>
                  <input
                    type="text"
                    value={newProjLocation}
                    onChange={(e) => setNewProjLocation(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Beneficiaries</label>
                  <input
                    type="number"
                    value={newProjBeneficiaries}
                    onChange={(e) => setNewProjBeneficiaries(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  {loading ? 'Creating...' : 'Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
