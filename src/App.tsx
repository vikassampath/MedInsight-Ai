import { useState } from 'react'
import { Activity, ArrowUpRight, Bell, BookOpen, ChevronDown, FileText, ImagePlus, LayoutDashboard, MessageCircleQuestion, MoreHorizontal, Search, ShieldCheck, Sparkles, Upload, UsersRound } from 'lucide-react'
import './App.css'

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Reports', icon: FileText, badge: '3' },
  { label: 'Imaging', icon: ImagePlus },
  { label: 'Knowledge', icon: BookOpen },
  { label: 'Patients', icon: UsersRound },
]
const measurements = [
  { label: 'Hemoglobin', value: '12.8', unit: 'g/dL', status: 'In range', tone: 'good', trend: '+0.4' },
  { label: 'LDL cholesterol', value: '142', unit: 'mg/dL', status: 'Review', tone: 'warn', trend: '+12' },
  { label: 'TSH', value: '2.4', unit: 'mIU/L', status: 'In range', tone: 'good', trend: '-0.2' },
]

function App() {
  const [activeNav, setActiveNav] = useState('Overview')
  const [showUpload, setShowUpload] = useState(false)
  const [question, setQuestion] = useState('')
  const [asked, setAsked] = useState(false)
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><Activity size={18} /></span><span>medinsight<span className="brand-dot">.</span></span></div>
      <div className="workspace-switcher"><span className="avatar small">JR</span><span><strong>Jordan Rivera</strong><small>Personal workspace</small></span><ChevronDown size={15} /></div>
      <nav className="main-nav" aria-label="Main navigation"><p className="nav-label">Workspace</p>{navItems.map(({ label, icon: Icon, badge }) => <button key={label} className={`nav-item ${activeNav === label ? 'active' : ''}`} onClick={() => setActiveNav(label)}><Icon size={18} /><span>{label}</span>{badge && <em>{badge}</em>}</button>)}</nav>
      <div className="sidebar-bottom"><button className="nav-item"><ShieldCheck size={18} /><span>Privacy & safety</span></button><div className="safety-mini"><span className="pulse-dot" /><span><strong>Safety layer active</strong><small>Information, not diagnosis</small></span></div></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><div className="crumbs"><span>Workspace</span><span>/</span><strong>{activeNav}</strong></div><div className="top-actions"><button className="icon-button" aria-label="Search"><Search size={19} /></button><button className="icon-button" aria-label="Notifications"><Bell size={19} /><i /></button><div className="avatar">JR</div></div></header>
      <div className="content-wrap">
        <section className="welcome-row"><div><p className="eyebrow">MONDAY, SEPTEMBER 07, 2026</p><h1>Good morning, Jordan <span>✦</span></h1><p className="lede">A clear view of your health, with context you can understand.</p></div><button className="primary-button" onClick={() => setShowUpload(true)}><Upload size={17} /> Upload a report</button></section>
        <section className="notice"><div className="notice-icon"><ShieldCheck size={20} /></div><div><strong>Your health information stays yours.</strong><p>MedInsight provides educational context, not a medical diagnosis. Always discuss results with your care team.</p></div><button aria-label="More safety information"><ArrowUpRight size={18} /></button></section>
        <div className="section-heading"><div><h2>Your health snapshot</h2><p>Latest values across your recent reports</p></div><button className="text-button">View history <ArrowUpRight size={16} /></button></div>
        <section className="metric-grid">{measurements.map((item) => <article className="metric-card" key={item.label}><div className="metric-top"><span>{item.label}</span><MoreHorizontal size={18} /></div><div className="metric-value">{item.value}<small>{item.unit}</small></div><div className="metric-foot"><span className={`status ${item.tone}`}><span />{item.status}</span><span className="trend">{item.trend} <small>vs last</small></span></div></article>)}<article className="metric-card trend-card"><div className="metric-top"><span>Overall activity</span><Activity size={18} /></div><div className="chart-label"><strong>7,842</strong><small>steps this week</small></div><div className="mini-chart"><span style={{ height: '38%' }} /><span style={{ height: '55%' }} /><span style={{ height: '45%' }} /><span style={{ height: '70%' }} /><span style={{ height: '58%' }} /><span className="today" style={{ height: '82%' }} /><span style={{ height: '64%' }} /></div><div className="chart-days"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div></article></section>
        <section className="lower-grid"><div className="panel reports-panel"><div className="panel-heading"><div><h2>Recent reports</h2><p>Analysis history and findings</p></div><button className="text-button">See all <ArrowUpRight size={16} /></button></div><div className="report-list"><div className="report-row"><span className="file-icon green"><FileText size={17} /></span><div><strong>Comprehensive metabolic panel</strong><small>Sep 04, 2026 · PDF report</small></div><span className="tag good">Analyzed</span><ArrowUpRight size={17} /></div><div className="report-row"><span className="file-icon orange"><FileText size={17} /></span><div><strong>Lipid profile</strong><small>Aug 22, 2026 · PDF report</small></div><span className="tag review">Needs review</span><ArrowUpRight size={17} /></div><div className="report-row"><span className="file-icon blue"><ImagePlus size={17} /></span><div><strong>Chest X-ray</strong><small>Aug 15, 2026 · DICOM image</small></div><span className="tag processing">Processing</span><ArrowUpRight size={17} /></div></div></div>
          <div className="panel ask-panel"><div className="ask-orb"><Sparkles size={22} /></div><p className="eyebrow">KNOWLEDGE ASSISTANT</p><h2>Make sense of the medical terms.</h2><p>Ask a question and get a plain-language explanation backed by trusted sources.</p><div className="ask-input"><MessageCircleQuestion size={18} /><input value={question} onChange={(event) => { setQuestion(event.target.value); setAsked(false) }} onKeyDown={(event) => event.key === 'Enter' && question && setAsked(true)} placeholder="e.g. What does hemoglobin mean?" /><button aria-label="Ask question" onClick={() => question && setAsked(true)}><ArrowUpRight size={17} /></button></div>{asked && <div className="answer"><strong>Hemoglobin carries oxygen through your body.</strong><span>Educational answer · Source review required</span></div>}<div className="suggestions"><button onClick={() => setQuestion('What does hemoglobin mean?')}>What does hemoglobin mean?</button><button onClick={() => setQuestion('What is LDL cholesterol?')}>What is LDL cholesterol?</button></div></div></section>
      </div>
    </main>
    {showUpload && <div className="modal-backdrop" onClick={() => setShowUpload(false)}><div className="upload-modal" onClick={(event) => event.stopPropagation()}><button className="close-button" onClick={() => setShowUpload(false)}>×</button><div className="upload-symbol"><Upload size={24} /></div><h2>Upload a health report</h2><p>Drop a PDF or image here to extract values and compare them with the lab's own reference ranges.</p><label className="drop-zone"><input type="file" accept=".pdf,image/*" /><FileText size={24} /><strong>Choose a file</strong><span>PDF, JPG, or PNG up to 20 MB</span></label><small className="modal-note"><ShieldCheck size={14} /> Demo mode: files are not sent anywhere yet.</small></div></div>}
  </div>
}
export default App
