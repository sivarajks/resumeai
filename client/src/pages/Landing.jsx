import { Link } from 'react-router-dom'
import { FileText, Zap, Target, Download, CheckCircle, Star, ArrowRight, Sparkles, Shield, Clock } from 'lucide-react'

const features = [
  { icon: Zap, title: 'AI-Powered Generation', desc: 'Claude AI analyzes job listings and crafts resumes tailored to each position in seconds.' },
  { icon: Target, title: 'ATS Optimized', desc: 'Beat applicant tracking systems with keyword-rich resumes that get past the filters.' },
  { icon: FileText, title: '5 Professional Templates', desc: 'Modern, Classic, Minimal, Creative, and Europass — designs built by HR experts.' },
  { icon: Download, title: 'One-Click PDF Export', desc: 'Download your resume as a polished PDF ready to submit instantly.' },
  { icon: Shield, title: 'Data Privacy', desc: 'Your personal data is encrypted and never shared with third parties.' },
  { icon: Clock, title: 'Resume in 60 Seconds', desc: 'From job URL to ready-to-send resume in under a minute.' },
]

const steps = [
  { num: '01', title: 'Fill Your Profile', desc: 'Enter your experience, education, skills and personal details once.' },
  { num: '02', title: 'Paste Job URL', desc: 'Copy the job listing URL from LinkedIn, Indeed, or any job board.' },
  { num: '03', title: 'AI Builds Resume', desc: 'Our AI extracts keywords and rewrites your resume to match the role.' },
  { num: '04', title: 'Download & Apply', desc: 'Get your ATS-friendly PDF and apply with confidence.' },
]

const testimonials = [
  { name: 'Sarah M.', role: 'Software Engineer', text: 'Got 3 interviews in a week after switching to ResumeAI. The keyword matching is insane!', rating: 5 },
  { name: 'James R.', role: 'Marketing Manager', text: 'Saved me hours of resume tweaking. Now I customize per job in 60 seconds flat.', rating: 5 },
  { name: 'Priya K.', role: 'Data Analyst', text: 'Finally cracked the ATS wall. ResumeAI is a game changer for job seekers.', rating: 5 },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-accent-600 text-white pt-24 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            AI-Powered Resume Builder
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Land More Interviews <br />
            <span className="text-yellow-300">With AI-Crafted Resumes</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            Paste a job listing URL. Our AI reads it, extracts the keywords, and builds you a perfectly tailored, ATS-friendly resume in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-primary-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl flex items-center gap-2 justify-center">
              Build My Resume Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="border-2 border-white/40 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all flex items-center gap-2 justify-center backdrop-blur-sm">
              Sign In
            </Link>
          </div>
          <p className="text-blue-200 text-sm mt-5">No credit card required · Free plan available</p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary-700 text-white py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[['50K+', 'Resumes Created'], ['3x', 'More Interviews'], ['60s', 'Average Build Time']].map(([val, label]) => (
            <div key={label}>
              <div className="text-3xl font-extrabold text-yellow-300">{val}</div>
              <div className="text-blue-200 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="section-title">How It Works</h2>
          <p className="section-sub">Four simple steps to your perfect resume</p>
          <div className="grid md:grid-cols-4 gap-8 mt-10">
            {steps.map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary-600 text-white flex items-center justify-center text-xl font-bold mb-4 shadow-lg">
                  {step.num}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Everything You Need to Get Hired</h2>
            <p className="section-sub">Professional tools that give you an unfair advantage</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="section-title">Loved by Job Seekers</h2>
          <p className="section-sub">Join thousands who landed their dream jobs</p>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {testimonials.map((t) => (
              <div key={t.name} className="card text-left">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-700 to-accent-600 text-white text-center">
        <h2 className="text-4xl font-extrabold mb-4">Ready to Land Your Dream Job?</h2>
        <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">Join 50,000+ job seekers who use ResumeAI to stand out from the crowd.</p>
        <Link to="/register" className="bg-white text-primary-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl inline-flex items-center gap-2">
          Start Building For Free <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4 text-center text-sm">
        <div className="flex items-center justify-center gap-2 text-white font-semibold text-lg mb-4">
          <FileText className="w-5 h-5 text-primary-400" /> ResumeAI
        </div>
        <p>© 2025 ResumeAI. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-3">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </footer>
    </div>
  )
}
