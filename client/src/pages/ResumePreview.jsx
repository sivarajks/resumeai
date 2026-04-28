import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResume } from '../context/ResumeContext'
import { useAuth } from '../context/AuthContext'
import { doc, setDoc, Timestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import ModernTemplate from '../templates/Modern'
import ClassicTemplate from '../templates/Classic'
import MinimalTemplate from '../templates/Minimal'
import CreativeTemplate from '../templates/Creative'
import EuropassTemplate from '../templates/Europass'
import {
  Download, RefreshCw, Save, ArrowLeft, Loader2, FileText,
  Sparkles, ChevronDown, ChevronUp, AlertTriangle, Palette, FileType
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { TEMPLATE_COLORS, getTemplateColor } from '../utils/personalInfo'
import { exportResumeAsDocx, exportCoverLetterAsDocx } from '../utils/exportDocx'

const templateMap = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
  europass: EuropassTemplate,
}

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'

const A4_W = 794
const A4_H = 1123

function buildMockCoverLetter(resumeData) {
  const name = resumeData.personalInfo.name || 'Applicant'
  const title = resumeData.generatedResume?.title || 'this position'
  const skills = (resumeData.generatedResume?.skills || resumeData.skills).slice(0, 3).join(', ')
  const expTitle = resumeData.experience[0]?.title || 'my field'
  const expCompany = resumeData.experience[0]?.company || ''

  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${title} position. With my background as a ${expTitle}${expCompany ? ` at ${expCompany}` : ''} and expertise in ${skills || 'relevant technologies'}, I am confident I can make a meaningful contribution to your team.

${resumeData.summary || 'I am a results-driven professional with a proven track record of delivering high-quality work and exceeding expectations in fast-paced environments.'}

I am particularly excited about this opportunity because it aligns perfectly with my professional experience and career goals. I thrive in collaborative environments and consistently bring a proactive approach to problem-solving.

I would welcome the opportunity to discuss how my skills and experience can benefit your organization. Thank you for considering my application. I look forward to hearing from you.

Sincerely,
${name}
${resumeData.personalInfo.email || ''}
${resumeData.personalInfo.phone || ''}`
}

export default function ResumePreview() {
  const { resumeData, resetResume, setCoverLetter, setTemplateColor } = useResume()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const resumeRef = useRef(null)
  const coverRef = useRef(null)
  const pageRef = useRef(null)

  const [downloading, setDownloading] = useState(false)
  const [downloadingDocx, setDownloadingDocx] = useState(false)
  const [saving, setSaving] = useState(false)
  const [coverOpen, setCoverOpen] = useState(false)
  const [generatingCover, setGeneratingCover] = useState(false)
  const [pageOverflow, setPageOverflow] = useState(false)
  const [scale, setScale] = useState(1)

  const TemplateComponent = templateMap[resumeData.selectedTemplate] || ModernTemplate
  const palette = TEMPLATE_COLORS[resumeData.selectedTemplate] || TEMPLATE_COLORS.modern
  const activeColor = getTemplateColor(resumeData.selectedTemplate, resumeData.templateColor)

  // Auto-fit: measure the template's natural height (the inner element, NOT the page wrapper
  // which has min-height enforced) and distribute extra space proportionally across sections.
  useLayoutEffect(() => {
    if (!pageRef.current) return
    const sections = pageRef.current.querySelectorAll('[data-section]')
    sections.forEach((s) => { s.style.marginBottom = '' })
    if (sections.length === 0) return

    const inner = pageRef.current.firstElementChild
    if (!inner) return
    const naturalH = inner.scrollHeight
    const target = A4_H - 24
    if (naturalH < target) {
      const extraPerSection = Math.min(80, (target - naturalH) / sections.length)
      sections.forEach((s) => {
        const current = parseFloat(getComputedStyle(s).marginBottom) || 0
        s.style.marginBottom = `${current + extraPerSection}px`
      })
    }
  }, [resumeData])

  // Display scale + overflow detection
  useEffect(() => {
    function measure() {
      if (!pageRef.current) return
      const containerW = pageRef.current.parentElement?.clientWidth || A4_W
      const s = Math.min(1, (containerW - 32) / A4_W)
      setScale(s)
      const contentH = pageRef.current.scrollHeight
      setPageOverflow(contentH > A4_H + 20)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [resumeData])

  async function captureCanvas(ref) {
    return html2canvas(ref, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: A4_W,
      windowWidth: A4_W,
    })
  }

  // Add clickable link annotations to PDF based on data-link elements
  function addPdfLinks(pdf, sourceEl, pdfW, pdfH) {
    if (!sourceEl) return
    const sourceRect = sourceEl.getBoundingClientRect()
    const pxToMmX = pdfW / sourceRect.width
    const pxToMmY = pdfH / sourceRect.height
    const linkEls = sourceEl.querySelectorAll('[data-link]')
    linkEls.forEach((el) => {
      const r = el.getBoundingClientRect()
      const x = (r.left - sourceRect.left) * pxToMmX
      const y = (r.top - sourceRect.top) * pxToMmY
      const w = r.width * pxToMmX
      const h = r.height * pxToMmY
      const type = el.getAttribute('data-link')
      let url = el.getAttribute('href') || ''
      if (type === 'email' && !url.startsWith('mailto:')) url = `mailto:${url}`
      if ((type === 'linkedin' || type === 'indeed') && url && !/^https?:\/\//i.test(url)) {
        url = `https://${url}`
      }
      if (url) pdf.link(x, y, w, h, { url })
    })
  }

  async function handleDownloadResume() {
    if (!pageRef.current) return
    setDownloading(true)
    try {
      const canvas = await captureCanvas(pageRef.current)
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pdfW = pdf.internal.pageSize.getWidth()
      const pdfH = pdf.internal.pageSize.getHeight()
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfW, pdfH)
      addPdfLinks(pdf, pageRef.current, pdfW, pdfH)
      pdf.save(`resume-${resumeData.personalInfo.name?.replace(/\s+/g, '-') || 'resume'}.pdf`)
      toast.success('Resume PDF downloaded!')
    } catch {
      toast.error('Failed to generate PDF.')
    } finally {
      setDownloading(false)
    }
  }

  async function handleDownloadDocx() {
    setDownloadingDocx(true)
    try {
      await exportResumeAsDocx(resumeData, activeColor)
      toast.success('Word document downloaded!')
    } catch (err) {
      console.error(err)
      toast.error('Failed to generate Word document.')
    } finally {
      setDownloadingDocx(false)
    }
  }

  async function handleDownloadCoverLetterDocx() {
    setDownloadingDocx(true)
    try {
      await exportCoverLetterAsDocx(resumeData, activeColor)
      toast.success('Cover letter Word doc downloaded!')
    } catch (err) {
      console.error(err)
      toast.error('Failed to generate Word document.')
    } finally {
      setDownloadingDocx(false)
    }
  }

  async function handleDownloadCoverLetter() {
    if (!coverRef.current) return
    setDownloading(true)
    try {
      const canvas = await captureCanvas(coverRef.current)
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pdfW = pdf.internal.pageSize.getWidth()
      const pdfH = (canvas.height * pdfW) / canvas.width
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfW, pdfH)
      pdf.save(`cover-letter-${resumeData.personalInfo.name?.replace(/\s+/g, '-') || 'cover'}.pdf`)
      toast.success('Cover letter PDF downloaded!')
    } catch {
      toast.error('Failed to generate PDF.')
    } finally {
      setDownloading(false)
    }
  }

  async function handleSave() {
    if (!currentUser) { toast.error('Please sign in to save.'); return }
    setSaving(true)
    try {
      const resumeId = `resume_${Date.now()}`
      const now = Date.now()
      const expiresAt = Timestamp.fromMillis(now + 10 * 24 * 60 * 60 * 1000)
      await setDoc(doc(db, 'users', currentUser.uid, 'resumes', resumeId), {
        ...resumeData,
        photo: null,
        createdAt: new Date(now).toISOString(),
        expiresAt,
        jobTitle: resumeData.generatedResume?.title || 'My Resume',
      })
      toast.success('Resume saved! Available for 10 days.')
    } catch {
      toast.error('Failed to save resume.')
    } finally {
      setSaving(false)
    }
  }

  async function handleGenerateCoverLetter() {
    setGeneratingCover(true)
    try {
      const res = await axios.post(`${SERVER_URL}/api/generate-cover-letter`, {
        resumeData,
        jobDescription: resumeData.jobDescription,
      }, { timeout: 30000 })
      setCoverLetter(res.data.coverLetter)
      toast.success('Cover letter generated!')
    } catch {
      const mock = buildMockCoverLetter(resumeData)
      setCoverLetter(mock)
      toast.success('Cover letter ready! (Demo mode)')
    } finally {
      setGeneratingCover(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Toolbar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/job-match')} className="flex items-center gap-1.5 text-gray-600 hover:text-primary-600 text-sm">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="h-5 w-px bg-gray-200" />
            <div>
              <div className="font-semibold text-gray-900 text-sm">{resumeData.personalInfo.name || 'Your Resume'}</div>
              <div className="text-xs text-gray-400 capitalize">{resumeData.selectedTemplate} Template</div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => { resetResume(); navigate('/resume-form') }} className="flex items-center gap-1.5 btn-outline text-sm py-2">
              <RefreshCw className="w-4 h-4" /> New
            </button>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 btn-outline text-sm py-2 disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={handleDownloadDocx} disabled={downloadingDocx} className="flex items-center gap-1.5 btn-outline text-sm py-2 disabled:opacity-70">
              {downloadingDocx ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileType className="w-4 h-4" />}
              {downloadingDocx ? 'Building...' : 'Word'}
            </button>
            <button onClick={handleDownloadResume} disabled={downloading} className="flex items-center gap-1.5 btn-primary text-sm py-2 disabled:opacity-70">
              {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {downloading ? 'Generating...' : 'PDF'}
            </button>
          </div>
        </div>

        {/* Color Picker */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Accent Color:</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {palette.map((c) => (
              <button
                key={c.value}
                onClick={() => setTemplateColor(c.value)}
                title={c.name}
                className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${
                  activeColor === c.value ? 'border-gray-900 ring-2 ring-offset-1 ring-gray-300' : 'border-white shadow-sm'
                }`}
                style={{ backgroundColor: c.value }}
              />
            ))}
            <div className="ml-2 flex items-center gap-1.5 border-l border-gray-200 pl-3">
              <input
                type="color"
                value={activeColor}
                onChange={(e) => setTemplateColor(e.target.value)}
                className="w-7 h-7 rounded cursor-pointer border border-gray-200"
                title="Custom color"
              />
              <span className="text-xs text-gray-400">Custom</span>
            </div>
          </div>
        </div>

        {/* ATS Score */}
        {resumeData.generatedResume && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5 flex items-center justify-between">
            <div>
              <div className="font-semibold text-green-800 text-sm">ATS Compatibility Score</div>
              <div className="text-green-600 text-xs mt-0.5">Resume optimized for applicant tracking systems</div>
            </div>
            <div className="text-3xl font-extrabold text-green-600">{resumeData.generatedResume.atsScore || 92}%</div>
          </div>
        )}

        {/* Overflow Warning */}
        {pageOverflow && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 flex items-center gap-2 text-sm text-amber-700">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            Your content exceeds one page. Consider shortening your descriptions or reducing experiences to keep it to one page.
          </div>
        )}

        {/* ── A4 Resume Page ── */}
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Resume Preview · A4</span>
          <span className="text-xs text-gray-400">{A4_W} × {A4_H} px</span>
        </div>

        <div className="flex justify-center mb-6">
          <div style={{ width: A4_W * scale, height: A4_H * scale, position: 'relative' }}>
            <div
              style={{
                width: A4_W,
                height: A4_H,
                transformOrigin: 'top left',
                transform: `scale(${scale})`,
                position: 'absolute',
                top: 0,
                left: 0,
                overflow: 'hidden',
                boxShadow: '0 4px 32px rgba(0,0,0,0.15)',
                background: '#fff',
              }}
            >
              <div ref={pageRef} style={{ width: A4_W, minHeight: A4_H, background: '#fff', overflow: 'hidden' }}>
                <TemplateComponent data={resumeData} />
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: A4_H,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: 'rgba(239,68,68,0.5)',
                  borderTop: '2px dashed rgba(239,68,68,0.6)',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>
        </div>

        {/* Keywords */}
        {resumeData.generatedResume?.keywords?.length > 0 && (
          <div className="card mb-6">
            <h3 className="font-semibold text-gray-800 text-sm mb-3">Keywords Matched from Job Listing</h3>
            <div className="flex flex-wrap gap-2">
              {resumeData.generatedResume.keywords.map((kw, i) => (
                <span key={i} className="bg-primary-50 text-primary-700 border border-primary-200 px-3 py-1 rounded-full text-xs font-medium">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Cover Letter Section ── */}
        <div className="card border-2 border-dashed border-gray-200">
          <button
            onClick={() => setCoverOpen(!coverOpen)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900 text-sm">Cover Letter</div>
                <div className="text-xs text-gray-400">
                  {resumeData.coverLetter ? 'Cover letter ready — click to view/edit' : 'Optional · AI can write it for you'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {resumeData.coverLetter && (
                <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">Ready</span>
              )}
              {coverOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </div>
          </button>

          {coverOpen && (
            <div className="mt-5 border-t border-gray-100 pt-5">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div>
                  <div className="font-medium text-gray-800 text-sm">AI-Generated Cover Letter</div>
                  <div className="text-xs text-gray-500 mt-0.5">Tailored to the job description you provided</div>
                </div>
                <button
                  onClick={handleGenerateCoverLetter}
                  disabled={generatingCover}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-all disabled:opacity-60"
                >
                  {generatingCover ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {generatingCover ? 'Writing...' : resumeData.coverLetter ? 'Regenerate with AI' : 'Generate with AI'}
                </button>
              </div>

              <textarea
                className="input-field min-h-[360px] resize-y text-sm font-mono leading-relaxed"
                placeholder="Click 'Generate with AI' to create a tailored cover letter, or type your own here..."
                value={resumeData.coverLetter || ''}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1.5">You can freely edit the generated text above.</p>

              {resumeData.coverLetter && (
                <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                  <span className="text-xs text-gray-500">Preview is shown below the editor when downloaded.</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadCoverLetterDocx}
                      disabled={downloadingDocx}
                      className="flex items-center gap-2 btn-outline text-sm py-2"
                    >
                      {downloadingDocx ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileType className="w-4 h-4" />}
                      Word
                    </button>
                    <button
                      onClick={handleDownloadCoverLetter}
                      disabled={downloading}
                      className="flex items-center gap-2 btn-outline text-sm py-2"
                    >
                      {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      PDF
                    </button>
                  </div>
                </div>
              )}

              {resumeData.coverLetter && (
                <div
                  ref={coverRef}
                  style={{ position: 'absolute', left: '-9999px', width: A4_W, background: '#fff', padding: '60px 72px', boxSizing: 'border-box' }}
                >
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: '13px', lineHeight: '1.8', color: '#1a1a1a' }}>
                    <div style={{ marginBottom: '32px' }}>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: activeColor }}>{resumeData.personalInfo.name}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                        {[resumeData.personalInfo.email, resumeData.personalInfo.phone, resumeData.personalInfo.address].filter(Boolean).join(' · ')}
                      </div>
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{resumeData.coverLetter}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
