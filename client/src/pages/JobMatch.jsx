import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResume } from '../context/ResumeContext'
import { useAuth } from '../context/AuthContext'
import { Link2, FileText, Loader2, Sparkles, AlertCircle, ChevronRight } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'

function buildMockResume(resumeData, jobDescription) {
  const keywords = jobDescription
    .match(/\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*|[A-Z]{2,}|[a-z]+(?:\.js|\.py|SQL|API|ML|AI))\b/g)
    ?.filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 12) || ['Communication', 'Problem Solving', 'Teamwork', 'Leadership']

  const allSkills = [...new Set([...resumeData.skills, ...keywords])].slice(0, 16)

  return {
    title: jobDescription.split('\n')[0]?.substring(0, 60) || 'Professional Role',
    summary: resumeData.summary ||
      `Results-driven professional with proven experience in delivering high-impact solutions. Skilled in ${allSkills.slice(0, 3).join(', ')}, with a strong track record of exceeding expectations and driving organizational growth.`,
    experience: resumeData.experience.map((exp) => ({
      ...exp,
      description: exp.description ||
        `• Led key initiatives and delivered measurable results\n• Collaborated cross-functionally to drive project success\n• Applied ${allSkills[0] || 'technical'} expertise to solve complex challenges`,
    })),
    education: resumeData.education,
    certificates: resumeData.certificates,
    skills: allSkills,
    keywords: keywords.slice(0, 12),
    atsScore: Math.floor(Math.random() * 8) + 88,
  }
}

export default function JobMatch() {
  const { resumeData, setGeneratedResume, updateSection } = useResume()
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState('url') // 'url' | 'text'
  const [jobUrl, setJobUrl] = useState('')
  const [jobText, setJobText] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')

  async function handleGenerate() {
    if (mode === 'url' && !jobUrl.trim()) { toast.error('Please enter a job listing URL.'); return }
    if (mode === 'text' && !jobText.trim()) { toast.error('Please paste the job description.'); return }
    if (!resumeData.personalInfo.name) { toast.error('Please complete your resume form first.'); navigate('/resume-form'); return }

    setLoading(true)
    setLoadingMsg('Analyzing job listing...')

    try {
      let jobDescription = mode === 'text' ? jobText : jobUrl
      updateSection('jobDescription', jobDescription)

      setLoadingMsg('Fetching job details...')
      await new Promise((r) => setTimeout(r, 800))

      try {
        if (mode === 'url') {
          const scrapeRes = await axios.post(`${SERVER_URL}/api/scrape`, { url: jobUrl }, { timeout: 8000 })
          jobDescription = scrapeRes.data.text
        }

        setLoadingMsg('AI is crafting your personalized resume...')
        const aiRes = await axios.post(`${SERVER_URL}/api/generate-resume`, {
          resumeData,
          jobDescription,
          userId: currentUser?.uid,
        }, { timeout: 30000 })

        setGeneratedResume(aiRes.data.resume)
      } catch {
        // Server unavailable — use demo mode
        setLoadingMsg('Building your resume (demo mode)...')
        await new Promise((r) => setTimeout(r, 1200))
        const mockResume = buildMockResume(resumeData, jobDescription)
        setGeneratedResume(mockResume)
        toast.success('Resume ready! (Demo mode — add API key for full AI generation)')
        navigate('/preview')
        return
      }

      toast.success('Resume generated successfully!')
      navigate('/preview')
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
      setLoadingMsg('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" /> AI Resume Generator
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Match Your Resume to the Job</h1>
          <p className="text-gray-500 mt-2 max-w-lg mx-auto">
            Paste the job listing URL or description. AI will extract keywords and build your perfect ATS resume.
          </p>
        </div>

        <div className="card shadow-md">
          {/* Mode Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setMode('url')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === 'url' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Link2 className="w-4 h-4" /> Paste URL
            </button>
            <button
              onClick={() => setMode('text')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === 'text' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="w-4 h-4" /> Paste Text
            </button>
          </div>

          {mode === 'url' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Listing URL</label>
              <input
                type="url"
                className="input-field text-base"
                placeholder="https://www.linkedin.com/jobs/view/... or any job URL"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
              />
              <div className="flex items-start gap-2 mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  Some sites (LinkedIn, Indeed) may block automated access. If it fails, switch to <strong>Paste Text</strong> mode.
                </p>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
              <textarea
                className="input-field min-h-[200px] resize-y text-sm"
                placeholder="Paste the full job description here — role requirements, responsibilities, qualifications, skills needed..."
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1.5 text-right">{jobText.length} characters</p>
            </div>
          )}

          {/* Resume Summary */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Resume Data Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${resumeData.personalInfo.name ? 'bg-green-400' : 'bg-red-400'}`} />
                Personal Info {resumeData.personalInfo.name ? '✓' : '✗'}
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${resumeData.summary ? 'bg-green-400' : 'bg-gray-300'}`} />
                Summary {resumeData.summary ? '✓' : '(empty)'}
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${resumeData.experience.length > 0 ? 'bg-green-400' : 'bg-gray-300'}`} />
                Experience ({resumeData.experience.length})
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${resumeData.education.length > 0 ? 'bg-green-400' : 'bg-gray-300'}`} />
                Education ({resumeData.education.length})
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${resumeData.skills.length > 0 ? 'bg-green-400' : 'bg-gray-300'}`} />
                Skills ({resumeData.skills.length})
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${resumeData.selectedTemplate ? 'bg-green-400' : 'bg-gray-300'}`} />
                Template: {resumeData.selectedTemplate}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn-primary w-full py-4 text-base mt-6 flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {loadingMsg}
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate My ATS Resume
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>

          {loading && (
            <div className="mt-4">
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-600 rounded-full animate-pulse w-3/4" />
              </div>
              <p className="text-xs text-gray-400 text-center mt-2">This usually takes 10–20 seconds</p>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <button onClick={() => navigate('/templates')} className="btn-outline text-sm">← Back to Templates</button>
        </div>
      </div>
    </div>
  )
}
