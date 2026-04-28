import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useResume } from '../context/ResumeContext'
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'
import { Plus, FileText, Trash2, Download, Loader2, Calendar, Clock, Info } from 'lucide-react'
import toast from 'react-hot-toast'

const RETENTION_DAYS = 10
const DAY_MS = 24 * 60 * 60 * 1000

function getExpiryInfo(resume) {
  let expiryMs
  if (resume.expiresAt?.toMillis) {
    expiryMs = resume.expiresAt.toMillis()
  } else if (resume.expiresAt?.seconds) {
    expiryMs = resume.expiresAt.seconds * 1000
  } else if (resume.expiresAt) {
    expiryMs = new Date(resume.expiresAt).getTime()
  } else if (resume.createdAt) {
    expiryMs = new Date(resume.createdAt).getTime() + RETENTION_DAYS * DAY_MS
  } else {
    return null
  }
  const remainingMs = expiryMs - Date.now()
  const daysLeft = Math.ceil(remainingMs / DAY_MS)
  return {
    expiryDate: new Date(expiryMs),
    daysLeft: Math.max(0, daysLeft),
    expired: remainingMs <= 0,
  }
}

function expiryBadgeClass(daysLeft) {
  if (daysLeft <= 1) return 'bg-red-50 text-red-700 border-red-200'
  if (daysLeft <= 3) return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-green-50 text-green-700 border-green-200'
}

function expiryLabel(daysLeft) {
  if (daysLeft === 0) return 'Expires today'
  if (daysLeft === 1) return '1 day left'
  return `${daysLeft} days left`
}

export default function Dashboard() {
  const { currentUser } = useAuth()
  const { resetResume } = useResume()
  const navigate = useNavigate()
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) { navigate('/login'); return }
    fetchResumes()
  }, [currentUser])

  async function fetchResumes() {
    setLoading(true)
    try {
      const q = query(collection(db, 'users', currentUser.uid, 'resumes'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }))

      // Auto-cleanup any resume past its 10-day expiry on the client side too
      // (Firestore TTL handles it server-side eventually, but this gives instant cleanup)
      const live = []
      for (const r of all) {
        const info = getExpiryInfo(r)
        if (info?.expired) {
          deleteDoc(doc(db, 'users', currentUser.uid, 'resumes', r.id)).catch(() => {})
        } else {
          live.push(r)
        }
      }
      setResumes(live)
    } catch {
      toast.error('Failed to load resumes.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this resume?')) return
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'resumes', id))
      setResumes((prev) => prev.filter((r) => r.id !== id))
      toast.success('Resume deleted.')
    } catch {
      toast.error('Failed to delete.')
    }
  }

  function handleNewResume() {
    resetResume()
    navigate('/resume-form')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {currentUser?.displayName?.split(' ')[0] || 'there'} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">Manage your AI-generated resumes</p>
          </div>
          <button onClick={handleNewResume} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Resume
          </button>
        </div>

        {/* Retention notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
          <div className="text-sm text-blue-800">
            <span className="font-semibold">10-day retention:</span> Saved resumes are automatically deleted {RETENTION_DAYS} days after creation.
            Download a PDF or Word copy if you'd like to keep it longer.
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8 max-w-md">
          {[
            { label: 'Saved Resumes', value: resumes.length },
            { label: 'AI Templates', value: 5 },
          ].map((stat) => (
            <div key={stat.label} className="card text-center">
              <div className="text-2xl font-bold text-primary-600">{stat.value}</div>
              <div className="text-gray-500 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Resume List */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Resumes</h2>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
          </div>
        ) : resumes.length === 0 ? (
          <div className="card text-center py-16 border-2 border-dashed border-gray-200">
            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-700 mb-1">No resumes yet</h3>
            <p className="text-gray-400 text-sm mb-5">Create your first AI-powered resume in under a minute</p>
            <button onClick={handleNewResume} className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Build Your First Resume
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {resumes.map((resume) => {
              const expiry = getExpiryInfo(resume)
              return (
                <div key={resume.id} className="card hover:shadow-md transition-shadow group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary-600" />
                    </div>
                    <button onClick={() => handleDelete(resume.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 p-1 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{resume.jobTitle || 'My Resume'}</h3>
                  <div className="text-xs text-gray-400 capitalize mb-2">{resume.selectedTemplate} Template</div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                    <Calendar className="w-3 h-3" />
                    Saved {new Date(resume.createdAt).toLocaleDateString()}
                  </div>
                  {expiry && (
                    <div
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border mb-3 ${expiryBadgeClass(expiry.daysLeft)}`}
                      title={`Expires on ${expiry.expiryDate.toLocaleDateString()}`}
                    >
                      <Clock className="w-3 h-3" />
                      {expiryLabel(expiry.daysLeft)}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button className="flex-1 btn-outline text-xs py-1.5 flex items-center justify-center gap-1.5">
                      <Download className="w-3 h-3" /> Download
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
