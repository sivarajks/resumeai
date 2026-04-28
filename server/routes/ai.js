import express from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'

const router = express.Router()

// Try in order; fall back on rate-limit, transient errors, OR empty responses (thinking-token budget exhaustion)
const FALLBACK_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
]

const getClient = () => new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

async function generateWithFallback({ prompt, generationConfig }) {
  const client = getClient()
  let lastErr
  for (const modelName of FALLBACK_MODELS) {
    try {
      const model = client.getGenerativeModel({ model: modelName })
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
      })
      const text = result?.response?.text?.() || ''
      if (text.trim().length === 0) {
        console.warn(`[ai] ${modelName} returned empty (likely thinking-token budget exhaustion), trying next...`)
        lastErr = new Error('Empty response from model')
        continue
      }
      console.log(`[ai] used ${modelName}`)
      return result
    } catch (err) {
      const msg = String(err?.message || err)
      const transient = msg.includes('429') || msg.includes('503') ||
        msg.includes('Too Many Requests') || msg.includes('quota') ||
        msg.includes('Service Unavailable') || msg.includes('high demand')
      if (transient) {
        console.warn(`[ai] ${modelName} unavailable (${msg.slice(0, 80)}), trying next...`)
        lastErr = err
        continue
      }
      throw err
    }
  }
  throw lastErr || new Error('All models exhausted')
}

// ── Resume Generation ──────────────────────────────────────────────────────
router.post('/generate-resume', async (req, res) => {
  const { resumeData, jobDescription } = req.body
  if (!jobDescription) return res.status(400).json({ message: 'Job description is required' })
  if (!resumeData?.personalInfo?.name) return res.status(400).json({ message: 'Resume data is incomplete' })

  const prompt = `You are an expert resume writer and ATS optimization specialist. Take a candidate's profile and a job description, then produce a highly tailored, ATS-friendly resume.

Rules:
1. Extract all relevant keywords from the job description
2. Rewrite the summary to match the role using strong opening
3. Reframe experience bullet points using strong action verbs matching job requirements
4. Merge and expand skills with relevant ones from the job description
5. Keep everything truthful — only enhance, never fabricate
6. Return clean JSON only, no markdown, no explanation

CANDIDATE PROFILE:
Name: ${resumeData.personalInfo.name}
Email: ${resumeData.personalInfo.email}
Phone: ${resumeData.personalInfo.phone}
Address: ${resumeData.personalInfo.address}
LinkedIn: ${resumeData.personalInfo.linkedin || 'N/A'}

SUMMARY: ${resumeData.summary}

EXPERIENCE:
${resumeData.experience.map((e) => `- ${e.title} at ${e.company} (${e.from}–${e.current ? 'Present' : e.to}): ${e.description}`).join('\n')}

EDUCATION:
${resumeData.education.map((e) => `- ${e.degree}${e.field ? ` in ${e.field}` : ''} at ${e.institution} (${e.from}–${e.to})${e.gpa ? `, GPA: ${e.gpa}` : ''}`).join('\n')}

CERTIFICATES: ${resumeData.certificates.map((c) => `${c.name} from ${c.issuer} (${c.date})`).join(', ') || 'None'}
SKILLS: ${resumeData.skills.join(', ') || 'Not specified'}
ADDITIONAL: ${resumeData.extras || 'None'}

---
JOB DESCRIPTION:
${jobDescription.substring(0, 3000)}

---
Return ONLY this JSON structure:
{
  "title": "Job title from job description",
  "summary": "3-4 sentence professional summary targeting this specific role",
  "experience": [{"title":"","company":"","location":"","from":"","to":"","current":false,"description":"bullet1\\nbullet2\\nbullet3"}],
  "education": [...same as input],
  "certificates": [...same as input],
  "skills": ["skill1","skill2",...merged skills matching job],
  "keywords": ["top","keywords","from","job","description"],
  "atsScore": 90
}`

  try {
    const result = await generateWithFallback({
      prompt,
      generationConfig: {
        responseMimeType: 'application/json',
        maxOutputTokens: 4096,
        temperature: 0.7,
      },
    })
    const text = result.response.text().trim()
    res.json({ resume: JSON.parse(text), success: true })
  } catch (err) {
    console.error('Resume generation error:', err)
    const msg = String(err?.message || err)
    const rateLimited = msg.includes('429') || msg.includes('quota') || msg.includes('exhausted') || msg.includes('Empty')
    res.status(500).json({
      message: rateLimited
        ? 'All free-tier AI models are temporarily unavailable. Please try again in a few minutes.'
        : 'AI generation failed.',
      error: msg,
    })
  }
})

// ── Cover Letter Generation ────────────────────────────────────────────────
router.post('/generate-cover-letter', async (req, res) => {
  const { resumeData, jobDescription } = req.body
  if (!resumeData?.personalInfo?.name) return res.status(400).json({ message: 'Resume data is incomplete' })

  const prompt = `Write a professional, compelling cover letter for this candidate applying for this job.

CANDIDATE:
Name: ${resumeData.personalInfo.name}
Title: ${resumeData.generatedResume?.title || resumeData.experience[0]?.title || 'Professional'}
Summary: ${resumeData.generatedResume?.summary || resumeData.summary}
Top Skills: ${(resumeData.generatedResume?.skills || resumeData.skills).slice(0, 6).join(', ')}
Experience: ${resumeData.experience.map((e) => `${e.title} at ${e.company}`).join(', ')}
Education: ${resumeData.education.map((e) => `${e.degree} from ${e.institution}`).join(', ')}

JOB DESCRIPTION:
${(jobDescription || '').substring(0, 2000)}

Write a 3-4 paragraph cover letter. Start with "Dear Hiring Manager," and end with "Sincerely, [Name]". Be specific, enthusiastic, and professional. Match keywords from the job description. Do NOT add any explanation — just the cover letter text.`

  try {
    const result = await generateWithFallback({
      prompt,
      generationConfig: { maxOutputTokens: 2048, temperature: 0.8 },
    })
    res.json({ coverLetter: result.response.text().trim(), success: true })
  } catch (err) {
    console.error('Cover letter error:', err)
    const msg = String(err?.message || err)
    const rateLimited = msg.includes('429') || msg.includes('quota') || msg.includes('exhausted') || msg.includes('Empty')
    res.status(500).json({
      message: rateLimited
        ? 'All free-tier AI models are temporarily unavailable. Please try again in a few minutes.'
        : 'Cover letter generation failed.',
      error: msg,
    })
  }
})

export default router
