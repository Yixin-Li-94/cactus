import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('请填写所有字段')
      return
    }

    const success = await login(email, password)
    if (success) {
      navigate('/')
    } else {
      setError('邮箱或密码错误')
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-primary-600 font-heading font-bold text-2xl">L</span>
            </div>
          </Link>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">
            欢迎回来
          </h1>
          <p className="text-primary-100">
            登录您的账号继续学习
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="email"
              label="邮箱地址"
              placeholder="your@email.com"
              icon={<Mail size={18} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              label="密码"
              placeholder="••••••••"
              icon={<Lock size={18} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              登录
              <ArrowRight className="ml-2" size={18} />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              还没有账号？{' '}
              <Link to="/register" className="text-primary-600 font-semibold hover:underline">
                立即注册
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              演示账号: demo@lingolearn.com / demo123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
