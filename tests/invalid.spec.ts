import { test, expect } from '@playwright/test'
import { resetDb, countSeniors } from './helpers/db'

test.beforeEach(async () => {
  await resetDb()
})

test('이름 빈칸 제출 → 빨간 에러 박스 표시, DB 레코드 미생성', async ({ page }) => {
  await page.goto('/register')

  // 브라우저 기본 HTML5 유효성 검사를 우회해 서버 사이드 검증을 테스트
  await page.evaluate(() => {
    const input = document.querySelector<HTMLInputElement>('[name="name"]')
    input?.removeAttribute('required')
  })

  // 이름 비움 / 나머지 입력
  await page.fill('[name="region"]', '서울')
  await page.fill('[name="desired_job"]', '경비')
  await page.fill('[name="career_years"]', '3')

  await page.click('button[type="submit"]')

  // 빨간 에러 박스 확인
  await expect(page.getByTestId('error-message')).toBeVisible({ timeout: 15000 })
  await expect(page.getByTestId('error-message')).toContainText('이름을 입력해 주세요.')

  // 페이지가 /register 에 머물러야 함
  expect(page.url()).toContain('/register')

  // seniors 테이블에 새 레코드가 없어야 함
  const count = await countSeniors()
  expect(count).toBe(0)
})
