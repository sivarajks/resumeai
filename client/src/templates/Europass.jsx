import { Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react'
import { formatPhone, formatLocation, getTemplateColor } from '../utils/personalInfo'

export default function EuropassTemplate({ data }) {
  const { personalInfo, summary, experience, education, certificates, skills, extras, photo, generatedResume } = data
  const content = generatedResume || {}
  const displaySummary = content.summary || summary
  const displayExperience = content.experience || experience
  const displayEducation = content.education || education
  const displaySkills = content.skills || skills
  const displayCertificates = content.certificates || certificates

  const primary = getTemplateColor('europass', data.templateColor)
  const phoneText = formatPhone(personalInfo)
  const locationText = formatLocation(personalInfo)

  return (
    <div
      className="bg-white w-full flex flex-col"
      style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#1a1a1a' }}
    >
      {/* EU Header Bar */}
      <div className="h-2 w-full" style={{ backgroundColor: primary }} />

      {/* Title Bar */}
      <div className="text-white px-8 py-3 flex items-center justify-between" style={{ backgroundColor: primary }}>
        <span className="text-xs font-semibold tracking-widest uppercase">Curriculum Vitae</span>
        <div className="flex items-center gap-1.5 text-xs opacity-80">
          <span className="text-yellow-300">★★★★★★★★★★★★</span>
        </div>
      </div>

      <div className="px-8 py-5 flex-1 flex flex-col">
        {/* Personal Information */}
        <div className="flex gap-6 mb-6">
          {/* Photo */}
          <div className="shrink-0">
            {photo ? (
              <img src={photo} alt="Profile" className="w-24 h-28 object-cover border border-gray-300" />
            ) : (
              <div className="w-24 h-28 bg-gray-100 border border-gray-300 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-3xl">👤</div>
                  <div className="text-xs mt-1">Photo</div>
                </div>
              </div>
            )}
          </div>

          {/* Info Block */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1 tracking-wide" style={{ color: primary }}>
              {personalInfo.name || 'Your Name'}
            </h1>
            {content.title && (
              <p className="text-sm text-gray-600 font-medium mb-3">{content.title}</p>
            )}
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-2">
              {locationText && (
                <div className="flex items-start gap-1.5 text-xs text-gray-700">
                  <MapPin className="w-3 h-3 mt-0.5 shrink-0" style={{ color: primary }} />
                  <span>{locationText}</span>
                </div>
              )}
              {phoneText && (
                <div className="flex items-center gap-1.5 text-xs text-gray-700">
                  <Phone className="w-3 h-3 shrink-0" style={{ color: primary }} />
                  <span>{phoneText}</span>
                </div>
              )}
              {personalInfo.email && (
                <a data-link="email" href={`mailto:${personalInfo.email}`} className="flex items-center gap-1.5 text-xs text-gray-700 hover:underline">
                  <Mail className="w-3 h-3 shrink-0" style={{ color: primary }} />
                  <span>{personalInfo.email}</span>
                </a>
              )}
              {personalInfo.linkedin && (
                <a data-link="linkedin" href={personalInfo.linkedin} className="flex items-center gap-1.5 text-xs text-gray-700 hover:underline">
                  <LinkIcon className="w-3 h-3 shrink-0" style={{ color: primary }} />
                  <span>LinkedIn</span>
                </a>
              )}
              {personalInfo.indeed && (
                <a data-link="indeed" href={personalInfo.indeed} className="flex items-center gap-1.5 text-xs text-gray-700 hover:underline">
                  <LinkIcon className="w-3 h-3 shrink-0" style={{ color: primary }} />
                  <span>Indeed</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1">
          {/* Personal Statement */}
          <SectionTitle primary={primary}>Personal Statement</SectionTitle>
          <div data-section>
            {displaySummary ? (
              <p className="text-xs text-gray-700 leading-relaxed mb-4">{displaySummary}</p>
            ) : (
              <p className="text-xs text-gray-400 italic mb-4">No summary provided.</p>
            )}
          </div>

          {displayExperience?.length > 0 && (
            <div data-section>
              <SectionTitle primary={primary}>Work Experience</SectionTitle>
              {displayExperience.map((exp, i) => (
                <div key={i} className="mb-4 border-l-2 pl-4" style={{ borderColor: primary }}>
                  <div className="flex justify-between items-start mb-0.5">
                    <div className="font-bold text-sm" style={{ color: primary }}>{exp.title}</div>
                    <div className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {exp.from} – {exp.current ? 'Present' : exp.to}
                    </div>
                  </div>
                  <div className="text-xs font-medium text-gray-700 mb-1">
                    {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                  </div>
                  {exp.description && (
                    <ul className="space-y-0.5">
                      {exp.description.split('\n').filter(Boolean).map((line, j) => (
                        <li key={j} className="text-xs text-gray-700 flex gap-1.5">
                          <span className="mt-0.5 shrink-0" style={{ color: primary }}>▸</span>
                          {line.replace(/^[-•]\s*/, '')}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {displayEducation?.length > 0 && (
            <div data-section>
              <SectionTitle primary={primary}>Education and Training</SectionTitle>
              {displayEducation.map((edu, i) => (
                <div key={i} className="mb-3 border-l-2 pl-4" style={{ borderColor: primary }}>
                  <div className="flex justify-between">
                    <div className="font-bold text-xs" style={{ color: primary }}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                    </div>
                    <div className="text-xs text-gray-500">{edu.from} – {edu.to}</div>
                  </div>
                  <div className="text-xs text-gray-700">{edu.institution}</div>
                  {edu.gpa && <div className="text-xs text-gray-500">Final Grade / GPA: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          )}

          {displaySkills?.length > 0 && (
            <div data-section>
              <SectionTitle primary={primary}>Skills</SectionTitle>
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-600 mb-1.5">Digital Competence / Technical Skills</div>
                <div className="flex flex-wrap gap-1.5">
                  {displaySkills.map((s, i) => (
                    <span key={i} className="border text-xs px-2 py-0.5 rounded" style={{ borderColor: primary, color: primary }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {displayCertificates?.length > 0 && (
            <div data-section>
              <SectionTitle primary={primary}>Certificates and Achievements</SectionTitle>
              <div className="space-y-1.5 mb-4">
                {displayCertificates.map((cert, i) => (
                  <div key={i} className="flex justify-between items-start border-l-2 pl-3" style={{ borderColor: primary }}>
                    <div>
                      <div className="text-xs font-semibold text-gray-800">{cert.name}</div>
                      {cert.issuer && <div className="text-xs text-gray-500">{cert.issuer}</div>}
                    </div>
                    {cert.date && <div className="text-xs text-gray-400">{cert.date}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {extras && (
            <div data-section>
              <SectionTitle primary={primary}>Additional Information</SectionTitle>
              <p className="text-xs text-gray-700 leading-relaxed mb-4">{extras}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-gray-200 text-xs text-gray-400 text-center">
          © European Union, 2002–2025 | europass.europa.eu
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ children, primary }) {
  return (
    <h2
      className="text-xs font-bold uppercase tracking-widest mb-2 pb-[5px] border-b flex items-center gap-2"
      style={{ color: primary, borderColor: `${primary}40` }}
    >
      <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: primary }} />
      {children}
    </h2>
  )
}
