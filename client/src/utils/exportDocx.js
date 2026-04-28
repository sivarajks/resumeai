import {
  Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle,
  ExternalHyperlink, HeadingLevel,
} from 'docx'
import fileSaverPkg from 'file-saver'
const saveAs = fileSaverPkg.saveAs || fileSaverPkg
import { formatPhone, formatLocation } from './personalInfo.js'

const stripHash = (color) => (color || '1d4ed8').replace('#', '')

function sectionHeading(text, colorHex) {
  return new Paragraph({
    spacing: { before: 240, after: 80 },
    border: { bottom: { color: colorHex, size: 8, style: BorderStyle.SINGLE, space: 3 } },
    children: [new TextRun({ text, bold: true, size: 24, color: colorHex })],
  })
}

function bulletPara(text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 60 },
    indent: { left: 360 },
    children: [new TextRun({ text, size: 20 })],
  })
}

function linkRun(text, href) {
  return new ExternalHyperlink({
    link: href,
    children: [new TextRun({ text, size: 18, color: '1d4ed8', underline: {} })],
  })
}

export function buildResumeDoc(resumeData, color) {
  const { personalInfo, generatedResume } = resumeData
  const content = generatedResume || {}
  const summary = content.summary || resumeData.summary
  const experience = content.experience || resumeData.experience
  const education = content.education || resumeData.education
  const skills = content.skills || resumeData.skills
  const certificates = content.certificates || resumeData.certificates
  const colorHex = stripHash(color)

  const phone = formatPhone(personalInfo)
  const location = formatLocation(personalInfo)

  const children = []

  // Name
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [new TextRun({ text: personalInfo.name || 'Your Name', bold: true, size: 36, color: colorHex })],
  }))

  // Title
  if (content.title) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [new TextRun({ text: content.title, italics: true, size: 22, color: '555555' })],
    }))
  }

  // Contact line — with clickable email and LinkedIn
  const contactRuns = []
  if (personalInfo.email) {
    contactRuns.push(linkRun(personalInfo.email, `mailto:${personalInfo.email}`))
  }
  if (phone) {
    if (contactRuns.length) contactRuns.push(new TextRun({ text: '  •  ', size: 18, color: '888888' }))
    contactRuns.push(new TextRun({ text: phone, size: 18, color: '555555' }))
  }
  if (location) {
    if (contactRuns.length) contactRuns.push(new TextRun({ text: '  •  ', size: 18, color: '888888' }))
    contactRuns.push(new TextRun({ text: location, size: 18, color: '555555' }))
  }
  if (personalInfo.linkedin) {
    if (contactRuns.length) contactRuns.push(new TextRun({ text: '  •  ', size: 18, color: '888888' }))
    contactRuns.push(linkRun('LinkedIn', personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`))
  }
  if (personalInfo.indeed) {
    if (contactRuns.length) contactRuns.push(new TextRun({ text: '  •  ', size: 18, color: '888888' }))
    contactRuns.push(linkRun('Indeed', personalInfo.indeed.startsWith('http') ? personalInfo.indeed : `https://${personalInfo.indeed}`))
  }
  if (contactRuns.length > 0) {
    children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: contactRuns }))
  }

  // Summary
  if (summary) {
    children.push(sectionHeading('SUMMARY', colorHex))
    children.push(new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: summary, size: 20 })],
    }))
  }

  // Experience
  if (experience?.length > 0) {
    children.push(sectionHeading('PROFESSIONAL EXPERIENCE', colorHex))
    for (const exp of experience) {
      const headRuns = [new TextRun({ text: exp.title || '', bold: true, size: 22 })]
      if (exp.company) headRuns.push(new TextRun({ text: ` — ${exp.company}`, size: 20, color: '555555' }))
      if (exp.location) headRuns.push(new TextRun({ text: `, ${exp.location}`, size: 20, color: '888888' }))
      const dateText = `${exp.from || ''} – ${exp.current ? 'Present' : (exp.to || '')}`
      headRuns.push(new TextRun({ text: `    ${dateText}`, size: 18, color: '888888' }))
      children.push(new Paragraph({ spacing: { before: 120, after: 40 }, children: headRuns }))

      const lines = (exp.description || '').split('\n').filter(Boolean)
      for (const line of lines) {
        children.push(bulletPara(line.replace(/^[-•]\s*/, '')))
      }
    }
  }

  // Education
  if (education?.length > 0) {
    children.push(sectionHeading('EDUCATION', colorHex))
    for (const edu of education) {
      const runs = [new TextRun({ text: edu.degree || '', bold: true, size: 22 })]
      if (edu.field) runs.push(new TextRun({ text: ` in ${edu.field}`, size: 22 }))
      if (edu.institution) runs.push(new TextRun({ text: ` — ${edu.institution}`, size: 20, color: '555555' }))
      if (edu.gpa) runs.push(new TextRun({ text: ` (GPA: ${edu.gpa})`, size: 18, color: '888888' }))
      const dateText = `${edu.from || ''} – ${edu.to || ''}`.trim()
      if (dateText && dateText !== '–') runs.push(new TextRun({ text: `    ${dateText}`, size: 18, color: '888888' }))
      children.push(new Paragraph({ spacing: { after: 80 }, children: runs }))
    }
  }

  // Skills
  if (skills?.length > 0) {
    children.push(sectionHeading('SKILLS', colorHex))
    children.push(new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: skills.join(' · '), size: 20 })],
    }))
  }

  // Certifications
  if (certificates?.length > 0) {
    children.push(sectionHeading('CERTIFICATIONS', colorHex))
    for (const cert of certificates) {
      const runs = [new TextRun({ text: cert.name || '', bold: true, size: 20 })]
      if (cert.issuer) runs.push(new TextRun({ text: ` — ${cert.issuer}`, size: 20, color: '555555' }))
      if (cert.date) runs.push(new TextRun({ text: `  (${cert.date})`, size: 18, color: '888888' }))
      children.push(new Paragraph({ spacing: { after: 60 }, children: runs }))
    }
  }

  // Extras
  if (resumeData.extras) {
    children.push(sectionHeading('ADDITIONAL', colorHex))
    children.push(new Paragraph({
      spacing: { after: 100 },
      children: [new TextRun({ text: resumeData.extras, size: 20 })],
    }))
  }

  return new Document({
    creator: 'ResumeAI',
    title: `Resume - ${personalInfo.name || ''}`,
    styles: { default: { document: { run: { font: 'Calibri', size: 20 } } } },
    sections: [{
      properties: { page: { margin: { top: 1000, right: 1000, bottom: 1000, left: 1000 } } },
      children,
    }],
  })
}

export async function exportResumeAsDocx(resumeData, color) {
  const doc = buildResumeDoc(resumeData, color)
  const blob = await Packer.toBlob(doc)
  const filename = `resume-${(resumeData.personalInfo.name || 'resume').replace(/\s+/g, '-')}.docx`
  saveAs(blob, filename)
}

export function buildCoverLetterDoc(resumeData, color) {
  const { personalInfo, coverLetter } = resumeData
  if (!coverLetter) return null
  const colorHex = stripHash(color)

  const phone = formatPhone(personalInfo)
  const location = formatLocation(personalInfo)

  const headerRuns = []
  if (personalInfo.email) headerRuns.push(linkRun(personalInfo.email, `mailto:${personalInfo.email}`))
  if (phone) {
    if (headerRuns.length) headerRuns.push(new TextRun({ text: '  •  ', size: 18, color: '888888' }))
    headerRuns.push(new TextRun({ text: phone, size: 18, color: '555555' }))
  }
  if (location) {
    if (headerRuns.length) headerRuns.push(new TextRun({ text: '  •  ', size: 18, color: '888888' }))
    headerRuns.push(new TextRun({ text: location, size: 18, color: '555555' }))
  }

  const children = [
    new Paragraph({
      spacing: { after: 80 },
      children: [new TextRun({ text: personalInfo.name || 'Your Name', bold: true, size: 28, color: colorHex })],
    }),
    new Paragraph({ spacing: { after: 320 }, children: headerRuns }),
  ]

  for (const para of coverLetter.split('\n\n')) {
    children.push(new Paragraph({
      spacing: { after: 200 },
      children: [new TextRun({ text: para, size: 22 })],
    }))
  }

  return new Document({
    creator: 'ResumeAI',
    title: `Cover Letter - ${personalInfo.name || ''}`,
    styles: { default: { document: { run: { font: 'Calibri', size: 22 } } } },
    sections: [{
      properties: { page: { margin: { top: 1200, right: 1200, bottom: 1200, left: 1200 } } },
      children,
    }],
  })
}

export async function exportCoverLetterAsDocx(resumeData, color) {
  const doc = buildCoverLetterDoc(resumeData, color)
  if (!doc) return
  const blob = await Packer.toBlob(doc)
  const filename = `cover-letter-${(resumeData.personalInfo.name || 'cover').replace(/\s+/g, '-')}.docx`
  saveAs(blob, filename)
}
