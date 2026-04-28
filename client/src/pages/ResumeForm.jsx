import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResume } from '../context/ResumeContext'
import { Plus, Trash2, ChevronRight, ChevronLeft, User, Briefcase, GraduationCap, Award, Sparkles, Check, Camera, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { COUNTRY_CODES, COUNTRIES } from '../utils/personalInfo'

const STEPS = [
  { id: 0, label: 'Personal', icon: User },
  { id: 1, label: 'Summary', icon: Sparkles },
  { id: 2, label: 'Experience', icon: Briefcase },
  { id: 3, label: 'Education', icon: GraduationCap },
  { id: 4, label: 'Certificates', icon: Award },
  { id: 5, label: 'Extras', icon: Sparkles },
]

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
      {STEPS.map((step, i) => {
        const Icon = step.icon
        const done = i < current
        const active = i === current
        return (
          <div key={step.id} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              done ? 'bg-green-100 text-green-700' : active ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {done ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
              {step.label}
            </div>
            {i < STEPS.length - 1 && <div className={`w-4 h-px ${i < current ? 'bg-green-400' : 'bg-gray-200'}`} />}
          </div>
        )
      })}
    </div>
  )
}

// ─── Step 0: Personal Info ───────────────────────────────────────────────────
function PersonalStep({ data, onChange, photo, onPhotoChange }) {
  const fileRef = useRef()

  function handlePhotoUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error('Photo must be under 2MB'); return }
    const reader = new FileReader()
    reader.onload = (ev) => onPhotoChange(ev.target.result)
    reader.readAsDataURL(file)
  }

  function update(key, value) {
    onChange({ ...data, [key]: value })
  }

  return (
    <div className="space-y-6">
      {/* Photo Upload */}
      <div className="flex items-center gap-5 p-4 bg-gray-50 border border-gray-200 rounded-xl">
        <div className="relative shrink-0">
          {photo ? (
            <div className="relative">
              <img src={photo} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-primary-200" />
              <button
                onClick={() => onPhotoChange(null)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
              <Camera className="w-7 h-7 text-gray-400" />
            </div>
          )}
        </div>
        <div>
          <div className="font-medium text-gray-800 text-sm mb-1">Profile Photo <span className="text-gray-400 font-normal">(Optional)</span></div>
          <p className="text-xs text-gray-500 mb-2">Recommended for Europass CV. Max 2MB, JPG or PNG.</p>
          <button
            type="button"
            onClick={() => fileRef.current.click()}
            className="btn-outline text-xs py-1.5 px-3"
          >
            {photo ? 'Change Photo' : 'Upload Photo'}
          </button>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoUpload} />
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span className="text-red-400">*</span></label>
        <input type="text" className="input-field" placeholder="John Doe" value={data.name || ''} onChange={(e) => update('name', e.target.value)} required />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address <span className="text-red-400">*</span></label>
        <input type="email" className="input-field" placeholder="john@example.com" value={data.email || ''} onChange={(e) => update('email', e.target.value)} required />
      </div>

      {/* Phone with country code */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number <span className="text-red-400">*</span></label>
        <div className="flex gap-2">
          <select
            className="input-field max-w-[140px]"
            value={data.phoneCountryCode || '+91'}
            onChange={(e) => update('phoneCountryCode', e.target.value)}
          >
            {COUNTRY_CODES.map((c, i) => (
              <option key={`${c.code}-${i}`} value={c.code}>{c.flag} {c.code} {c.country}</option>
            ))}
          </select>
          <input
            type="tel"
            className="input-field flex-1"
            placeholder="9876543210"
            value={data.phone || ''}
            onChange={(e) => update('phone', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Location: Country, State, City, Pincode */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
        <div className="grid md:grid-cols-2 gap-3">
          <select
            className="input-field"
            value={data.country || 'India'}
            onChange={(e) => update('country', e.target.value)}
          >
            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            type="text"
            className="input-field"
            placeholder="State / Province"
            value={data.state || ''}
            onChange={(e) => update('state', e.target.value)}
          />
          <input
            type="text"
            className="input-field"
            placeholder="City"
            value={data.city || ''}
            onChange={(e) => update('city', e.target.value)}
          />
          <input
            type="text"
            className="input-field"
            placeholder="Pincode / ZIP"
            value={data.pincode || ''}
            onChange={(e) => update('pincode', e.target.value)}
          />
        </div>
      </div>

      {/* LinkedIn + Indeed */}
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">LinkedIn URL</label>
          <input type="url" className="input-field" placeholder="https://linkedin.com/in/yourname" value={data.linkedin || ''} onChange={(e) => update('linkedin', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Indeed Profile URL</label>
          <input type="url" className="input-field" placeholder="https://indeed.com/..." value={data.indeed || ''} onChange={(e) => update('indeed', e.target.value)} />
        </div>
      </div>
    </div>
  )
}

// ─── Step 1: Summary ─────────────────────────────────────────────────────────
function SummaryStep({ data, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        Professional Summary <span className="text-red-400">*</span>
      </label>
      <textarea
        className="input-field min-h-[160px] resize-y"
        placeholder="Write a brief professional summary highlighting your key skills, experience and goals. This will be enhanced by AI when generating your resume."
        value={data}
        onChange={(e) => onChange(e.target.value)}
        maxLength={600}
      />
      <p className="text-xs text-gray-400 mt-1.5 text-right">{data.length}/600 characters</p>
      <div className="mt-4 p-4 bg-primary-50 border border-primary-100 rounded-xl text-sm text-primary-700">
        <strong>Tip:</strong> Don't worry about perfection — the AI will rewrite this to match each job you apply for.
      </div>
    </div>
  )
}

// ─── Step 2: Experience ───────────────────────────────────────────────────────
function ExperienceStep({ data, onChange }) {
  function add() {
    onChange([...data, { id: Date.now(), title: '', company: '', location: '', from: '', to: '', current: false, description: '' }])
  }
  function remove(id) {
    onChange(data.filter((e) => e.id !== id))
  }
  function update(id, field, value) {
    onChange(data.map((e) => (e.id === id ? { ...e, [field]: value } : e)))
  }

  return (
    <div className="space-y-6">
      {data.length === 0 && (
        <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          No experience added yet. Click below to add your work history.
        </div>
      )}
      {data.map((exp, i) => (
        <div key={exp.id} className="border border-gray-200 rounded-xl p-5 relative bg-gray-50/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-700">Experience #{i + 1}</span>
            <button onClick={() => remove(exp.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label-sm">Job Title *</label>
              <input className="input-field" placeholder="Software Engineer" value={exp.title} onChange={(e) => update(exp.id, 'title', e.target.value)} />
            </div>
            <div>
              <label className="label-sm">Company *</label>
              <input className="input-field" placeholder="Acme Corp" value={exp.company} onChange={(e) => update(exp.id, 'company', e.target.value)} />
            </div>
            <div>
              <label className="label-sm">Location</label>
              <input className="input-field" placeholder="New York, NY" value={exp.location} onChange={(e) => update(exp.id, 'location', e.target.value)} />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="label-sm">From</label>
                <input type="month" className="input-field" value={exp.from} onChange={(e) => update(exp.id, 'from', e.target.value)} />
              </div>
              <div className="flex-1">
                <label className="label-sm">To</label>
                <input type="month" className="input-field" value={exp.to} disabled={exp.current} onChange={(e) => update(exp.id, 'to', e.target.value)} />
              </div>
            </div>
            <div className="md:col-span-2 flex items-center gap-2">
              <input type="checkbox" id={`curr-${exp.id}`} checked={exp.current} onChange={(e) => update(exp.id, 'current', e.target.checked)} className="accent-primary-600" />
              <label htmlFor={`curr-${exp.id}`} className="text-sm text-gray-600">Currently working here</label>
            </div>
            <div className="md:col-span-2">
              <label className="label-sm">Description / Responsibilities</label>
              <textarea
                className="input-field min-h-[100px] resize-y"
                placeholder="Describe your responsibilities, achievements and impact. Use bullet points or sentences."
                value={exp.description}
                onChange={(e) => update(exp.id, 'description', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-2 text-primary-600 border border-primary-200 hover:bg-primary-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-all w-full justify-center">
        <Plus className="w-4 h-4" /> Add Experience
      </button>
    </div>
  )
}

// ─── Step 3: Education ────────────────────────────────────────────────────────
function EducationStep({ data, onChange }) {
  function add() {
    onChange([...data, { id: Date.now(), degree: '', institution: '', field: '', from: '', to: '', gpa: '' }])
  }
  function remove(id) { onChange(data.filter((e) => e.id !== id)) }
  function update(id, field, value) { onChange(data.map((e) => (e.id === id ? { ...e, [field]: value } : e))) }

  return (
    <div className="space-y-6">
      {data.length === 0 && (
        <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          No education added yet.
        </div>
      )}
      {data.map((edu, i) => (
        <div key={edu.id} className="border border-gray-200 rounded-xl p-5 relative bg-gray-50/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-700">Education #{i + 1}</span>
            <button onClick={() => remove(edu.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label-sm">Degree *</label>
              <input className="input-field" placeholder="Bachelor of Science" value={edu.degree} onChange={(e) => update(edu.id, 'degree', e.target.value)} />
            </div>
            <div>
              <label className="label-sm">Institution *</label>
              <input className="input-field" placeholder="MIT" value={edu.institution} onChange={(e) => update(edu.id, 'institution', e.target.value)} />
            </div>
            <div>
              <label className="label-sm">Field of Study</label>
              <input className="input-field" placeholder="Computer Science" value={edu.field} onChange={(e) => update(edu.id, 'field', e.target.value)} />
            </div>
            <div>
              <label className="label-sm">GPA (optional)</label>
              <input className="input-field" placeholder="3.8/4.0" value={edu.gpa} onChange={(e) => update(edu.id, 'gpa', e.target.value)} />
            </div>
            <div>
              <label className="label-sm">From</label>
              <input type="month" className="input-field" value={edu.from} onChange={(e) => update(edu.id, 'from', e.target.value)} />
            </div>
            <div>
              <label className="label-sm">To</label>
              <input type="month" className="input-field" value={edu.to} onChange={(e) => update(edu.id, 'to', e.target.value)} />
            </div>
          </div>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-2 text-primary-600 border border-primary-200 hover:bg-primary-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-all w-full justify-center">
        <Plus className="w-4 h-4" /> Add Education
      </button>
    </div>
  )
}

// ─── Step 4: Certificates ─────────────────────────────────────────────────────
function CertificatesStep({ data, onChange }) {
  function add() {
    onChange([...data, { id: Date.now(), name: '', issuer: '', date: '', url: '' }])
  }
  function remove(id) { onChange(data.filter((c) => c.id !== id)) }
  function update(id, field, value) { onChange(data.map((c) => (c.id === id ? { ...c, [field]: value } : c))) }

  return (
    <div className="space-y-6">
      {data.length === 0 && (
        <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          No certificates added yet.
        </div>
      )}
      {data.map((cert, i) => (
        <div key={cert.id} className="border border-gray-200 rounded-xl p-5 bg-gray-50/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-700">Certificate #{i + 1}</span>
            <button onClick={() => remove(cert.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label-sm">Certificate Name *</label>
              <input className="input-field" placeholder="AWS Certified Solutions Architect" value={cert.name} onChange={(e) => update(cert.id, 'name', e.target.value)} />
            </div>
            <div>
              <label className="label-sm">Issuing Organization</label>
              <input className="input-field" placeholder="Amazon Web Services" value={cert.issuer} onChange={(e) => update(cert.id, 'issuer', e.target.value)} />
            </div>
            <div>
              <label className="label-sm">Date Issued</label>
              <input type="month" className="input-field" value={cert.date} onChange={(e) => update(cert.id, 'date', e.target.value)} />
            </div>
            <div>
              <label className="label-sm">Credential URL (optional)</label>
              <input className="input-field" placeholder="https://..." value={cert.url} onChange={(e) => update(cert.id, 'url', e.target.value)} />
            </div>
          </div>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-2 text-primary-600 border border-primary-200 hover:bg-primary-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-all w-full justify-center">
        <Plus className="w-4 h-4" /> Add Certificate
      </button>
    </div>
  )
}

// ─── Step 5: Extras ───────────────────────────────────────────────────────────
function ExtrasStep({ skills, extras, onSkillsChange, onExtrasChange }) {
  const [skillInput, setSkillInput] = useState('')

  function addSkill() {
    const s = skillInput.trim()
    if (s && !skills.includes(s)) { onSkillsChange([...skills, s]); setSkillInput('') }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Skills & Technologies</label>
        <div className="flex gap-2 mb-3">
          <input
            className="input-field"
            placeholder="e.g. React, Python, SQL..."
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
          />
          <button onClick={addSkill} className="btn-primary px-4 py-2 text-sm whitespace-nowrap">Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-700 border border-primary-200 px-3 py-1 rounded-full text-sm">
              {s}
              <button onClick={() => onSkillsChange(skills.filter((sk) => sk !== s))} className="text-primary-400 hover:text-primary-700">×</button>
            </span>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Information (Optional)</label>
        <textarea
          className="input-field min-h-[120px] resize-y"
          placeholder="Languages, volunteer work, hobbies, publications, awards, or anything else you'd like to include..."
          value={extras}
          onChange={(e) => onExtrasChange(e.target.value)}
        />
      </div>
    </div>
  )
}

// ─── Main Form Component ──────────────────────────────────────────────────────
export default function ResumeForm() {
  const { resumeData, currentStep, setCurrentStep, updatePersonalInfo, updateSection, setPhoto } = useResume()
  const navigate = useNavigate()

  const stepTitles = ['Personal Information', 'Professional Summary', 'Work Experience', 'Education', 'Certifications', 'Skills & Extras']

  function validateStep() {
    if (currentStep === 0) {
      const { name, email, phone } = resumeData.personalInfo
      if (!name.trim() || !email.trim() || !phone.trim()) {
        toast.error('Please fill in Name, Email, and Phone number.')
        return false
      }
    }
    if (currentStep === 1 && !resumeData.summary.trim()) {
      toast.error('Please add a professional summary.')
      return false
    }
    return true
  }

  function next() {
    if (!validateStep()) return
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1)
    else navigate('/templates')
  }

  function back() {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Build Your Resume</h1>
          <p className="text-gray-500 mt-2">Fill in your details — AI will do the rest</p>
        </div>

        <StepIndicator current={currentStep} />

        {/* Card */}
        <div className="card shadow-md animate-fade-in">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{stepTitles[currentStep]}</h2>

          {currentStep === 0 && (
            <PersonalStep data={resumeData.personalInfo} onChange={updatePersonalInfo} photo={resumeData.photo} onPhotoChange={setPhoto} />
          )}
          {currentStep === 1 && (
            <SummaryStep data={resumeData.summary} onChange={(val) => updateSection('summary', val)} />
          )}
          {currentStep === 2 && (
            <ExperienceStep data={resumeData.experience} onChange={(val) => updateSection('experience', val)} />
          )}
          {currentStep === 3 && (
            <EducationStep data={resumeData.education} onChange={(val) => updateSection('education', val)} />
          )}
          {currentStep === 4 && (
            <CertificatesStep data={resumeData.certificates} onChange={(val) => updateSection('certificates', val)} />
          )}
          {currentStep === 5 && (
            <ExtrasStep
              skills={resumeData.skills}
              extras={resumeData.extras}
              onSkillsChange={(val) => updateSection('skills', val)}
              onExtrasChange={(val) => updateSection('extras', val)}
            />
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={back}
              disabled={currentStep === 0}
              className="flex items-center gap-2 btn-outline disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <span className="text-sm text-gray-400">Step {currentStep + 1} of {STEPS.length}</span>
            <button onClick={next} className="flex items-center gap-2 btn-primary">
              {currentStep === STEPS.length - 1 ? 'Choose Template' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
