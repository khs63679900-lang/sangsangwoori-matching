import { test, expect } from '@playwright/test'
import { resetDb, insertJob } from './helpers/db'

test.beforeEach(async () => {
  await resetDb()
  await insertJob({
    title: '서울 경비 모집',
    region: '서울',
    job_type: '경비',
    required_career: 3,
  })
})

test('시니어 등록 → 매칭 추천 정상 흐름', async ({ page }) => {
  await page.goto('/register')

  await page.fill('[name="name"]', '테스트시니어')
  await page.fill('[name="region"]', '서울')
  await page.fill('[name="desired_job"]', '경비')
  await page.fill('[name="career_years"]', '5')
  await page.click('button[type="submit"]')

  // 등록 완료 후 /recommendations 로 이동
  await page.waitForURL(/\/recommendations\?senior_id=/, { timeout: 30000 })

  // 초록 성공 박스 확인
  await expect(page.getByTestId('success-message')).toBeVisible()
  await expect(page.getByTestId('success-message')).toContainText('등록이 완료되었습니다')

  // 100점 카드 (50지역+30직종+20경력) 상단 표시 확인
  const firstCard = page.getByTestId('match-card').first()
  await expect(firstCard).toBeVisible()
  await expect(firstCard.getByTestId('score-badge')).toContainText('100점')
})
