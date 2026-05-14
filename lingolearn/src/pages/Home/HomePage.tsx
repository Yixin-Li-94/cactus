import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useProgressStore } from '@/stores/progressStore'
import { courses } from '@/data/mockData'
import {
  Clock,
  Flame,
  Trophy,
  BookOpen,
  Mic,
  Headphones,
  PenTool,
  Layers,
  ArrowRight,
  Star,
} from 'lucide-react'
import Card from '@/components/common/Card'
import { formatTime } from '@/utils/helpers'
import { useEffect } from 'react'

export default function HomePage() {
  const { user, isAuthenticated } = useAuthStore()
  const {
    todayMinutes,
    currentStreak,
    totalMinutes,
    vocabularyAccuracy,
    grammarAccuracy,
    speakingCount,
    weeklyProgress,
  } = useProgressStore()

  useEffect(() => {
    if (isAuthenticated && user) {
      useProgressStore.getState().loadProgress(user.id)
    }
  }, [isAuthenticated, user])

  const recommendedCourses = courses.slice(0, 3)

  const learningModules = [
    {
      icon: BookOpen,
      title: '单词记忆',
      description: '闪卡式记忆，高效背单词',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      link: '/learn/vocabulary',
    },
    {
      icon: PenTool,
      title: '语法练习',
      description: '系统学习，专项突破',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      link: '/learn/grammar',
    },
    {
      icon: Mic,
      title: '口语跟读',
      description: '智能评分，地道发音',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      link: '/learn/speaking',
    },
    {
      icon: Headphones,
      title: '听力训练',
      description: '多场景听力，循序渐进',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      link: '/learn/listening',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl gradient-bg p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          {isAuthenticated ? (
            <>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3">
                欢迎回来，{user?.username}！ 👋
              </h1>
              <p className="text-primary-100 text-lg mb-6">
                继续保持学习热情，今天也要加油哦！
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3">
                开启你的语言学习之旅
              </h1>
              <p className="text-primary-100 text-lg mb-6">
                支持英语、日语、韩语等多语种学习
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                立即开始
                <ArrowRight size={18} />
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Stats Overview */}
      {isAuthenticated && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-blue-50 rounded-xl flex items-center justify-center">
              <Clock className="text-blue-500" size={24} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{todayMinutes}</div>
            <div className="text-sm text-gray-500">今日学习(分钟)</div>
          </Card>

          <Card className="p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-orange-50 rounded-xl flex items-center justify-center">
              <Flame className="text-orange-500" size={24} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{currentStreak}</div>
            <div className="text-sm text-gray-500">连续学习(天)</div>
          </Card>

          <Card className="p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-green-50 rounded-xl flex items-center justify-center">
              <Trophy className="text-green-500" size={24} />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.floor(totalMinutes / 60)}
            </div>
            <div className="text-sm text-gray-500">累计学习(小时)</div>
          </Card>

          <Card className="p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-purple-50 rounded-xl flex items-center justify-center">
              <Star className="text-purple-500" size={24} />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(vocabularyAccuracy)}%
            </div>
            <div className="text-sm text-gray-500">正确率</div>
          </Card>
        </section>
      )}

      {/* Learning Modules */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-bold text-gray-900">
            学习模块
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {learningModules.map((module) => {
            const Icon = module.icon
            return (
              <Link key={module.title} to={module.link}>
                <Card hover className="h-full p-6">
                  <div
                    className={`w-14 h-14 rounded-2xl ${module.bgColor} flex items-center justify-center mb-4`}
                  >
                    <Icon className={`text-transparent bg-gradient-to-br ${module.color} bg-clip-text`} size={28} />
                  </div>
                  <h3 className="font-heading font-semibold text-gray-900 mb-1">
                    {module.title}
                  </h3>
                  <p className="text-sm text-gray-500">{module.description}</p>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Recommended Courses */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-bold text-gray-900">
            推荐课程
          </h2>
          <Link
            to="/courses"
            className="text-primary-600 font-medium hover:underline flex items-center gap-1"
          >
            查看全部
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {recommendedCourses.map((course) => (
            <Link key={course.id} to={`/courses/${course.id}`}>
              <Card hover className="overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-primary-100 to-primary-200 relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 rounded-full text-xs font-medium text-primary-600">
                    {course.level === 'beginner' ? '初级' : course.level === 'intermediate' ? '中级' : '高级'}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-semibold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <BookOpen size={14} />
                      {course.totalLessons} 课时
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {formatTime(course.totalDuration)}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Weekly Progress Chart */}
      {isAuthenticated && (
        <section>
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">
            本周学习趋势
          </h2>
          <Card className="p-6">
            <div className="flex items-end justify-between h-40 gap-2">
              {weeklyProgress.map((minutes, index) => {
                const maxMinutes = Math.max(...weeklyProgress, 1)
                const height = minutes > 0 ? (minutes / maxMinutes) * 100 : 10
                const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
                const isToday = index === new Date().getDay()

                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex-1 flex items-end">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          isToday
                            ? 'bg-primary-500'
                            : minutes > 0
                            ? 'bg-primary-300'
                            : 'bg-gray-200'
                        }`}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <span className={`text-xs ${isToday ? 'text-primary-600 font-semibold' : 'text-gray-500'}`}>
                      {days[index]}
                    </span>
                  </div>
                )
              })}
            </div>
          </Card>
        </section>
      )}

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent-100 to-accent-200 rounded-2xl flex items-center justify-center">
            <Layers className="text-accent-600" size={32} />
          </div>
          <h3 className="font-heading font-semibold text-gray-900 mb-2">
            分级课程体系
          </h3>
          <p className="text-sm text-gray-500">
            从零基础到高级，循序渐进的科学学习路径
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-highlight-100 to-highlight-200 rounded-2xl flex items-center justify-center">
            <Trophy className="text-highlight-600" size={32} />
          </div>
          <h3 className="font-heading font-semibold text-gray-900 mb-2">
            成就激励系统
          </h3>
          <p className="text-sm text-gray-500">
            解锁成就徽章，获得学习动力和荣誉
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center">
            <Star className="text-primary-600" size={32} />
          </div>
          <h3 className="font-heading font-semibold text-gray-900 mb-2">
            个性化推荐
          </h3>
          <p className="text-sm text-gray-500">
            智能分析薄弱环节，定制专属学习计划
          </p>
        </Card>
      </section>
    </div>
  )
}
