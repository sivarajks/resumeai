import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import scrapeRouter from './routes/scrape.js'
import aiRouter from './routes/ai.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '2mb' }))

const limiter = rateLimit({ windowMs: 60 * 1000, max: 20, message: { message: 'Too many requests, please slow down.' } })
app.use('/api', limiter)

app.use('/api/scrape', scrapeRouter)
app.use('/api', aiRouter)

app.get('/health', (_, res) => res.json({ status: 'ok', time: new Date().toISOString() }))

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
