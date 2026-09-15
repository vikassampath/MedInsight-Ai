export const MAX_UPLOAD_SIZE_BYTES = 20 * 1024 * 1024

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