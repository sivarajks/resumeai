import { Packer } from 'docx'
import { writeFileSync } from 'node:fs'
import { buildResumeDoc, buildCoverLetterDoc } from './src/utils/exportDocx.js'

const SERVER = 'http://localhost:5000'

const baseResume = {
  personalInfo: {
    name: 'Sivaraj K S',
    email: 'sivarajks1999@gmail.com',
    phone: '8943189005',
    phoneCountryCode: '+91',
    country: 'India',
    state: 'Kerala',
    city: 'Parappuram P O, Kizhakkumbhagom',
    pincode: '680545',
    linkedin: 'https://linkedin.com/in/sivarajks',
    indeed: '',
    address: '',
  },
  summary: 'Highly motivated Software Engineer with a strong foundation in computer science and practical experience in software development. Proven ability to contribute to project success through diligent work. Eager to leverage skills in React, Python, and SQL to develop innovative solutions and drive impactful results.',
  experience: [
    {
      id: 1,
      title: 'Software Engineer',
      company: 'Amazon',
      location: '',
      from: '2023-02',
      to: '',
      current: true,
      description: 'Contributed to software development initiatives, ensuring rigorous evaluation and documentation of operational data\nApplied understanding of data principles to software engineering tasks\nCollaborated with cross-functional teams to deliver high-quality software solutions',
    },
    {
      id: 2,
      title: 'Service Engineer',
      company: 'Probox',
      location: '',
      from: '2019-03',
      to: '2021-05',
      current: false,
      description: 'Ensured rigorous evaluation and documentation of operational data for OPSEC purposes\nMaintained service operations, addressing technical requirements and ensuring system integrity\nDocumented processes and provided technical support to stakeholders',
    },
  ],
  education: [
    { id: 1, degree: 'BSC in Computer Science', institution: 'PES College', field: 'Computer Science', from: '2015', to: '2018', gpa: '3.7' },
    { id: 2, degree: 'Higher Secondary School in Science', institution: 'Govt H S S Manjapra', field: '', from: '', to: '', gpa: '' },
  ],
  certificates: [
    { id: 1, name: 'AWS', issuer: 'Amazon Web Service', date: '', url: '' },
    { id: 2, name: 'Cloud Security', issuer: 'CISCO', date: '', url: '' },
  ],
  skills: ['React', 'Python', 'SQL', 'R', 'AI', 'Robotics', 'ML', 'MS', 'Software Development', 'Data Analysis', 'Cloud Computing', 'Security Principles'],
  extras: '',
  selectedTemplate: 'classic',
  templateColor: '#1e3a8a',
  jobDescription: '',
  generatedResume: null,
  coverLetter: '',
}

const jobDescription = `Senior Frontend Engineer - React & TypeScript

We're looking for a senior frontend engineer to join our team and build the next generation of our web applications. You'll work with React, TypeScript, and modern web technologies.

Requirements:
- 3+ years of professional React experience
- Strong TypeScript skills
- Experience with state management (Redux, Zustand, or similar)
- Familiarity with Next.js, Vite, or similar build tools
- Understanding of REST APIs and GraphQL
- Cloud experience (AWS, GCP, or Azure)
- Strong communication skills and ability to work in a team`

async function main() {
  console.log('▶ Step 1: Calling /api/generate-resume with Sivaraj profile...')
  const resumeRes = await fetch(`${SERVER}/api/generate-resume`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeData: baseResume, jobDescription }),
  })
  if (!resumeRes.ok) {
    const t = await resumeRes.text()
    throw new Error(`Resume generation failed: ${resumeRes.status} ${t}`)
  }
  const { resume: aiResume } = await resumeRes.json()
  console.log('✓ AI resume generated')
  console.log(`  • Title: ${aiResume.title}`)
  console.log(`  • ATS Score: ${aiResume.atsScore}`)
  console.log(`  • Skills: ${aiResume.skills.length} items`)
  console.log(`  • Keywords: ${aiResume.keywords.join(', ')}`)

  console.log('\n▶ Step 2: Calling /api/generate-cover-letter...')
  const fullResume = { ...baseResume, generatedResume: aiResume }
  const coverRes = await fetch(`${SERVER}/api/generate-cover-letter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeData: fullResume, jobDescription }),
  })
  if (!coverRes.ok) {
    const t = await coverRes.text()
    throw new Error(`Cover letter generation failed: ${coverRes.status} ${t}`)
  }
  const { coverLetter } = await coverRes.json()
  console.log(`✓ Cover letter generated (${coverLetter.length} chars)`)
  console.log(`  Preview: ${coverLetter.slice(0, 120)}...`)

  console.log('\n▶ Step 3: Building Word documents...')
  const completeResume = { ...fullResume, coverLetter }
  const resumeDoc = buildResumeDoc(completeResume, '#1e3a8a')
  const coverDoc = buildCoverLetterDoc(completeResume, '#1e3a8a')

  const resumeBuf = await Packer.toBuffer(resumeDoc)
  const coverBuf = await Packer.toBuffer(coverDoc)

  writeFileSync('test-output-resume.docx', resumeBuf)
  writeFileSync('test-output-cover-letter.docx', coverBuf)
  console.log(`✓ Saved test-output-resume.docx (${(resumeBuf.length / 1024).toFixed(1)} KB)`)
  console.log(`✓ Saved test-output-cover-letter.docx (${(coverBuf.length / 1024).toFixed(1)} KB)`)

  console.log('\n✅ End-to-end test passed.')
  console.log('\nFiles to open:')
  console.log(`  ${process.cwd()}\\test-output-resume.docx`)
  console.log(`  ${process.cwd()}\\test-output-cover-letter.docx`)
}

main().catch((err) => {
  console.error('❌ Test failed:', err.message)
  process.exit(1)
})
