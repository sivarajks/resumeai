import express from 'express'
import axios from 'axios'
import * as cheerio from 'cheerio'

const router = express.Router()

router.post('/', async (req, res) => {
  const { url } = req.body
  if (!url) return res.status(400).json({ message: 'URL is required' })

  try {
    const { data: html } = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    })

    const $ = cheerio.load(html)

    // Remove noise
    $('script, style, nav, header, footer, iframe, noscript, .cookie-banner, #cookie').remove()

    // Try common job description containers
    const selectors = [
      '[class*="job-description"]',
      '[class*="jobDescription"]',
      '[class*="description"]',
      '[id*="job-description"]',
      '[id*="jobDescription"]',
      'article',
      'main',
      '.posting-requirements',
      '.job-listing',
    ]

    let text = ''
    for (const sel of selectors) {
      const el = $(sel).first()
      if (el.length && el.text().trim().length > 200) {
        text = el.text().trim()
        break
      }
    }

    if (!text) text = $('body').text().trim()

    // Clean up whitespace
    text = text.replace(/\s{3,}/g, '\n\n').substring(0, 5000)

    res.json({ text, success: true })
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch job listing. Please paste the job description manually.',
      error: err.message,
    })
  }
})

export default router
