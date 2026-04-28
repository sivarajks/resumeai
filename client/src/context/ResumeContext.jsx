import { createContext, useContext, useState } from 'react'

const ResumeContext = createContext()

export function useResume() {
  return useContext(ResumeContext)
}

const defaultResume = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    phoneCountryCode: '+91',
    country: 'India',
    state: '',
    city: '',
    pincode: '',
    address: '',
    linkedin: '',
    indeed: '',
  },
  photo: null,
  summary: '',
  experience: [],
  education: [],
  certificates: [],
  skills: [],
  extras: '',
  selectedTemplate: 'modern',
  templateColor: null,
  jobDescription: '',
  generatedResume: null,
  coverLetter: '',
}

export function ResumeProvider({ children }) {
  const [resumeData, setResumeData] = useState(defaultResume)
  const [currentStep, setCurrentStep] = useState(0)

  function updatePersonalInfo(data) {
    setResumeData((prev) => ({ ...prev, personalInfo: { ...prev.personalInfo, ...data } }))
  }

  function updateSection(section, data) {
    setResumeData((prev) => ({ ...prev, [section]: data }))
  }

  function setTemplate(template) {
    setResumeData((prev) => ({ ...prev, selectedTemplate: template, templateColor: null }))
  }

  function setTemplateColor(color) {
    setResumeData((prev) => ({ ...prev, templateColor: color }))
  }

  function setGeneratedResume(data) {
    setResumeData((prev) => ({ ...prev, generatedResume: data }))
  }

  function setPhoto(dataUrl) {
    setResumeData((prev) => ({ ...prev, photo: dataUrl }))
  }

  function setCoverLetter(text) {
    setResumeData((prev) => ({ ...prev, coverLetter: text }))
  }

  function resetResume() {
    setResumeData(defaultResume)
    setCurrentStep(0)
  }

  const value = {
    resumeData,
    currentStep,
    setCurrentStep,
    updatePersonalInfo,
    updateSection,
    setTemplate,
    setTemplateColor,
    setGeneratedResume,
    setPhoto,
    setCoverLetter,
    resetResume,
  }

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
}
