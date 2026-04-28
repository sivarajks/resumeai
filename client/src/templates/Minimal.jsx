import { Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react'
import { formatPhone, formatLocation, getTemplateColor } from '../utils/personalInfo'

export default function MinimalTemplate({ data }) {
  const { personalInfo, summary, experience, education, certificates, skills, extras, photo, generatedResume } = data
  const content = generatedResume || {}
  const displaySummary = content.summary || summary
  const displayExperience = content.experience || experience
  const displayEducation = content.education || education
  const displaySkills = content.skills || skills
  const displayCertificates = content.certificates || certificates

  const primary = getTemplateColor('minimal', data.templateColor)
  const phoneText = formatPhone(personalInfo)
  const locationText = formatLocation(personalInfo)

  return (
    <div
      className="bg-white w-full px-10 py-8 flex flex-col"
      style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: '#1f2937' }}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          {photo && <img src={photo} alt="Profile" className="w-14 h-14 rounded-full object-cover shrink-0" style={{ borderWidth: 1, borderColor: `${primary}40` }} />}
          <div>
            <h1 className="text-3xl font-light tracking-tight text-gray-900 mb-0.5">{personalInfo.name || 'Your Name'}</h1>
            {content.title && <p className="text-sm font-medium" style={{ color: primary }}>{content.title}</p>}
          </div>
        </div>
        <div className="flex flex-wrap gap-5 text-xs text-gray-500">
          {personalInfo.email && (
            <a data-link="email" href={`mailto:${personalInfo.email}`} className="flex items-center gap-1 hover:underline">
              <Mail className="w-3 h-3" style={{ color: primary }} />{personalInfo.email}
            </a>
          )}
          {phoneText && <span className="flex items-center gap-1"><Phone className="w-3 h-3" style={{ color: primary }} />{phoneText}</span>}
          {locationText && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" style={{ color: primary }} />{locationText}</span>}
          {personalInfo.linkedin && (
            <a data-link="linkedin" href={personalInfo.linkedin} className="flex items-center gap-1 hover:underline">
              <LinkIcon className="w-3 h-3" style={{ color: primary }} />LinkedIn
            </a>
          )}
          {personalInfo.indeed && (
            <a data-link="indeed" href={personalInfo.indeed} className="flex items-center gap-1 hover:underline">
              <LinkIcon className="w-3 h-3" style={{ color: primary }} />Indeed
            </a>
          )}
        </div>
        <div className="mt-4 h-px" style={{ backgroundColor: primary }} />
      </div>

      <div className="flex-1">
        {displaySummary && (
          <div className="mb-6" data-section>
            <p className="text-xs text-gray-600 leading-relaxed">{displaySummary}</p>
          </div>
        )}

        {displayExperience?.length > 0 && (
          <div className="mb-6" data-section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: primary, borderColor: `${primary}40` }}>Experience</h2>
            {displayExperience.map((exp, i) => (
              <div key={i} className="mb-4 pl-3 border-l-2" style={{ borderColor: `${primary}30` }}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{exp.title}</div>
                    <div className="text-xs" style={{ color: primary }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
                  </div>
                  <div className="text-xs text-gray-400 ml-2 whitespace-nowrap">{exp.from} – {exp.current ? 'Present' : exp.to}</div>
                </div>
                {exp.description && (
                  <div className="mt-1.5 space-y-0.5">
                    {exp.description.split('\n').filter(Boolean).map((line, j) => (
                      <div key={j} className="text-xs text-gray-600 flex gap-1.5">
                        <span style={{ color: primary }}>›</span> {line.replace(/^[-•]\s*/, '')}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {displayEducation?.length > 0 && (
            <div data-section>
              <h2 className="text-xs font-semibold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: primary, borderColor: `${primary}40` }}>Education</h2>
              {displayEducation.map((edu, i) => (
                <div key={i} className="mb-3">
                  <div className="font-semibold text-xs text-gray-900">{edu.degree}</div>
                  {edu.field && <div className="text-xs text-gray-600">{edu.field}</div>}
                  <div className="text-xs" style={{ color: primary }}>{edu.institution}</div>
                  <div className="text-xs text-gray-400">{edu.from} – {edu.to}</div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-5">
            {displaySkills?.length > 0 && (
              <div data-section>
                <h2 className="text-xs font-semibold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: primary, borderColor: `${primary}40` }}>Skills</h2>
                <div className="flex flex-wrap gap-1.5">
                  {displaySkills.map((s, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${primary}15`, color: primary }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
            {displayCertificates?.length > 0 && (
              <div data-section>
                <h2 className="text-xs font-semibold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: primary, borderColor: `${primary}40` }}>Certifications</h2>
                {displayCertificates.map((cert, i) => (
                  <div key={i} className="text-xs text-gray-700 mb-1">
                    <div className="font-medium">{cert.name}</div>
                    {cert.issuer && <div className="text-gray-500">{cert.issuer}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {extras && (
          <div className="mt-6" data-section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: primary, borderColor: `${primary}40` }}>Additional</h2>
            <p className="text-xs text-gray-600 leading-relaxed">{extras}</p>
          </div>
        )}
      </div>
    </div>
  )
}
