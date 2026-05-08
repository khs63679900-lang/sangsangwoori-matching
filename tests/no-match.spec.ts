import { test, expect } from '@playwright/test'
import { resetDb, insertJob } from './helpers/db'

test.beforeEach(async () => {
  await resetDb()
  // 서울/경비 시니어와 절대 안 맞는 공고:
  //   지역(기타≠서울): 0점 / 직종(기타≠경비): 0점 / 경력(3 < 10): 0점  →  합계 0점 → 매칭 미생성
  await insertJob({
    title: '기타 공고',
    region: '기타',
    job_type: '기타',
    required_career: 10,
  })
})

test('매칭 불가 시 안내 박스 표시', async ({ page }) => {
  await page.goto('/register')

  await page.fill('[name="name"]', '테스트시니어')
  await page.fill('[name="region"]', '서울')
  await page.fill('[name="desired_job"]', '경비')
  await page.fill('[name="career_years"]', '3')
  await page.click('button[type="submit"]')

  await page.waitForURL(/\/recommendations\?senior_id=/, { timeout: 30000 })

  // "매칭되는 일자리 없음" 안내 박스 확인
  await expect(page.getByTestId('no-match')).toBeVisible()
  await expect(page.getByTestId('no-match')).toContainText('현재 매칭되는 일자리가 없습니다')
})
