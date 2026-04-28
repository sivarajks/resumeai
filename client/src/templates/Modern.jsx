import { Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react'
import { formatPhone, formatLocation, getTemplateColor } from '../utils/personalInfo'

export default function ModernTemplate({ data }) {
  const { personalInfo, summary, experience, education, certificates, skills, extras, photo, generatedResume } = data
  const content = generatedResume || {}
  const displaySummary = content.summary || summary
  const displayExperience = content.experience || experience
  const displayEducation = content.education || education
  const displaySkills = content.skills || skills
  const displayCertificates = content.certificates || certificates

  const primary = getTemplateColor('modern', data.templateColor)
  const phoneText = formatPhone(personalInfo)
  const locationText = formatLocation(personalInfo)

  return (
    <div
      className="bg-white font-sans text-gray-800 w-full flex flex-col"
      style={{ fontFamily: 'Georgia, serif', fontSize: '12px', lineHeight: '1.5' }}
    >
      {/* Header */}
      <div className="text-white px-8 py-6" style={{ backgroundColor: primary }}>
        <div className="flex items-center gap-4">
          {photo && <img src={photo} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-white/40 shrink-0" />}
          <div>
            <h1 className="text-3xl font-bold tracking-wide mb-1">{personalInfo.name || 'Your Name'}</h1>
            {content.title && <p className="text-white/80 text-sm font-medium">{content.title}</p>}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-white/90 text-xs mt-2">
          {personalInfo.email && (
            <a data-link="email" href={`mailto:${personalInfo.email}`} className="flex items-center gap-1 hover:underline" style={{ color: 'inherit' }}>
              <Mail className="w-3 h-3" />{personalInfo.email}
            </a>
          )}
          {phoneText && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{phoneText}</span>}
          {locationText && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{locationText}</span>}
          {personalInfo.linkedin && (
            <a data-link="linkedin" href={personalInfo.linkedin} className="flex items-center gap-1 hover:underline" style={{ color: 'inherit' }}>
              <LinkIcon className="w-3 h-3" />LinkedIn
            </a>
          )}
          {personalInfo.indeed && (
            <a data-link="indeed" href={personalInfo.indeed} className="flex items-center gap-1 hover:underline" style={{ color: 'inherit' }}>
              <LinkIcon className="w-3 h-3" />Indeed
            </a>
          )}
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-1/3 px-5 py-6 space-y-5" style={{ backgroundColor: `${primary}10` }}>
          {displaySkills?.length > 0 && (
            <div data-section>
              <h2 className="font-bold text-xs uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: primary, borderColor: `${primary}40` }}>Skills</h2>
              <div className="space-y-1">
                {displaySkills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primary }} />
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}
          {displayEducation?.length > 0 && (
            <div data-section>
              <h2 className="font-bold text-xs uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: primary, borderColor: `${primary}40` }}>Education</h2>
              {displayEducation.map((edu, i) => (
                <div key={i} className="mb-3">
                  <div className="font-semibold text-xs text-gray-800">{edu.degree}</div>
                  <div className="text-xs" style={{ color: primary }}>{edu.institution}</div>
                  {edu.field && <div className="text-xs text-gray-500">{edu.field}</div>}
                  {(edu.from || edu.to) && <div className="text-xs text-gray-400">{edu.from} – {edu.to}</div>}
                  {edu.gpa && <div className="text-xs text-gray-500">GPA: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          )}
          {displayCertificates?.length > 0 && (
            <div data-section>
              <h2 className="font-bold text-xs uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: primary, borderColor: `${primary}40` }}>Certifications</h2>
              {displayCertificates.map((cert, i) => (
                <div key={i} className="mb-2">
                  <div className="font-semibold text-xs text-gray-800">{cert.name}</div>
                  {cert.issuer && <div className="text-xs text-gray-500">{cert.issuer}</div>}
                  {cert.date && <div className="text-xs text-gray-400">{cert.date}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main */}
        <div className="flex-1 px-6 py-6 space-y-5">
          {displaySummary && (
            <div data-section>
              <h2 className="font-bold text-xs uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: primary, borderColor: `${primary}40` }}>Professional Summary</h2>
              <p className="text-xs text-gray-700 leading-relaxed">{displaySummary}</p>
            </div>
          )}
          {displayExperience?.length > 0 && (
            <div data-section>
              <h2 className="font-bold text-xs uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: primary, borderColor: `${primary}40` }}>Experience</h2>
              {displayExperience.map((exp, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-sm text-gray-900">{exp.title}</div>
                      <div className="text-xs font-medium" style={{ color: primary }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                    </div>
                    <div className="text-xs text-gray-400 whitespace-nowrap ml-2">
                      {exp.from} – {exp.current ? 'Present' : exp.to}
                    </div>
                  </div>
                  {exp.description && (
                    <ul className="mt-1.5 space-y-0.5">
                      {exp.description.split('\n').filter(Boolean).map((line, j) => (
                        <li key={j} className="text-xs text-gray-700 flex gap-1.5">
                          <span className="mt-0.5" style={{ color: primary }}>•</span> {line.replace(/^[-•]\s*/, '')}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
          {extras && (
            <div data-section>
              <h2 className="font-bold text-xs uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: primary, borderColor: `${primary}40` }}>Additional Information</h2>
              <p className="text-xs text-gray-700 leading-relaxed">{extras}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
