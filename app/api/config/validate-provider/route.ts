import { NextResponse } from 'next/server'
import { PROVIDERS } from '@/lib/providers'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const providerName = searchParams.get('providerName')

    if (!providerName) {
      return NextResponse.json(
        { error: '提供商名称是必需的' },
        { status: 400 }
      )
    }

    // 查找提供商配置
    const provider = PROVIDERS.find(p => p.providerName === providerName)
    if (!provider) {
      return NextResponse.json(
        { error: `未找到提供商 ${providerName} 的环境变量配置` },
        { status: 400 }
      )
    }

    // 验证环境变量
    const envKey = provider.envKey
    const apiKey = process.env[envKey]

    if (!apiKey) {
      return NextResponse.json(
        { error: `环境变量${envKey}的值为空` },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error validating provider:', error)
    return NextResponse.json(
      { error: '验证提供商配置失败' },
      { status: 500 }
    )
  }
}