import { describe, expect, it } from 'vitest'
import { formatDisplayDate, getAssistantAnswer, MAX_UPLOAD_SIZE_BYTES, sectionDetails } from './appLogic'

describe('app logic', () => {
  it('formats a deterministic display date', () => {
    expect(formatDisplayDate(new Date('2026-09-07T12:00:00Z'))).toBe('MONDAY, SEPTEMBER 07, 2026')
  })

  it('returns targeted educational answers', () => {
    expect(getAssistantAnswer('What is LDL cholesterol?')).toContain('LDL')
    expect(getAssistantAnswer('What does hemoglobin mean?')).toContain('Hemoglobin')
    expect(getAssistantAnswer('What is a scan?')).toContain('educational context')
  })

  it('keeps navigation content and upload limits centralized', () => {
    expect(sectionDetails.Reports.title).toBe('Your reports')
    expect(MAX_UPLOAD_SIZE_BYTES).toBe(20 * 1024 * 1024)
  })
})