import { Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react'
import { formatPhone, formatLocation, getTemplateColor } from '../utils/personalInfo'

export default function ClassicTemplate({ data }) {
  const { personalInfo, summary, experience, education, certificates, skills, extras, photo, generatedResume } = data
  const content = generatedResume || {}
  const displaySummary = content.summary || summary
  const displayExperience = content.experience || experience
  const displayEducation = content.education || education
  const displaySkills = content.skills || skills
  const displayCertificates = content.certificates || certificates

  const primary = getTemplateColor('classic', data.templateColor)
  const phoneText = formatPhone(personalInfo)
  const locationText = formatLocation(personalInfo)

  return (
    <div
      className="bg-white font-serif w-full px-10 py-8 flex flex-col"
      style={{ fontFamily: 'Georgia, serif', fontSize: '12px', color: '#111827' }}
    >
      {/* Header */}
      <div className="text-center pb-4 mb-5 border-b-2" style={{ borderColor: primary }}>
        {photo && <img src={photo} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-gray-400 mx-auto mb-2" />}
        <h1 className="text-2xl font-bold tracking-widest uppercase mb-1" style={{ color: primary }}>{personalInfo.name || 'Your Name'}</h1>
        {content.title && <p className="text-sm text-gray-600 mb-2">{content.title}</p>}
        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-700">
          {personalInfo.email && (
            <a data-link="email" href={`mailto:${personalInfo.email}`} className="flex items-center gap-1 hover:underline" style={{ color: primary }}>
              <Mail className="w-3 h-3" />{personalInfo.email}
            </a>
          )}
          {phoneText && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{phoneText}</span>}
          {locationText && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{locationText}</span>}
          {personalInfo.linkedin && (
            <a data-link="linkedin" href={personalInfo.linkedin} className="flex items-center gap-1 hover:underline" style={{ color: primary }}>
              <LinkIcon className="w-3 h-3" />LinkedIn
            </a>
          )}
          {personalInfo.indeed && (
            <a data-link="indeed" href={personalInfo.indeed} className="flex items-center gap-1 hover:underline" style={{ color: primary }}>
              <LinkIcon className="w-3 h-3" />Indeed
            </a>
          )}
        </div>
      </div>

      <div className="flex-1">
        {displaySummary && (
          <div className="mb-5" data-section>
            <h2 className="text-sm font-bold uppercase tracking-widest pb-1 border-b mb-2" style={{ color: primary, borderColor: `${primary}66` }}>Summary</h2>
            <p className="text-xs leading-relaxed text-gray-800">{displaySummary}</p>
          </div>
        )}

        {displayExperience?.length > 0 && (
          <div className="mb-5" data-section>
            <h2 className="text-sm font-bold uppercase tracking-widest pb-1 border-b mb-2" style={{ color: primary, borderColor: `${primary}66` }}>Professional Experience</h2>
            {displayExperience.map((exp, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between">
                  <div>
                    <span className="font-bold text-sm">{exp.title}</span>
                    <span className="text-gray-600 text-xs"> — {exp.company}{exp.location ? `, ${exp.location}` : ''}</span>
                  </div>
                  <span className="text-xs text-gray-500">{exp.from} – {exp.current ? 'Present' : exp.to}</span>
                </div>
                {exp.description && (
                  <ul className="mt-1 space-y-0.5 ml-3">
                    {exp.description.split('\n').filter(Boolean).map((line, j) => (
                      <li key={j} className="text-xs text-gray-700">• {line.replace(/^[-•]\s*/, '')}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {displayEducation?.length > 0 && (
          <div className="mb-5" data-section>
            <h2 className="text-sm font-bold uppercase tracking-widest pb-1 border-b mb-2" style={{ color: primary, borderColor: `${primary}66` }}>Education</h2>
            {displayEducation.map((edu, i) => (
              <div key={i} className="flex justify-between mb-2">
                <div>
                  <span className="font-bold text-xs">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</span>
                  <span className="text-gray-600 text-xs"> — {edu.institution}</span>
                  {edu.gpa && <span className="text-gray-500 text-xs"> (GPA: {edu.gpa})</span>}
                </div>
                <span className="text-xs text-gray-500">{edu.from} – {edu.to}</span>
              </div>
            ))}
          </div>
        )}

        {displaySkills?.length > 0 && (
          <div className="mb-5" data-section>
            <h2 className="text-sm font-bold uppercase tracking-widest pb-1 border-b mb-2" style={{ color: primary, borderColor: `${primary}66` }}>Skills</h2>
            <p className="text-xs text-gray-800">{displaySkills.join(' · ')}</p>
          </div>
        )}

        {displayCertificates?.length > 0 && (
          <div className="mb-5" data-section>
            <h2 className="text-sm font-bold uppercase tracking-widest pb-1 border-b mb-2" style={{ color: primary, borderColor: `${primary}66` }}>Certifications</h2>
            {displayCertificates.map((cert, i) => (
              <div key={i} className="text-xs text-gray-700 mb-1">
                <span className="font-semibold">{cert.name}</span>
                {cert.issuer && <span className="text-gray-500"> — {cert.issuer}</span>}
                {cert.date && <span className="text-gray-400"> ({cert.date})</span>}
              </div>
            ))}
          </div>
        )}

        {extras && (
          <div data-section>
            <h2 className="text-sm font-bold uppercase tracking-widest pb-1 border-b mb-2" style={{ color: primary, borderColor: `${primary}66` }}>Additional</h2>
            <p className="text-xs text-gray-700 leading-relaxed">{extras}</p>
          </div>
        )}
      </div>
    </div>
  )
}
