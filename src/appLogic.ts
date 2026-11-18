export const MAX_UPLOAD_SIZE_BYTES = 20 * 1024 * 1024
export const ACCEPTED_REPORT_TYPES = '.pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png'

const acceptedReportExtensions = new Set(['.pdf', '.jpg', '.jpeg', '.png'])
const acceptedReportMimeTypes = new Set(['application/pdf', 'image/jpeg', 'image/png'])

export function isSupportedReportFile(file: Pick<File, 'name' | 'size' | 'type'>): boolean {
  const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
  return file.size > 0
    && file.size <= MAX_UPLOAD_SIZE_BYTES
    && (acceptedReportMimeTypes.has(file.type.toLowerCase()) || acceptedReportExtensions.has(extension))
}

export const sectionDetails: Record<string, { title: string; description: string }> = {
  Reports: { title: 'Your reports', description: 'Review uploaded reports and their analysis status.' },
  Imaging: { title: 'Your imaging', description: 'Keep imaging studies and processing updates in one place.' },
  Knowledge: { title: 'Knowledge assistant', description: 'Explore plain-language context for health terms and results.' },
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
    return 'LDL is a type of cholesterol that can contribute to plaque buildup in arteries when levels stay high.'
  }
  if (normalizedQuestion.includes('hemoglobin')) {
    return 'Hemoglobin is a protein in red blood cells that carries oxygen through your body.'
  }
  return 'Ask about a health term or result and MedInsight will provide educational context.'
}
