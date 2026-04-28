import { useNavigate } from 'react-router-dom'
import { useResume } from '../context/ResumeContext'
import { Check, Globe } from 'lucide-react'

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    desc: 'Clean blue sidebar layout. Great for tech & engineering roles.',
    colors: ['#2563eb', '#1e40af', '#f8fafc'],
    preview: 'bg-gradient-to-br from-blue-600 to-blue-800',
    badge: null,
  },
  {
    id: 'classic',
    name: 'Classic',
    desc: 'Traditional black & white. Trusted by finance and law professionals.',
    colors: ['#1f2937', '#374151', '#ffffff'],
    preview: 'bg-gradient-to-br from-gray-800 to-gray-900',
    badge: null,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    desc: 'Ultra-clean teal accents. Works for any industry.',
    colors: ['#0f766e', '#0d9488', '#f0fdf4'],
    preview: 'bg-gradient-to-br from-teal-600 to-teal-800',
    badge: null,
  },
  {
    id: 'creative',
    name: 'Creative',
    desc: 'Bold purple design for designers, marketers & creatives.',
    colors: ['#7c3aed', '#6d28d9', '#faf5ff'],
    preview: 'bg-gradient-to-br from-violet-600 to-purple-800',
    badge: null,
  },
  {
    id: 'europass',
    name: 'Europass CV',
    desc: 'Official EU standard CV format. Ideal for European job applications.',
    colors: ['#003399', '#0050c8', '#ffffff'],
    preview: 'bg-gradient-to-br from-[#003399] to-[#0050c8]',
    badge: 'EU Standard',
  },
]

function TemplateCard({ template, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(template.id)}
      className={`relative border-2 rounded-2xl overflow-hidden text-left transition-all duration-200 hover:shadow-lg group ${
        selected ? 'border-primary-500 shadow-lg shadow-primary-100' : 'border-gray-200 hover:border-primary-300'
      }`}
    >
      {/* Preview area */}
      <div className={`${template.preview} h-48 relative flex items-center justify-center`}>
        {template.id === 'europass' ? (
          <div className="bg-white rounded-lg shadow-xl w-32 h-40 overflow-hidden opacity-90">
            <div className="bg-[#003399] h-2 w-full" />
            <div className="bg-[#003399] h-4 w-full flex items-center px-2">
              <div className="text-white text-[5px] tracking-widest">CURRICULUM VITAE</div>
            </div>
            <div className="p-1.5 space-y-1">
              <div className="flex gap-1">
                <div className="w-6 h-7 bg-gray-200 rounded" />
                <div className="flex-1 space-y-0.5 pt-0.5">
                  <div className="h-1.5 bg-[#003399] rounded w-3/4" />
                  <div className="h-1 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
              {[0.9, 0.7, 0.8, 0.6].map((w, i) => (
                <div key={i} className="h-0.5 bg-gray-200 rounded" style={{ width: `${w * 100}%` }} />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-xl w-32 h-40 p-2 opacity-90">
            <div className="w-full h-3 bg-gray-800 rounded mb-1.5" />
            <div className="w-3/4 h-1.5 bg-gray-400 rounded mb-3" />
            <div className="space-y-1">
              {[1, 0.7, 0.9, 0.6, 0.8].map((w, i) => (
                <div key={i} className="h-1 bg-gray-200 rounded" style={{ width: `${w * 100}%` }} />
              ))}
            </div>
            <div className="mt-3 w-full h-1.5 bg-gray-300 rounded" />
            <div className="mt-1.5 space-y-1">
              {[0.8, 0.6].map((w, i) => (
                <div key={i} className="h-1 bg-gray-200 rounded" style={{ width: `${w * 100}%` }} />
              ))}
            </div>
          </div>
        )}

        {template.badge && (
          <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Globe className="w-3 h-3" /> {template.badge}
          </div>
        )}
        {selected && (
          <div className="absolute top-3 right-3 w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-gray-900">{template.name}</h3>
          <div className="flex gap-1">
            {template.colors.map((c, i) => (
              <div key={i} className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
        <p className="text-gray-500 text-xs leading-relaxed">{template.desc}</p>
      </div>
    </button>
  )
}

export default function TemplateSelect() {
  const { resumeData, setTemplate } = useResume()
  const navigate = useNavigate()
  const selected = resumeData.selectedTemplate

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Choose Your Template</h1>
          <p className="text-gray-500 mt-2">Pick a design that fits your industry and style</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {templates.map((t) => (
            <TemplateCard key={t.id} template={t} selected={selected === t.id} onSelect={setTemplate} />
          ))}
        </div>

        {selected === 'europass' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 text-sm text-blue-700 flex items-start gap-2">
            <Globe className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Europass CV follows the official European Union format. It supports a profile photo and is widely accepted across EU countries.</span>
          </div>
        )}

        <div className="flex justify-center gap-4">
          <button onClick={() => navigate('/resume-form')} className="btn-outline">Back to Form</button>
          <button onClick={() => navigate('/job-match')} className="btn-primary px-8 py-3 text-base">
            Continue to Job Match →
          </button>
        </div>
      </div>
    </div>
  )
}
