'use client'

import { useActionState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { registerSenior } from '@/app/actions'

const fields = [
  { id: 'name',         label: '이름',      hint: '성함이 어떻게 되세요?',          type: 'text',   placeholder: '홍길동',                  required: true  },
  { id: 'region',       label: '지역',      hint: '어디에서 일하고 싶으세요?',       type: 'text',   placeholder: '서울, 부산, 대구 등',      required: true  },
  { id: 'desired_job',  label: '희망 직종', hint: '어떤 일을 하시겠어요?',           type: 'text',   placeholder: '경비, 청소, 사무보조 등',  required: true  },
  { id: 'career_years', label: '경력 (년)', hint: '경력은 몇 년이나 되세요?',        type: 'number', placeholder: '예: 10',                  required: false },
]

export default function RegisterPage() {
  const [state, action] = useActionState(registerSenior, null)

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-blue-700 mb-2">시니어 일자리 신청하기</h1>
      <p className="text-xl text-gray-600 mb-8">정보를 입력하시면 맞는 일자리를 찾아드립니다.</p>

      <Card className="shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl">시니어 정보 입력</CardTitle>
          <CardDescription className="text-lg text-gray-500">
            * 표시 항목은 필수 입력입니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state?.error && (
            <div
              role="alert"
              data-testid="error-message"
              className="mb-4 bg-red-50 border border-red-400 rounded-lg p-4 text-red-700 text-lg"
            >
              {state.error}
            </div>
          )}
          <form action={action} className="flex flex-col gap-6">
            {fields.map(({ id, label, hint, type, placeholder, required }) => (
              <div key={id} className="flex flex-col gap-2">
                <p className="text-lg text-blue-700 font-medium">{hint}</p>
                <label htmlFor={id} className="text-xl font-semibold text-gray-800">
                  {label}{required && ' *'}
                </label>
                <Input
                  id={id}
                  name={id}
                  type={type}
                  placeholder={placeholder}
                  min={type === 'number' ? 0 : undefined}
                  className="text-xl h-14 px-4 border-2 border-gray-300 focus:border-blue-600"
                />
              </div>
            ))}

            <Button
              type="submit"
              size="lg"
              className="mt-4 w-full text-2xl py-7 bg-blue-700 hover:bg-blue-800"
            >
              등록하기
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
