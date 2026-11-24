export const MAX_UPLOAD_SIZE_BYTES = 20 * 1024 * 1024
export const ACCEPTED_REPORT_TYPES = '.pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png'

const acceptedReportTypes: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
}

export function isSupportedReportFile(file: Pick<File, 'name' | 'size' | 'type'>): boolean {
  const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
  const expectedMimeType = acceptedReportTypes[extension]
  return file.size > 0
    && file.size <= MAX_UPLOAD_SIZE_BYTES
    && expectedMimeType !== undefined
    && (!file.type || file.type.toLowerCase() === expectedMimeType)
}

export const sectionDetails: Record<string, { title: string; description: string }> = {
  Reports: { title: 'Your reports', description: 'Report history will appear here when storage is connected.' },
  Imaging: { title: 'Your imaging', description: 'Imaging studies will appear here when image storage is connected.' },
  Knowledge: { title: 'Knowledge assistant', description: 'Sample explanations are available on the overview page.' },
  Patients: { title: 'Your patients', description: 'Patient history will appear here when connected to a workspace.' },
}

export function formatDisplayDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  }).format(date).toUpperCase()
}

export function getGreeting(date: Date): string {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function getAssistantAnswer(question: string): string {
  const normalizedQuestion = question.toLowerCase()
  if (normalizedQuestion.includes('ldl')) {
    return 'LDL (low-density lipoprotein) carries cholesterol in the blood. Higher LDL levels can raise the risk of coronary artery disease; personal goals depend on individual risk and should be discussed with a health professional.'
  }
  if (normalizedQuestion.includes('hemoglobin')) {
    return 'Hemoglobin is an iron-rich protein in red blood cells that carries oxygen from the lungs to the rest of the body. Results are interpreted using the lab report’s reference range and personal context.'
  }
  return 'This demo has sample explanations for LDL cholesterol and hemoglobin. Try asking about one of those topics.'
}

export function getAssistantSource(question: string): { label: string; url: string } | null {
  const normalizedQuestion = question.toLowerCase()
  if (normalizedQuestion.includes('ldl')) {
    return {
      label: 'MedlinePlus: LDL cholesterol',
      url: 'https://medlineplus.gov/ldlthebadcholesterol.html',
    }
  }
  if (normalizedQuestion.includes('hemoglobin')) {
    return {
      label: 'MedlinePlus: Hemoglobin test',
      url: 'https://medlineplus.gov/lab-tests/hemoglobin-test/',
    }
  }
  return null
}
