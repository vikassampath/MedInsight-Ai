import { useCallback, useEffect, useRef, useState } from 'react'
import { Activity, ArrowUpRight, BookOpen, ChevronDown, FileText, ImagePlus, LayoutDashboard, MessageCircleQuestion, ShieldCheck, Sparkles, Upload, UsersRound } from 'lucide-react'
import { ACCEPTED_REPORT_TYPES, formatDisplayDate, getAssistantAnswer, getAssistantSource, getGreeting, isSupportedReportFile, MAX_UPLOAD_SIZE_BYTES, sectionDetails } from './appLogic'
import './App.css'

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Reports', icon: FileText },
  { label: 'Imaging', icon: ImagePlus },
  { label: 'Knowledge', icon: BookOpen },
  { label: 'Patients', icon: UsersRound },
]
const measurements = [
  { label: 'Hemoglobin', value: '12.8', unit: 'g/dL', trend: '+0.4' },
  { label: 'LDL cholesterol', value: '142', unit: 'mg/dL', trend: '+12' },
  { label: 'TSH', value: '2.4', unit: 'mIU/L', trend: '-0.2' },
]

function App() {
  const [activeNav, setActiveNav] = useState('Overview')
  const [showUpload, setShowUpload] = useState(false)
  const [question, setQuestion] = useState('')
  const [asked, setAsked] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState('')
  const [uploadComplete, setUploadComplete] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [displayDate] = useState(() => formatDisplayDate(new Date()))
  const [greeting] = useState(() => getGreeting(new Date()))
  const answer = getAssistantAnswer(question)
  const answerSource = getAssistantSource(question)

  const handleFile = (file: File | undefined) => {
    setUploadError('')
    setSelectedFile(null)
    setUploadComplete(false)
    if (!file) return
    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      setUploadError('That file is larger than 20 MB. Choose a smaller file.')
      return
    }
    if (!file.size) {
      setUploadError('That file is empty. Choose another file.')
      return
    }
    if (!isSupportedReportFile(file)) {
      setUploadError('Choose a PDF, JPG, or PNG image with a matching file type.')
      return
    }
    setSelectedFile(file)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0])
    event.currentTarget.value = ''
  }
  const handleFileDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    handleFile(event.dataTransfer.files[0])
  }

  const closeUpload = useCallback(() => {
    setShowUpload(false)
    setSelectedFile(null)
    setUploadError('')
    setUploadComplete(false)
  }, [])

  useEffect(() => {
    if (!showUpload) return
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    closeButtonRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeUpload()
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button, input')]
        .filter((element) => !element.hasAttribute('disabled'))
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [showUpload, closeUpload])

  const handleUpload = () => {
    if (!selectedFile) {
      setUploadError('Choose a PDF or image before continuing.')
      return
    }
    setUploadComplete(true)
  }

  const activeSection = sectionDetails[activeNav]

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><Activity size={18} /></span><span>medinsight<span className="brand-dot">.</span></span></div>
      <div className="workspace-switcher"><span className="avatar small">MI</span><span><strong>My workspace</strong><small>Personal workspace</small></span><ChevronDown size={15} /></div>
      <nav className="main-nav" aria-label="Main navigation"><p className="nav-label">Workspace</p>{navItems.map(({ label, icon: Icon }) => <button key={label} aria-label={label} aria-current={activeNav === label ? 'page' : undefined} className={`nav-item ${activeNav === label ? 'active' : ''}`} onClick={() => setActiveNav(label)}><Icon size={18} /><span>{label}</span></button>)}</nav>
      <div className="sidebar-bottom"><div className="nav-item"><ShieldCheck size={18} /><span>Privacy & safety</span></div><div className="safety-mini"><span className="pulse-dot" /><span><strong>Safety layer active</strong><small>Information, not diagnosis</small></span></div></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><div className="crumbs"><span>Workspace</span><span>/</span><strong>{activeNav}</strong></div><div className="top-actions"><div className="avatar" role="img" aria-label="Demo workspace">MI</div></div></header>
      <div className={`content-wrap ${activeSection ? 'section-mode' : ''}`}>
        <section className="welcome-row"><div><p className="eyebrow">{displayDate}</p><h1>{activeSection ? activeSection.title : greeting} <span>✦</span></h1><p className="lede">{activeSection?.description || 'A sample view of health information, with context you can understand.'}</p></div><button className="primary-button" onClick={() => setShowUpload(true)}><Upload size={17} /> Preview report upload</button></section>
        {activeSection && <section className="section-placeholder"><div className="placeholder-icon"><Activity size={22} /></div><h2>{activeSection.title} is not connected yet</h2><p>{activeSection.description}</p><button className="primary-button" onClick={() => setActiveNav('Overview')}>Back to overview</button></section>}
        {!activeSection && <>
        <section className="notice"><div className="notice-icon"><ShieldCheck size={20} /></div><div><strong>Demo data only</strong><p>These examples are not patient records or medical advice. Lab ranges and interpretation depend on the individual and the reporting lab.</p></div></section>
        <div className="section-heading"><div><h2>Illustrative health snapshot</h2><p>Example values only · no real patient data</p></div><button className="text-button" onClick={() => setActiveNav('Reports')}>View history <ArrowUpRight size={16} /></button></div>
        <section className="metric-grid">{measurements.map((item) => <article className="metric-card" key={item.label}><div className="metric-top"><span>{item.label}</span></div><div className="metric-value">{item.value}<small>{item.unit}</small></div><div className="metric-foot"><span className="status demo">Example only</span><span className="trend">{item.trend} <small>sample trend</small></span></div></article>)}<article className="metric-card trend-card"><div className="metric-top"><span>Sample activity</span><Activity size={18} /></div><div className="chart-label"><strong>7,842</strong><small>example steps this week</small></div><div className="mini-chart" aria-hidden="true"><span style={{ height: '38%' }} /><span style={{ height: '55%' }} /><span style={{ height: '45%' }} /><span style={{ height: '70%' }} /><span style={{ height: '58%' }} /><span className="today" style={{ height: '82%' }} /><span style={{ height: '64%' }} /></div><div className="chart-days" aria-hidden="true"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div></article></section>
        <section className="lower-grid"><div className="panel reports-panel"><div className="panel-heading"><div><h2>Sample reports</h2><p>Illustrative records · no analysis performed</p></div><button className="text-button" onClick={() => setActiveNav('Reports')}>See all <ArrowUpRight size={16} /></button></div><div className="report-list"><div className="report-row"><span className="file-icon green"><FileText size={17} /></span><div><strong>Comprehensive metabolic panel</strong><small>Sep 04, 2026 · PDF report</small></div><span className="tag good">Demo</span></div><div className="report-row"><span className="file-icon orange"><FileText size={17} /></span><div><strong>Lipid profile</strong><small>Aug 22, 2026 · PDF report</small></div><span className="tag review">Demo</span></div><div className="report-row"><span className="file-icon blue"><ImagePlus size={17} /></span><div><strong>Chest X-ray</strong><small>Aug 15, 2026 · DICOM image</small></div><span className="tag processing">Demo</span></div></div></div>
          <div className="panel ask-panel"><div className="ask-orb"><Sparkles size={22} /></div><p className="eyebrow">KNOWLEDGE ASSISTANT</p><h2>Make sense of the medical terms.</h2><p>Explore sample explanations with links to MedlinePlus. This demo does not analyze reports.</p><div className="ask-input"><MessageCircleQuestion size={18} /><input aria-label="Ask about a medical term or result" value={question} onChange={(event) => { setQuestion(event.target.value); setAsked(false) }} onKeyDown={(event) => event.key === 'Enter' && question.trim() && setAsked(true)} placeholder="e.g. What does hemoglobin mean?" /><button aria-label="Ask question" onClick={() => question.trim() && setAsked(true)}><ArrowUpRight size={17} /></button></div>{asked && <div className="answer" aria-live="polite"><strong>{answer}</strong>{answerSource && <a href={answerSource.url} target="_blank" rel="noreferrer">{answerSource.label}</a>}<span>For general education; discuss personal results with a health professional.</span></div>}<div className="suggestions"><button onClick={() => { setQuestion('What does hemoglobin mean?'); setAsked(false) }}>What does hemoglobin mean?</button><button onClick={() => { setQuestion('What is LDL cholesterol?'); setAsked(false) }}>What is LDL cholesterol?</button></div></div></section>
        </>}
      </div>
    </main>
    {showUpload && <div className="modal-backdrop" onClick={closeUpload}><div ref={dialogRef} className="upload-modal" role="dialog" aria-modal="true" aria-labelledby="upload-title" onClick={(event) => event.stopPropagation()}><button ref={closeButtonRef} className="close-button" aria-label="Close upload dialog" onClick={closeUpload}>×</button><div className="upload-symbol"><Upload size={24} /></div><h2 id="upload-title">Preview report upload</h2><p>Select a PDF or image to preview this demo flow. Nothing is uploaded, saved, or analyzed.</p><label className="drop-zone" onDragOver={(event) => event.preventDefault()} onDrop={handleFileDrop}><input type="file" accept={ACCEPTED_REPORT_TYPES} onChange={handleFileChange} /><FileText size={24} /><strong>{selectedFile ? selectedFile.name : 'Choose a file'}</strong><span className={uploadError ? 'upload-error' : ''} role={uploadError ? 'alert' : undefined}>{uploadError || 'PDF, JPG, or PNG up to 20 MB'}</span></label><button className="upload-submit" type="button" onClick={handleUpload}>{uploadComplete ? 'Selection checked (demo)' : 'Check selection (demo)'}</button><small className="modal-note"><ShieldCheck size={14} /> Demo only: file stays in this page and is not stored or analyzed.</small></div></div>}
  </div>
}
export default App
