import { useEffect, useState } from 'react'
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState('')
  const [uploadComplete, setUploadComplete] = useState(false)
  const displayDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(new Date()).toUpperCase()
  const answer = question.toLowerCase().includes('ldl')
    ? 'LDL is a type of cholesterol that can contribute to plaque buildup in arteries when levels stay high.'
    : question.toLowerCase().includes('hemoglobin')
      ? 'Hemoglobin is a protein in red blood cells that carries oxygen through your body.'
      : 'Ask about a health term or result and MedInsight will provide educational context.'

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setUploadError('')
    setSelectedFile(null)
    setUploadComplete(false)
    if (!file) return
    if (file.size > 20 * 1024 * 1024) {
      setUploadError('That file is larger than 20 MB. Choose a smaller file.')
      return
    }
    setSelectedFile(file)
  }

  useEffect(() => {
    if (!showUpload) return
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowUpload(false)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [showUpload])

  const closeUpload = () => {
    setShowUpload(false)
    setSelectedFile(null)
    setUploadError('')
    setUploadComplete(false)
  }

  const handleUpload = () => {
    if (!selectedFile) {
      setUploadError('Choose a PDF or image before continuing.')
      return
    }
    setUploadComplete(true)
  }

  const sectionDetails: Record<string, { title: string; description: string }> = {
    Reports: { title: 'Your reports', description: 'Review uploaded reports and their analysis status.' },
    Imaging: { title: 'Your imaging', description: 'Keep imaging studies and processing updates in one place.' },
    Knowledge: { title: 'Knowledge assistant', description: 'Explore plain-language context for health terms and results.' },
    Patients: { title: 'Your patients', description: 'Patient history will appear here when connected to a workspace.' },
  }
  const activeSection = sectionDetails[activeNav]

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><Activity size={18} /></span><span>medinsight<span className="brand-dot">.</span></span></div>
      <div className="workspace-switcher"><span className="avatar small">MI</span><span><strong>My workspace</strong><small>Personal workspace</small></span><ChevronDown size={15} /></div>
      <nav className="main-nav" aria-label="Main navigation"><p className="nav-label">Workspace</p>{navItems.map(({ label, icon: Icon, badge }) => <button key={label} className={`nav-item ${activeNav === label ? 'active' : ''}`} onClick={() => setActiveNav(label)}><Icon size={18} /><span>{label}</span>{badge && <em>{badge}</em>}</button>)}</nav>
      <div className="sidebar-bottom"><button className="nav-item"><ShieldCheck size={18} /><span>Privacy & safety</span></button><div className="safety-mini"><span className="pulse-dot" /><span><strong>Safety layer active</strong><small>Information, not diagnosis</small></span></div></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><div className="crumbs"><span>Workspace</span><span>/</span><strong>{activeNav}</strong></div><div className="top-actions"><button className="icon-button" aria-label="Search"><Search size={19} /></button><button className="icon-button" aria-label="Notifications"><Bell size={19} /><i /></button><div className="avatar">MI</div></div></header>
      <div className={`content-wrap ${activeSection ? 'section-mode' : ''}`}>
        <section className="welcome-row"><div><p className="eyebrow">{displayDate}</p><h1>{activeSection ? activeSection.title : 'Good morning'} <span>✦</span></h1><p className="lede">{activeSection?.description || 'A clear view of your health, with context you can understand.'}</p></div><button className="primary-button" onClick={() => setShowUpload(true)}><Upload size={17} /> Upload a report</button></section>
        {activeSection && <section className="section-placeholder"><div className="placeholder-icon"><Activity size={22} /></div><h2>{activeSection.title} is ready for your workspace</h2><p>{activeSection.description}</p><button className="primary-button" onClick={() => setActiveNav('Overview')}>Back to overview</button></section>}
        {!activeSection && <>
        <section className="notice"><div className="notice-icon"><ShieldCheck size={20} /></div><div><strong>Your health information stays yours.</strong><p>MedInsight provides educational context, not a medical diagnosis. Always discuss results with your care team.</p></div><button aria-label="More safety information"><ArrowUpRight size={18} /></button></section>
        <div className="section-heading"><div><h2>Your health snapshot</h2><p>Latest values across your recent reports</p></div><button className="text-button" onClick={() => setActiveNav('Reports')}>View history <ArrowUpRight size={16} /></button></div>
        <section className="metric-grid">{measurements.map((item) => <article className="metric-card" key={item.label}><div className="metric-top"><span>{item.label}</span><MoreHorizontal size={18} /></div><div className="metric-value">{item.value}<small>{item.unit}</small></div><div className="metric-foot"><span className={`status ${item.tone}`}><span />{item.status}</span><span className="trend">{item.trend} <small>vs last</small></span></div></article>)}<article className="metric-card trend-card"><div className="metric-top"><span>Overall activity</span><Activity size={18} /></div><div className="chart-label"><strong>7,842</strong><small>steps this week</small></div><div className="mini-chart"><span style={{ height: '38%' }} /><span style={{ height: '55%' }} /><span style={{ height: '45%' }} /><span style={{ height: '70%' }} /><span style={{ height: '58%' }} /><span className="today" style={{ height: '82%' }} /><span style={{ height: '64%' }} /></div><div className="chart-days"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div></article></section>
        <section className="lower-grid"><div className="panel reports-panel"><div className="panel-heading"><div><h2>Recent reports</h2><p>Analysis history and findings</p></div><button className="text-button" onClick={() => setActiveNav('Reports')}>See all <ArrowUpRight size={16} /></button></div><div className="report-list"><div className="report-row"><span className="file-icon green"><FileText size={17} /></span><div><strong>Comprehensive metabolic panel</strong><small>Sep 04, 2026 · PDF report</small></div><span className="tag good">Analyzed</span><ArrowUpRight size={17} /></div><div className="report-row"><span className="file-icon orange"><FileText size={17} /></span><div><strong>Lipid profile</strong><small>Aug 22, 2026 · PDF report</small></div><span className="tag review">Needs review</span><ArrowUpRight size={17} /></div><div className="report-row"><span className="file-icon blue"><ImagePlus size={17} /></span><div><strong>Chest X-ray</strong><small>Aug 15, 2026 · DICOM image</small></div><span className="tag processing">Processing</span><ArrowUpRight size={17} /></div></div></div>
          <div className="panel ask-panel"><div className="ask-orb"><Sparkles size={22} /></div><p className="eyebrow">KNOWLEDGE ASSISTANT</p><h2>Make sense of the medical terms.</h2><p>Ask a question and get a plain-language explanation backed by trusted sources.</p><div className="ask-input"><MessageCircleQuestion size={18} /><input value={question} onChange={(event) => { setQuestion(event.target.value); setAsked(false) }} onKeyDown={(event) => event.key === 'Enter' && question.trim() && setAsked(true)} placeholder="e.g. What does hemoglobin mean?" /><button aria-label="Ask question" onClick={() => question.trim() && setAsked(true)}><ArrowUpRight size={17} /></button></div>{asked && <div className="answer"><strong>{answer}</strong><span>Educational answer · Source review required</span></div>}<div className="suggestions"><button onClick={() => { setQuestion('What does hemoglobin mean?'); setAsked(false) }}>What does hemoglobin mean?</button><button onClick={() => { setQuestion('What is LDL cholesterol?'); setAsked(false) }}>What is LDL cholesterol?</button></div></div></section>
        </>}
      </div>
    </main>
    {showUpload && <div className="modal-backdrop" onClick={closeUpload}><div className="upload-modal" role="dialog" aria-modal="true" aria-labelledby="upload-title" onClick={(event) => event.stopPropagation()}><button className="close-button" aria-label="Close upload dialog" onClick={closeUpload}>×</button><div className="upload-symbol"><Upload size={24} /></div><h2 id="upload-title">Upload a health report</h2><p>Drop a PDF or image here to extract values and compare them with the lab's own reference ranges.</p><label className="drop-zone"><input type="file" accept=".pdf,image/*" onChange={handleFileChange} /><FileText size={24} /><strong>{selectedFile ? selectedFile.name : 'Choose a file'}</strong><span className={uploadError ? 'upload-error' : ''}>{uploadError || 'PDF, JPG, or PNG up to 20 MB'}</span></label><button className="upload-submit" type="button" onClick={handleUpload}>{uploadComplete ? 'Added to reports' : 'Add report'}</button><small className="modal-note"><ShieldCheck size={14} /> Demo mode: files are not sent anywhere yet.</small></div></div>}
  </div>
}
export default App
