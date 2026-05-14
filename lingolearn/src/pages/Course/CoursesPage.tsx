import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { courses, Course } from '@/data/mockData'
import { getLanguageFlag, getLevelName, formatTime } from '@/utils/helpers'
import {
  Search,
  Filter,
  BookOpen,
  Clock,
  ChevronDown,
} from 'lucide-react'
import Card from '@/components/common/Card'

const languages = [
  { value: 'all', label: '全部语言' },
  { value: 'en', label: '英语' },
  { value: 'ja', label: '日语' },
  { value: 'ko', label: '韩语' },
]

const levels = [
  { value: 'all', label: '全部级别' },
  { value: 'beginner', label: '初级' },
  { value: 'intermediate', label: '中级' },
  { value: 'advanced', label: '高级' },
]

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    let result = courses

    if (searchTerm) {
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedLanguage !== 'all') {
      result = result.filter((course) => course.language === selectedLanguage)
    }

    if (selectedLevel !== 'all') {
      result = result.filter((course) => course.level === selectedLevel)
    }

    setFilteredCourses(result)
  }, [searchTerm, selectedLanguage, selectedLevel])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
          课程中心
        </h1>
        <p className="text-gray-600">
          浏览并选择适合你的语言课程
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="搜索课程..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 md:hidden"
          >
            <Filter size={20} />
            筛选
            <ChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} size={16} />
          </button>

          <div className={`flex gap-4 ${showFilters ? 'flex' : 'hidden md:flex'}`}>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {levels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-gray-600">
        找到 {filteredCourses.length} 个课程
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Link key={course.id} to={`/courses/${course.id}`}>
              <Card hover className="overflow-hidden h-full">
                <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 rounded-full text-sm font-medium">
                      {getLanguageFlag(course.language)} {getLanguageName(course.language)}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      course.level === 'beginner' ? 'bg-green-100 text-green-700' :
                      course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {getLevelName(course.level)}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <span className="flex items-center gap-1">
                      <BookOpen size={16} />
                      {course.totalLessons} 课时
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {formatTime(course.totalDuration)}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="text-gray-400" size={40} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            未找到匹配的课程
          </h3>
          <p className="text-gray-500">
            尝试调整筛选条件或搜索关键词
          </p>
        </div>
      )}
    </div>
  )
}

function getLanguageName(lang: string): string {
  const names: Record<string, string> = {
    en: '英语',
    ja: '日语',
    ko: '韩语',
  }
  return names[lang] || lang
}
