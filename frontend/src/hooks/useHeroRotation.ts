import { useState, useEffect } from 'react'

export interface HeroState {
  stage: string
  title: string
  meta: string
  metricOne: string; labelOne: string
  metricTwo: string; labelTwo: string
  metricThree: string; labelThree: string
  badgeLabel: string; badgeValue: string
  footnoteLabel: string; footnoteValue: string
}

const HERO_STATES: HeroState[] = [
  {
    stage: 'VOUCHER REDEEMED',
    title: 'AWS Cloud Practitioner',
    meta: 'Rahul Sharma · Access token accepted',
    metricOne: 'CB-9X2', labelOne: 'Voucher',
    metricTwo: 'READY',  labelTwo: 'Status',
    metricThree: '1',    labelThree: 'Attempt',
    badgeLabel: 'Identity checked',    badgeValue: 'Candidate verified',
    footnoteLabel: 'Queue',            footnoteValue: '14 exams ready',
  },
  {
    stage: 'EXAM IN PROGRESS',
    title: 'AWS Cloud Practitioner',
    meta: 'Rahul Sharma · Secure browser active',
    metricOne: '42m',  labelOne: 'Remaining',
    metricTwo: 'LIVE', labelTwo: 'Status',
    metricThree: '0',  labelThree: 'Flags',
    badgeLabel: 'Exam in progress', badgeValue: '14 candidates live',
    footnoteLabel: 'This month',    footnoteValue: '847 certs issued',
  },
  {
    stage: 'SCORE CALCULATED',
    title: 'AWS Cloud Practitioner',
    meta: 'Rahul Sharma · Submitted 14 Jun 2025',
    metricOne: '84%',  labelOne: 'Score',
    metricTwo: 'PASS', labelTwo: 'Result',
    metricThree: '38m', labelThree: 'Duration',
    badgeLabel: 'Evaluation complete',      badgeValue: 'Negative marking applied',
    footnoteLabel: 'Audit trail',           footnoteValue: 'All events sealed',
  },
  {
    stage: 'CERTIFICATE ISSUED',
    title: 'AWS Cloud Practitioner',
    meta: 'Rahul Sharma · ID CB-QN-714X99',
    metricOne: 'PDF',   labelOne: 'Credential',
    metricTwo: 'VALID', labelTwo: 'Lookup',
    metricThree: '<1s', labelThree: 'Issued',
    badgeLabel: 'Credential live',  badgeValue: 'Ready for employer audit',
    footnoteLabel: 'Verify ID',     footnoteValue: 'CB-QN-714X99',
  },
]

export function useHeroRotation(interval = 2600) {
  const [index, setIndex] = useState(0)
  const [isShifting, setIsShifting] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setIsShifting(true)
      setTimeout(() => {
        setIndex((i) => (i + 1) % HERO_STATES.length)
        setIsShifting(false)
      }, 360)
    }, interval)
    return () => clearInterval(id)
  }, [interval])

  return { state: HERO_STATES[index], isShifting }
}
