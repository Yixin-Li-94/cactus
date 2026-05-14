import { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useProgressStore } from '@/stores/progressStore'
import { vocabularyLessons, grammarLessons, speakingLessons, listeningLessons, LearningItem } from '@/data/mockData'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Volume2,
  Mic,
  RotateCcw,
  Trophy,
  Flame,
  Zap,
} from 'lucide-react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'

export default function LearningPage() {
  const { module } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const courseId = searchParams.get('course') || 'en-beginner'
  const { isAuthenticated } = useAuthStore()
  const { addStudyTime, updateAccuracy, incrementSpeaking, vocabularyAccuracy, grammarAccuracy, speakingCount } = useProgressStore()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showReward, setShowReward] = useState(false)
  const [lessonItems, setLessonItems] = useState<LearningItem[]>([])
  const [speakingText, setSpeakingText] = useState('')
  const [isRecording, setIsRecording] = useState(false)

  useEffect(() => {
    let items: LearningItem[] = []
    switch (module) {
      case 'vocabulary':
        items = vocabularyLessons[courseId] || vocabularyLessons['en-beginner']
        break
      case 'grammar':
        items = grammarLessons[courseId] || grammarLessons['en-beginner']
        break
      case 'speaking':
        items = speakingLessons[courseId] || speakingLessons['en-beginner']
        break
      case 'listening':
        items = listeningLessons[courseId] || listeningLessons['en-beginner']
        break
      default:
        items = vocabularyLessons['en-beginner']
    }
    setLessonItems(items)
  }, [module, courseId])

  const currentItem = lessonItems[currentIndex]
  const progress = lessonItems.length > 0 ? ((currentIndex + 1) / lessonItems.length) * 100 : 0
  const isSpeaking = module === 'speaking'
  const isLastQuestion = currentIndex === lessonItems.length - 1

  const handleSelectAnswer = (answer: string) => {
    if (isAnswered) return

    setSelectedAnswer(answer)
    setIsAnswered(true)

    const correct = Array.isArray(currentItem.correctAnswer)
      ? currentItem.correctAnswer.includes(answer)
      : answer === currentItem.correctAnswer

    setIsCorrect(correct)

    if (correct) {
      setScore((prev) => prev + 10)
      setStreak((prev) => prev + 1)
      if (streak + 1 >= 3) {
        setShowReward(true)
        setTimeout(() => setShowReward(false), 1500)
      }
    } else {
      setStreak(0)
    }

    setTimeout(() => {
      addStudyTime(0.5)
      if (module === 'vocabulary') {
        updateAccuracy('vocabulary', correct ? 100 : 0)
      } else if (module === 'grammar') {
        updateAccuracy('grammar', correct ? 100 : 0)
      } else if (module === 'listening') {
        updateAccuracy('listening', correct ? 100 : 0)
      }

      if (isLastQuestion) {
        handleFinish()
      }
    }, 1000)
  }

  const handleSpeakingSubmit = () => {
    if (speakingText.trim()) {
      incrementSpeaking()
      addStudyTime(1)
      setScore((prev) => prev + 15)
      setSpeakingText('')

      if (isLastQuestion) {
        handleFinish()
      }
    }
  }

  const handleNext = () => {
    if (currentIndex < lessonItems.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
      setIsCorrect(false)
    }
  }

  const handleFinish = () => {
    navigate('/progress')
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setIsCorrect(false)
    setScore(0)
    setStreak(0)
  }

  const getModuleTitle = () => {
    switch (module) {
      case 'vocabulary':
        return '单词记忆'
      case 'grammar':
        return '语法练习'
      case 'speaking':
        return '口语跟读'
      case 'listening':
        return '听力训练'
      default:
        return '学习'
    }
  }

  const getModuleColor = () => {
    switch (module) {
      case 'vocabulary':
        return 'from-blue-500 to-blue-600'
      case 'grammar':
        return 'from-purple-500 to-purple-600'
      case 'speaking':
        return 'from-pink-500 to-pink-600'
      case 'listening':
        return 'from-orange-500 to-orange-600'
      default:
        return 'from-primary-500 to-primary-600'
    }
  }

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = courseId.startsWith('ja') ? 'ja-JP' : courseId.startsWith('ko') ? 'ko-KR' : 'en-US'
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }, [courseId])

  useEffect(() => {
    if (isSpeaking && currentItem?.question) {
      speak(currentItem.question)
    }
  }, [isSpeaking, currentItem, speak])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">
            请先登录
          </h2>
          <p className="text-gray-600 mb-6">
            登录后即可开始学习
          </p>
          <Button onClick={() => navigate('/login')}>去登录</Button>
        </Card>
      </div>
    )
  }

  if (!currentItem) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 -mx-4 -my-8 px-4 py-8 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          返回
        </button>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-heading font-bold text-gray-900">
            {getModuleTitle()}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-orange-500">
              <Flame size={20} />
              <span className="font-bold">{streak}</span>
            </div>
            <div className="flex items-center gap-1 text-primary-600">
              <Zap size={20} />
              <span className="font-bold">{score}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getModuleColor()} rounded-full transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>进度 {currentIndex + 1}/{lessonItems.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Reward Animation */}
      {showReward && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="animate-bounce-in bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <Trophy size={32} />
            <span className="font-heading font-bold text-xl">连续答对奖励 +5！</span>
          </div>
        </div>
      )}

      {/* Question Card */}
      <div className="max-w-3xl mx-auto">
        <Card className={`p-8 mb-6 ${isAnswered ? (isCorrect ? 'ring-4 ring-green-200' : 'ring-4 ring-red-200') : ''}`}>
          {/* Speaking Module with Audio */}
          {isSpeaking ? (
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center">
                <Volume2 className="text-pink-500" size={48} />
              </div>
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-2">
                {currentItem.question}
              </h2>
              <p className="text-gray-500 mb-6">点击播放图标收听并跟读</p>

              <div className="flex justify-center gap-4 mb-6">
                <button
                  onClick={() => speak(currentItem.question)}
                  className="p-4 bg-primary-100 text-primary-600 rounded-full hover:bg-primary-200 transition-colors"
                >
                  <Volume2 size={24} />
                </button>
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`p-4 rounded-full transition-colors ${
                    isRecording
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Mic size={24} />
                </button>
              </div>

              {isRecording && (
                <div className="mb-6">
                  <textarea
                    value={speakingText}
                    onChange={(e) => setSpeakingText(e.target.value)}
                    placeholder="输入你说出的内容..."
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={2}
                  />
                  <Button className="mt-3" onClick={handleSpeakingSubmit}>
                    提交
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Question */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center">
                  {module === 'vocabulary' && <span className="text-3xl font-bold text-primary-600">A</span>}
                  {module === 'grammar' && <span className="text-3xl font-bold text-purple-600">G</span>}
                  {module === 'listening' && <span className="text-3xl font-bold text-orange-600">L</span>}
                </div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-2">
                  {currentItem.question}
                </h2>
                {currentItem.hint && (
                  <p className="text-gray-500">{currentItem.hint}</p>
                )}
              </div>

              {/* Options */}
              {currentItem.options && currentItem.options.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {currentItem.options.map((option, index) => {
                    const isSelected = selectedAnswer === option
                    const isCorrectOption = option === currentItem.correctAnswer
                    let bgColor = 'bg-white hover:bg-gray-50 border-gray-200'

                    if (isAnswered) {
                      if (isCorrectOption) {
                        bgColor = 'bg-green-50 border-green-500'
                      } else if (isSelected && !isCorrect) {
                        bgColor = 'bg-red-50 border-red-500'
                      } else {
                        bgColor = 'bg-gray-50 border-gray-200 opacity-50'
                      }
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleSelectAnswer(option)}
                        disabled={isAnswered}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${bgColor} ${
                          !isAnswered ? 'hover:scale-105 cursor-pointer' : 'cursor-default'
                        }`}
                      >
                        <span className="text-gray-600">{option}</span>
                        {isAnswered && isCorrectOption && (
                          <CheckCircle className="inline ml-2 text-green-500" size={18} />
                        )}
                        {isAnswered && isSelected && !isCorrect && (
                          <XCircle className="inline ml-2 text-red-500" size={18} />
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Feedback */}
              {isAnswered && (
                <div className={`mt-6 p-4 rounded-xl ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="text-green-500" size={24} />
                        <span className="font-semibold text-green-700">回答正确！</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="text-red-500" size={24} />
                        <span className="font-semibold text-red-700">回答错误</span>
                      </>
                    )}
                  </div>
                  {!isCorrect && (
                    <p className="text-gray-600">
                      正确答案：{currentItem.correctAnswer}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="secondary"
            onClick={handleRestart}
            className="flex items-center gap-2"
          >
            <RotateCcw size={18} />
            重新开始
          </Button>

          {!isSpeaking && !isAnswered && (
            <Button
              variant="ghost"
              onClick={handleNext}
              disabled={currentIndex === 0}
            >
              跳过
              <ArrowRight size={18} />
            </Button>
          )}

          {isAnswered && !isSpeaking && !isLastQuestion && (
            <Button onClick={handleNext} className="flex items-center gap-2">
              下一题
              <ArrowRight size={18} />
            </Button>
          )}

          {isLastQuestion && isAnswered && (
            <Button onClick={handleFinish} className="flex items-center gap-2">
              完成学习
              <Trophy size={18} />
            </Button>
          )}
        </div>

        {/* Stats */}
        <Card className="mt-6 p-6">
          <h3 className="font-heading font-semibold text-gray-900 mb-4">当前统计</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{score}</div>
              <div className="text-sm text-gray-500">得分</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{streak}</div>
              <div className="text-sm text-gray-500">连续正确</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{Math.round(vocabularyAccuracy)}%</div>
              <div className="text-sm text-gray-500">单词正确率</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{Math.round(grammarAccuracy)}%</div>
              <div className="text-sm text-gray-500">语法正确率</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
