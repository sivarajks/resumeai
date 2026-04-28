import { Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react'
import { formatPhone, formatLocation, getTemplateColor } from '../utils/personalInfo'

export default function CreativeTemplate({ data }) {
  const { personalInfo, summary, experience, education, certificates, skills, extras, photo, generatedResume } = data
  const content = generatedResume || {}
  const displaySummary = content.summary || summary
  const displayExperience = content.experience || experience
  const displayEducation = content.education || education
  const displaySkills = content.skills || skills
  const displayCertificates = content.certificates || certificates

  const primary = getTemplateColor('creative', data.templateColor)
  const phoneText = formatPhone(personalInfo)
  const locationText = formatLocation(personalInfo)

  return (
    <div
      className="bg-white w-full flex flex-col"
      style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px' }}
    >
      {/* Header with diagonal accent */}
      <div className="text-white px-8 py-7 relative overflow-hidden" style={{ backgroundColor: primary }}>
        <div className="absolute -bottom-6 right-0 w-1/3 h-20 transform skew-y-3 opacity-50" style={{ backgroundColor: `${primary}99` }} />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-3">
            {photo && <img src={photo} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-white/40 shrink-0" />}
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight mb-1">{personalInfo.name || 'Your Name'}</h1>
              {content.title && <p className="text-white/80 text-sm font-medium">{content.title}</p>}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-white/90 text-xs">
            {personalInfo.email && (
              <a data-link="email" href={`mailto:${personalInfo.email}`} className="flex items-center gap-1.5 bg-white/15 px-2 py-1 rounded-full hover:bg-white/25" style={{ color: 'inherit' }}>
                <Mail className="w-3 h-3" />{personalInfo.email}
              </a>
            )}
            {phoneText && <span className="flex items-center gap-1.5 bg-white/15 px-2 py-1 rounded-full"><Phone className="w-3 h-3" />{phoneText}</span>}
            {locationText && <span className="flex items-center gap-1.5 bg-white/15 px-2 py-1 rounded-full"><MapPin className="w-3 h-3" />{locationText}</span>}
            {personalInfo.linkedin && (
              <a data-link="linkedin" href={personalInfo.linkedin} className="flex items-center gap-1.5 bg-white/15 px-2 py-1 rounded-full hover:bg-white/25" style={{ color: 'inherit' }}>
                <LinkIcon className="w-3 h-3" />LinkedIn
              </a>
            )}
            {personalInfo.indeed && (
              <a data-link="indeed" href={personalInfo.indeed} className="flex items-center gap-1.5 bg-white/15 px-2 py-1 rounded-full hover:bg-white/25" style={{ color: 'inherit' }}>
                <LinkIcon className="w-3 h-3" />Indeed
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Left sidebar */}
        <div className="w-64 px-5 py-6 space-y-5 shrink-0" style={{ backgroundColor: `${primary}10` }}>
          {displaySkills?.length > 0 && (
            <div data-section>
              <h2 className="font-bold text-xs uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: primary, borderColor: `${primary}30` }}>Skills</h2>
              <div className="flex flex-wrap gap-1.5">
                {displaySkills.map((s, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${primary}25`, color: primary }}>{s}</span>
                ))}
              </div>
            </div>
          )}
          {displayEducation?.length > 0 && (
            <div data-section>
              <h2 className="font-bold text-xs uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: primary, borderColor: `${primary}30` }}>Education</h2>
              {displayEducation.map((edu, i) => (
                <div key={i} className="mb-3 p-2 bg-white rounded-lg" style={{ borderWidth: 1, borderColor: `${primary}30` }}>
                  <div className="font-bold text-xs text-gray-900">{edu.degree}</div>
                  {edu.field && <div className="text-xs text-gray-600">{edu.field}</div>}
                  <div className="text-xs" style={{ color: primary }}>{edu.institution}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{edu.from} – {edu.to}</div>
                  {edu.gpa && <div className="text-xs text-gray-500">GPA: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          )}
          {displayCertificates?.length > 0 && (
            <div data-section>
              <h2 className="font-bold text-xs uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: primary, borderColor: `${primary}30` }}>Certifications</h2>
              {displayCertificates.map((cert, i) => (
                <div key={i} className="mb-2 p-2 bg-white rounded-lg" style={{ borderWidth: 1, borderColor: `${primary}30` }}>
                  <div className="font-semibold text-xs text-gray-900">{cert.name}</div>
                  {cert.issuer && <div className="text-xs text-gray-500">{cert.issuer}</div>}
                  {cert.date && <div className="text-xs" style={{ color: `${primary}99` }}>{cert.date}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 px-6 py-6 space-y-5">
          {displaySummary && (
            <div data-section>
              <h2 className="font-bold text-xs uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: primary, borderColor: `${primary}30` }}>About Me</h2>
              <p className="text-xs text-gray-700 leading-relaxed p-3 rounded-lg border-l-2" style={{ backgroundColor: `${primary}08`, borderColor: primary }}>{displaySummary}</p>
            </div>
          )}
          {displayExperience?.length > 0 && (
            <div data-section>
              <h2 className="font-bold text-xs uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: primary, borderColor: `${primary}30` }}>Experience</h2>
              {displayExperience.map((exp, i) => (
                <div key={i} className="mb-4 relative pl-4">
                  <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: primary }} />
                  <div className="absolute left-0.5 top-3.5 w-px h-full" style={{ backgroundColor: `${primary}30` }} />
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-sm text-gray-900">{exp.title}</div>
                      <div className="text-xs font-medium" style={{ color: primary }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                    </div>
                    <div className="text-xs text-gray-400 px-2 py-0.5 rounded ml-2 whitespace-nowrap" style={{ backgroundColor: `${primary}10` }}>
                      {exp.from} – {exp.current ? 'Present' : exp.to}
                    </div>
                  </div>
                  {exp.description && (
                    <ul className="mt-1.5 space-y-0.5">
                      {exp.description.split('\n').filter(Boolean).map((line, j) => (
                        <li key={j} className="text-xs text-gray-600 flex gap-1.5">
                          <span style={{ color: primary }}>▸</span> {line.replace(/^[-•]\s*/, '')}
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
              <h2 className="font-bold text-xs uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: primary, borderColor: `${primary}30` }}>Additional</h2>
              <p className="text-xs text-gray-700 leading-relaxed">{extras}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
