import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useProgressStore } from '@/stores/progressStore'
import { courses } from '@/data/mockData'
import {
  User,
  Settings,
  LogOut,
  BookOpen,
  Clock,
  Flame,
  Trophy,
  Star,
  ChevronRight,
  Edit,
  Bell,
  Shield,
  HelpCircle,
  Globe,
} from 'lucide-react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const {
    totalMinutes,
    currentStreak,
    vocabularyAccuracy,
    grammarAccuracy,
    speakingCount,
    unlockedAchievements,
    loadProgress,
  } = useProgressStore()

  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'achievements'>('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [editUsername, setEditUsername] = useState('')

  useEffect(() => {
    if (isAuthenticated && user) {
      loadProgress(user.id)
    }
  }, [isAuthenticated, user, loadProgress])

  useEffect(() => {
    if (user) {
      setEditUsername(user.username)
    }
  }, [user])

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="text-primary-600" size={40} />
          </div>
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">
            登录查看个人资料
          </h2>
          <p className="text-gray-600 mb-6">
            登录后可以查看学习数据、管理设置
          </p>
          <Link to="/login" className="btn-primary inline-block">
            立即登录
          </Link>
        </Card>
      </div>
    )
  }

  const enrolledCourses = courses.slice(0, 2)
  const totalXP = user.experience
  const currentLevel = user.level
  const xpForNextLevel = 1000
  const currentLevelXP = totalXP % xpForNextLevel

  const handleSaveProfile = () => {
    useAuthStore.getState().updateUser({ username: editUsername })
    setIsEditing(false)
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500" />
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg"
              />
              <button className="absolute bottom-1 right-1 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-primary-600 transition-colors">
                <Edit size={14} />
              </button>
            </div>

            <div className="flex-1">
              {isEditing ? (
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <Button size="sm" onClick={handleSaveProfile}>
                    保存
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                    取消
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-heading font-bold text-gray-900">
                    {user.username}
                  </h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                </div>
              )}
              <p className="text-gray-500">{user.email}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-center px-4 py-2 bg-primary-50 rounded-xl">
                <div className="text-2xl font-bold text-primary-600">Lv.{currentLevel}</div>
                <div className="text-xs text-primary-600">当前等级</div>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>{currentLevelXP} / {xpForNextLevel} XP</span>
              <span>{Math.round((currentLevelXP / xpForNextLevel) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                style={{ width: `${(currentLevelXP / xpForNextLevel) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { key: 'overview', label: '学习概览', icon: BookOpen },
          { key: 'achievements', label: '成就徽章', icon: Trophy },
          { key: 'settings', label: '账号设置', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex-1 py-4 text-center font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === tab.key
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold text-gray-900">{Math.floor(totalMinutes / 60)}h</div>
                <div className="text-sm text-gray-500">学习时长</div>
              </Card>
              <Card className="p-4 text-center">
                <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                <div className="text-2xl font-bold text-gray-900">{currentStreak}</div>
                <div className="text-sm text-gray-500">连续天数</div>
              </Card>
              <Card className="p-4 text-center">
                <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold text-gray-900">{totalXP}</div>
                <div className="text-sm text-gray-500">总经验值</div>
              </Card>
              <Card className="p-4 text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold text-gray-900">{unlockedAchievements.length}</div>
                <div className="text-sm text-gray-500">已获成就</div>
              </Card>
            </div>

            {/* Learning Stats */}
            <Card className="p-6">
              <h3 className="font-heading font-semibold text-lg text-gray-900 mb-4">
                学习数据
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <BookOpen className="text-blue-500" size={20} />
                    <span className="font-medium text-gray-700">单词正确率</span>
                  </div>
                  <span className="font-bold text-blue-600">{Math.round(vocabularyAccuracy)}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Star className="text-purple-500" size={20} />
                    <span className="font-medium text-gray-700">语法正确率</span>
                  </div>
                  <span className="font-bold text-purple-600">{Math.round(grammarAccuracy)}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-pink-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Globe className="text-pink-500" size={20} />
                    <span className="font-medium text-gray-700">口语练习</span>
                  </div>
                  <span className="font-bold text-pink-600">{speakingCount}次</span>
                </div>
              </div>
            </Card>

            {/* Enrolled Courses */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-lg text-gray-900">
                  我的课程
                </h3>
                <Link to="/courses" className="text-primary-600 text-sm font-medium hover:underline">
                  查看全部
                </Link>
              </div>
              <div className="space-y-4">
                {enrolledCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl overflow-hidden">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{course.title}</h4>
                      <p className="text-sm text-gray-500">{course.totalLessons} 课时</p>
                    </div>
                    <ChevronRight className="text-gray-400" size={20} />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-heading font-semibold text-lg text-gray-900 mb-4">
                成就进度
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: '初学者', desc: '完成第一节课', icon: '🎯', progress: 100 },
                  { name: '七日坚持', desc: '连续学习7天', icon: '🔥', progress: Math.min((currentStreak / 7) * 100, 100) },
                  { name: '词汇大师', desc: '100个单词', icon: '📚', progress: Math.min((vocabularyAccuracy / 100) * 100, 100) },
                  { name: '语法专家', desc: '语法90%正确', icon: '✍️', progress: Math.min((grammarAccuracy / 90) * 100, 100) },
                  { name: '口语达人', desc: '50次口语', icon: '🎤', progress: Math.min((speakingCount / 50) * 100, 100) },
                  { name: '学习时长', desc: '100小时', icon: '⏰', progress: Math.min((totalMinutes / 6000) * 100, 100) },
                ].map((achievement, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <div className="font-semibold text-gray-900">{achievement.name}</div>
                    <div className="text-sm text-gray-500 mb-2">{achievement.desc}</div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <Card className="divide-y divide-gray-100">
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <User className="text-gray-400" size={20} />
                  <span className="font-medium text-gray-700">编辑个人资料</span>
                </div>
                <ChevronRight className="text-gray-400" size={20} />
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Bell className="text-gray-400" size={20} />
                  <span className="font-medium text-gray-700">通知设置</span>
                </div>
                <ChevronRight className="text-gray-400" size={20} />
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Globe className="text-gray-400" size={20} />
                  <span className="font-medium text-gray-700">学习语言偏好</span>
                </div>
                <ChevronRight className="text-gray-400" size={20} />
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Shield className="text-gray-400" size={20} />
                  <span className="font-medium text-gray-700">隐私与安全</span>
                </div>
                <ChevronRight className="text-gray-400" size={20} />
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <HelpCircle className="text-gray-400" size={20} />
                  <span className="font-medium text-gray-700">帮助与反馈</span>
                </div>
                <ChevronRight className="text-gray-400" size={20} />
              </button>
            </Card>

            <Card className="p-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut size={20} />
                <span className="font-medium">退出登录</span>
              </button>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
