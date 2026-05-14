import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useProgressStore } from '@/stores/progressStore'
import { achievements as defaultAchievements } from '@/data/mockData'
import {
  Clock,
  Flame,
  Trophy,
  Target,
  BookOpen,
  Mic,
  Headphones,
  PenTool,
  TrendingUp,
  Calendar,
  Star,
  ChevronRight,
} from 'lucide-react'
import Card from '@/components/common/Card'
import { formatTime } from '@/utils/helpers'

export default function ProgressPage() {
  const { user, isAuthenticated } = useAuthStore()
  const {
    todayMinutes,
    totalMinutes,
    currentStreak,
    longestStreak,
    vocabularyAccuracy,
    grammarAccuracy,
    speakingCount,
    listeningAccuracy,
    unlockedAchievements,
    weeklyProgress,
    loadProgress,
  } = useProgressStore()

  useEffect(() => {
    if (isAuthenticated && user) {
      loadProgress(user.id)
    }
  }, [isAuthenticated, user, loadProgress])

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
            <TrendingUp className="text-primary-600" size={40} />
          </div>
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">
            查看学习进度
          </h2>
          <p className="text-gray-600 mb-6">
            登录后即可查看你的学习数据统计
          </p>
          <Link to="/login" className="btn-primary inline-block">
            立即登录
          </Link>
        </Card>
      </div>
    )
  }

  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const maxMinutes = Math.max(...weeklyProgress, 1)

  const accuracyStats = [
    {
      icon: BookOpen,
      label: '单词正确率',
      value: Math.round(vocabularyAccuracy),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      icon: PenTool,
      label: '语法正确率',
      value: Math.round(grammarAccuracy),
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      icon: Mic,
      label: '口语练习',
      value: speakingCount,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
    },
    {
      icon: Headphones,
      label: '听力正确率',
      value: Math.round(listeningAccuracy),
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ]

  const levelProgress = (user?.experience || 0) % 1000
  const currentLevel = user?.level || 1
  const nextLevelXP = 1000

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
          学习进度
        </h1>
        <p className="text-gray-600">
          追踪你的学习数据，见证每一次进步
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
          <div className="relative">
            <div className={`w-14 h-14 mx-auto mb-3 ${accuracyStats[0].bgColor} rounded-2xl flex items-center justify-center`}>
              <Clock className={accuracyStats[0].textColor} size={28} />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{todayMinutes}</div>
            <div className="text-sm text-gray-500">今日学习(分钟)</div>
          </div>
        </Card>

        <Card className="p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
          <div className="relative">
            <div className={`w-14 h-14 mx-auto mb-3 ${accuracyStats[1].bgColor} rounded-2xl flex items-center justify-center`}>
              <Flame className={accuracyStats[1].textColor} size={28} />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{currentStreak}</div>
            <div className="text-sm text-gray-500">连续学习(天)</div>
          </div>
        </Card>

        <Card className="p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
          <div className="relative">
            <div className={`w-14 h-14 mx-auto mb-3 ${accuracyStats[2].bgColor} rounded-2xl flex items-center justify-center`}>
              <Trophy className={accuracyStats[2].textColor} size={28} />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{Math.floor(totalMinutes / 60)}</div>
            <div className="text-sm text-gray-500">累计学习(小时)</div>
          </div>
        </Card>

        <Card className="p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
          <div className="relative">
            <div className={`w-14 h-14 mx-auto mb-3 ${accuracyStats[3].bgColor} rounded-2xl flex items-center justify-center`}>
              <Target className={accuracyStats[3].textColor} size={28} />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{longestStreak}</div>
            <div className="text-sm text-gray-500">最长连续(天)</div>
          </div>
        </Card>
      </div>

      {/* Weekly Progress Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-bold text-gray-900">
            本周学习趋势
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={16} />
            <span>{days[new Date().getDay()]}</span>
          </div>
        </div>

        <div className="flex items-end justify-between h-48 gap-3">
          {weeklyProgress.map((minutes, index) => {
            const height = minutes > 0 ? (minutes / maxMinutes) * 100 : 5
            const isToday = index === new Date().getDay()

            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex-1 flex items-end">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-500 ${
                      isToday
                        ? 'bg-gradient-to-t from-primary-500 to-primary-400'
                        : minutes > 0
                        ? 'bg-gradient-to-t from-primary-300 to-primary-200'
                        : 'bg-gray-100'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <div className="text-center">
                  <span className={`text-sm ${isToday ? 'text-primary-600 font-semibold' : 'text-gray-500'}`}>
                    {minutes > 0 ? `${minutes}m` : ''}
                  </span>
                  <div className={`text-xs mt-1 ${isToday ? 'text-primary-600 font-semibold' : 'text-gray-400'}`}>
                    {days[index]}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Module Accuracy */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-heading font-bold text-gray-900 mb-6">
            学习模块表现
          </h2>
          <div className="space-y-6">
            {accuracyStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                        <Icon className={stat.textColor} size={20} />
                      </div>
                      <span className="font-medium text-gray-700">{stat.label}</span>
                    </div>
                    <span className={`font-bold ${stat.textColor}`}>{stat.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-500`}
                      style={{ width: `${stat.value}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Level Progress */}
        <Card className="p-6">
          <h2 className="text-xl font-heading font-bold text-gray-900 mb-6">
            我的等级
          </h2>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Star className="text-white" size={40} />
            </div>
            <div className="flex-1">
              <div className="text-2xl font-heading font-bold text-gray-900">
                Lv.{currentLevel}
              </div>
              <div className="text-sm text-gray-500">
                {user?.experience || 0} / {nextLevelXP} XP
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>当前进度</span>
              <span>{Math.round((levelProgress / nextLevelXP) * 100)}%</span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
                style={{ width: `${(levelProgress / nextLevelXP) * 100}%` }}
              />
            </div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-sm text-gray-500 mb-1">距离下一级还需</div>
            <div className="text-xl font-bold text-primary-600">
              {nextLevelXP - levelProgress} XP
            </div>
          </div>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-bold text-gray-900">
            成就徽章
          </h2>
          <span className="text-sm text-gray-500">
            {unlockedAchievements.length}/{defaultAchievements.length} 已解锁
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {defaultAchievements.map((achievement) => {
            const isUnlocked = unlockedAchievements.some((a) => a.id === achievement.id)
            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl text-center transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200'
                    : 'bg-gray-50 opacity-50'
                }`}
              >
                <div className={`text-4xl mb-2 ${isUnlocked ? '' : 'grayscale'}`}>
                  {achievement.icon}
                </div>
                <div className={`font-semibold text-sm ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                  {achievement.name}
                </div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {achievement.description}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-6">
        <h2 className="text-xl font-heading font-bold text-gray-900 mb-4">
          个性化建议
        </h2>
        <div className="space-y-4">
          {vocabularyAccuracy < 70 && (
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
              <BookOpen className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <div className="font-semibold text-gray-900">加强单词记忆</div>
                <div className="text-sm text-gray-600 mt-1">
                  您的单词正确率还有提升空间，建议每天多花时间练习闪卡。
                </div>
                <Link
                  to="/learn/vocabulary"
                  className="inline-flex items-center gap-1 text-blue-600 text-sm font-medium mt-2 hover:underline"
                >
                  去练习
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          )}

          {grammarAccuracy < 70 && (
            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
              <PenTool className="text-purple-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <div className="font-semibold text-gray-900">语法需要加强</div>
                <div className="text-sm text-gray-600 mt-1">
                  建议系统复习语法规则，多做选择题练习。
                </div>
                <Link
                  to="/learn/grammar"
                  className="inline-flex items-center gap-1 text-purple-600 text-sm font-medium mt-2 hover:underline"
                >
                  去练习
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          )}

          {speakingCount < 10 && (
            <div className="flex items-start gap-3 p-4 bg-pink-50 rounded-xl">
              <Mic className="text-pink-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <div className="font-semibold text-gray-900">口语练习不足</div>
                <div className="text-sm text-gray-600 mt-1">
                  您的口语练习次数较少，建议每天进行跟读练习。
                </div>
                <Link
                  to="/learn/speaking"
                  className="inline-flex items-center gap-1 text-pink-600 text-sm font-medium mt-2 hover:underline"
                >
                  去练习
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          )}

          {vocabularyAccuracy >= 70 && grammarAccuracy >= 70 && speakingCount >= 10 && (
            <div className="flex items-start gap-3 p-4 bg-accent-50 rounded-xl">
              <TrendingUp className="text-accent-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <div className="font-semibold text-gray-900">学习表现优秀！</div>
                <div className="text-sm text-gray-600 mt-1">
                  您在各模块的学习表现都很棒！继续保持，探索新课程内容。
                </div>
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-1 text-accent-600 text-sm font-medium mt-2 hover:underline"
                >
                  浏览课程
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
