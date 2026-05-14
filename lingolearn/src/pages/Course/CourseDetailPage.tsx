import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { courses, vocabularyLessons, grammarLessons, speakingLessons, listeningLessons } from '@/data/mockData'
import { getLanguageFlag, getLevelName, formatTime } from '@/utils/helpers'
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Users,
  CheckCircle,
  PlayCircle,
  Mic,
  Headphones,
  PenTool,
  BookMarked,
} from 'lucide-react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'

export default function CourseDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'reviews'>('overview')

  const course = courses.find((c) => c.id === id)

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">课程未找到</h2>
        <Button onClick={() => navigate('/courses')}>返回课程列表</Button>
      </div>
    )
  }

  const moduleLessons = [
    {
      type: 'vocabulary',
      title: '单词记忆',
      icon: BookMarked,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      lessons: vocabularyLessons[id || '']?.length || 0,
      description: '使用闪卡系统高效记忆单词',
    },
    {
      type: 'grammar',
      title: '语法练习',
      icon: PenTool,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      lessons: grammarLessons[id || '']?.length || 0,
      description: '系统学习语法规则和用法',
    },
    {
      type: 'speaking',
      title: '口语跟读',
      icon: Mic,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      lessons: speakingLessons[id || '']?.length || 0,
      description: '跟读练习提升发音和口语',
    },
    {
      type: 'listening',
      title: '听力训练',
      icon: Headphones,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      lessons: listeningLessons[id || '']?.length || 0,
      description: '多场景听力训练提升理解力',
    },
  ]

  const reviews = [
    {
      user: '学习达人',
      avatar: '',
      rating: 5,
      content: '课程内容很系统，从基础到进阶循序渐进。老师讲解清晰，学习效果很好！',
      date: '2024-01-10',
    },
    {
      user: '英语爱好者',
      avatar: '',
      rating: 5,
      content: '终于找到了适合自己的英语课程。每天坚持学习30分钟，已经坚持两个月了！',
      date: '2024-01-08',
    },
    {
      user: '备考学生',
      avatar: '',
      rating: 4,
      content: '为考试做准备用的这个课程，知识点覆盖很全面，推荐！',
      date: '2024-01-05',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/courses')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={20} />
        返回课程列表
      </button>

      {/* Course Header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-64 md:h-80 bg-gradient-to-br from-primary-100 to-primary-200 relative">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1 bg-white/90 rounded-full text-sm font-medium">
                {getLanguageFlag(course.language)} {course.language === 'en' ? '英语' : course.language === 'ja' ? '日语' : '韩语'}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                course.level === 'beginner' ? 'bg-green-100 text-green-700' :
                course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {getLevelName(course.level)}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-heading font-bold text-white mb-2">
              {course.title}
            </h1>
            <p className="text-white/90 text-lg max-w-2xl">
              {course.description}
            </p>
          </div>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-3 gap-4 p-6 bg-white border-b border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
              <BookOpen size={18} />
              <span className="font-semibold">{course.totalLessons}</span>
            </div>
            <div className="text-sm text-gray-500">总课时</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
              <Clock size={18} />
              <span className="font-semibold">{formatTime(course.totalDuration)}</span>
            </div>
            <div className="text-sm text-gray-500">总时长</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
              <Users size={18} />
              <span className="font-semibold">1.2k</span>
            </div>
            <div className="text-sm text-gray-500">学习人数</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {(['overview', 'lessons', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === tab
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'overview' ? '课程概述' : tab === 'lessons' ? '课程章节' : '学员评价'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-heading font-semibold text-lg text-gray-900 mb-3">
                  学习目标
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-accent-500 mt-0.5 flex-shrink-0" size={18} />
                    <span className="text-gray-600">
                      掌握{course.language === 'en' ? '英语' : course.language === 'ja' ? '日语' : '韩语'}{getLevelName(course.level)}水平的核心词汇和表达
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-accent-500 mt-0.5 flex-shrink-0" size={18} />
                    <span className="text-gray-600">
                      建立系统的语言知识体系，提升综合运用能力
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-accent-500 mt-0.5 flex-shrink-0" size={18} />
                    <span className="text-gray-600">
                      能够进行日常会话和简单阅读
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-heading font-semibold text-lg text-gray-900 mb-3">
                  学习模块
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {moduleLessons.map((module) => {
                    const Icon = module.icon
                    return (
                      <Card key={module.type} className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg ${module.bgColor} flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`text-transparent bg-gradient-to-br ${module.color} bg-clip-text`} size={20} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{module.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">{module.description}</p>
                            <div className="text-xs text-gray-400 mt-2">{module.lessons} 个练习</div>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lessons' && (
            <div className="space-y-4">
              {moduleLessons.map((module, index) => {
                const Icon = module.icon
                return (
                  <div
                    key={module.type}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/learn/${module.type}?course=${course.id}`)}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{module.title}</h4>
                      <p className="text-sm text-gray-500">{module.description}</p>
                    </div>
                    <div className="text-sm text-gray-400">{module.lessons} 练习</div>
                    <PlayCircle className="text-gray-400" size={24} />
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl font-bold text-gray-900">4.8</div>
                <div>
                  <div className="flex gap-1 text-yellow-400 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">基于 328 条评价</div>
                </div>
              </div>

              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={review.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.user}`}
                        alt={review.user}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-gray-900">{review.user}</span>
                          <span className="text-sm text-gray-400">{review.date}</span>
                        </div>
                        <div className="flex gap-0.5 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-gray-600">{review.content}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Start Learning Button */}
      <div className="sticky bottom-6 bg-white rounded-xl shadow-lg p-4 flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">开始学习</div>
          <div className="font-heading font-bold text-xl text-gray-900">
            {course.title}
          </div>
        </div>
        <Button
          size="lg"
          onClick={() => navigate(`/learn/vocabulary?course=${course.id}`)}
        >
          <PlayCircle className="mr-2" size={20} />
          开始学习
        </Button>
      </div>
    </div>
  )
}
