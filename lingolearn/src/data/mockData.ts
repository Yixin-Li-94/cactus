export interface Course {
  id: string
  language: 'en' | 'ja' | 'ko'
  level: 'beginner' | 'intermediate' | 'advanced'
  title: string
  description: string
  image: string
  totalLessons: number
  totalDuration: number
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  order: number
  type: 'vocabulary' | 'grammar' | 'speaking' | 'listening'
  content: LessonContent
}

export interface LessonContent {
  items: LearningItem[]
}

export interface LearningItem {
  id: string
  question: string
  options?: string[]
  correctAnswer: string | string[]
  hint?: string
  audio?: string
}

export interface User {
  id: string
  email: string
  username: string
  avatar: string
  level: number
  experience: number
  joinDate: string
}

export interface UserProgress {
  id: string
  odId: string
  lessonId: string
  completed: boolean
  score: number
  timeSpent: number
  lastStudied: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  requirement: number
  type: string
  unlocked: boolean
  unlockedAt?: string
}

export interface Post {
  id: string
  userId: string
  userName: string
  userAvatar: string
  title: string
  content: string
  likes: number
  comments: number
  createdAt: string
  tags: string[]
}

export interface StudyRecord {
  id: string
  userId: string
  date: string
  minutesStudied: number
  exercisesCompleted: number
  accuracy: number
}

export const courses: Course[] = [
  {
    id: 'en-beginner',
    language: 'en',
    level: 'beginner',
    title: '英语零基础入门',
    description: '从字母和发音开始，系统学习英语基础词汇和简单句型',
    image: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=800',
    totalLessons: 20,
    totalDuration: 600,
  },
  {
    id: 'en-intermediate',
    language: 'en',
    level: 'intermediate',
    title: '英语中级提升',
    description: '掌握日常会话，拓展词汇量，提升阅读和写作能力',
    image: 'https://images.unsplash.com/photo-143ChI4c-QDQ?w=800',
    totalLessons: 30,
    totalDuration: 900,
  },
  {
    id: 'en-advanced',
    language: 'en',
    level: 'advanced',
    title: '英语高级进阶',
    description: '深入语法结构，培养地道表达，轻松应对各种场景',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
    totalLessons: 40,
    totalDuration: 1200,
  },
  {
    id: 'ja-beginner',
    language: 'ja',
    level: 'beginner',
    title: '日语五十音入门',
    description: '学习日语假名发音和书写，掌握基础问候语',
    image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800',
    totalLessons: 15,
    totalDuration: 450,
  },
  {
    id: 'ja-intermediate',
    language: 'ja',
    level: 'intermediate',
    title: '日语能力考N4',
    description: '系统学习N4级别语法和词汇，为日语能力考做准备',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
    totalLessons: 25,
    totalDuration: 750,
  },
  {
    id: 'ja-advanced',
    language: 'ja',
    level: 'advanced',
    title: '日语能力考N2',
    description: '深入学习N2级别知识，阅读长篇文章，提升综合能力',
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800',
    totalLessons: 35,
    totalDuration: 1050,
  },
  {
    id: 'ko-beginner',
    language: 'ko',
    level: 'beginner',
    title: '韩语发音入门',
    description: '学习韩文字母发音规则，掌握基础会话表达',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    totalLessons: 12,
    totalDuration: 360,
  },
  {
    id: 'ko-intermediate',
    language: 'ko',
    level: 'intermediate',
    title: '韩语TOPIK II 备考',
    description: '系统学习TOPIK中级内容，为韩语水平考试做准备',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
    totalLessons: 28,
    totalDuration: 840,
  },
  {
    id: 'ko-advanced',
    language: 'ko',
    level: 'advanced',
    title: '韩语TOPIK I 冲刺',
    description: '高级语法和词汇学习，培养native水平的表达能力',
    image: 'https://images.unsplash.com/photo-1609146127260-4e3c9c2a7f77?w=800',
    totalLessons: 32,
    totalDuration: 960,
  },
]

export const vocabularyLessons: Record<string, LearningItem[]> = {
  'en-beginner': [
    { id: 'v1', question: 'Apple', options: ['苹果', '香蕉', '橙子', '葡萄'], correctAnswer: '苹果', hint: '一种红色的水果' },
    { id: 'v2', question: 'Book', options: ['书本', '桌子', '椅子', '窗户'], correctAnswer: '书本', hint: '用来阅读的东西' },
    { id: 'v3', question: 'Cat', options: ['狗', '猫', '鸟', '鱼'], correctAnswer: '猫', hint: '一种常见的宠物' },
    { id: 'v4', question: 'Dog', options: ['狗', '猫', '老鼠', '兔子'], correctAnswer: '狗', hint: '人类最忠实的朋友' },
    { id: 'v5', question: 'Water', options: ['空气', '土地', '水', '火'], correctAnswer: '水', hint: '生命之源' },
    { id: 'v6', question: 'Sun', options: ['月亮', '太阳', '星星', '云'], correctAnswer: '太阳', hint: '给予我们光和热' },
    { id: 'v7', question: 'Moon', options: ['月亮', '太阳', '地球', '火星'], correctAnswer: '月亮', hint: '夜晚天空中常见' },
    { id: 'v8', question: 'Tree', options: ['花', '草', '树', '果实'], correctAnswer: '树', hint: '有树干和树叶' },
    { id: 'v9', question: 'Flower', options: ['花', '叶子', '根', '茎'], correctAnswer: '花', hint: '美丽的植物部分' },
    { id: 'v10', question: 'House', options: ['学校', '医院', '房子', '商店'], correctAnswer: '房子', hint: '人们居住的地方' },
  ],
  'ja-beginner': [
    { id: 'jv1', question: '猫（ねこ）', options: ['狗', '猫', '鸟', '鱼'], correctAnswer: '猫', hint: '一种受欢迎的宠物' },
    { id: 'jv2', question: '犬（いぬ）', options: ['狗', '猫', '老鼠', '兔子'], correctAnswer: '狗', hint: '忠诚的动物' },
    { id: 'jv3', question: '水（みず）', options: ['空气', '土地', '水', '火'], correctAnswer: '水', hint: '无色无味的液体' },
    { id: 'jv4', question: '花（はな）', options: ['花', '叶子', '根', '茎'], correctAnswer: '花', hint: '美丽的植物' },
    { id: 'jv5', question: '山（やま）', options: ['河', '海', '山', '湖'], correctAnswer: '山', hint: '高耸的地形' },
    { id: 'jv6', question: '川（かわ）', options: ['河', '海', '山', '湖'], correctAnswer: '河', hint: '流动的水道' },
    { id: 'jv7', question: '空（そら）', options: ['地上', '天空', '地下', '海底'], correctAnswer: '天空', hint: '鸟儿飞翔的地方' },
    { id: 'jv8', question: '木（き）', options: ['花', '草', '树', '果实'], correctAnswer: '树', hint: '有年轮的东西' },
  ],
  'ko-beginner': [
    { id: 'kv1', question: '고양이', options: ['狗', '猫', '鸟', '鱼'], correctAnswer: '猫', hint: '韩语"猫"的写法' },
    { id: 'kv2', question: '강아지', options: ['狗', '猫', '老鼠', '兔子'], correctAnswer: '狗', hint: '韩语"狗"的写法' },
    { id: 'kv3', question: '물', options: ['空气', '土地', '水', '火'], correctAnswer: '水', hint: '韩语"水"的写法' },
    { id: 'kv4', question: '나무', options: ['花', '草', '树', '果实'], correctAnswer: '树', hint: '韩语"树"的写法' },
    { id: 'kv5', question: '하늘', options: ['地上', '天空', '地下', '海底'], correctAnswer: '天空', hint: '韩语"天空"的写法' },
    { id: 'kv6', question: '달', options: ['月亮', '太阳', '地球', '火星'], correctAnswer: '月亮', hint: '韩语"月亮"的写法' },
  ],
}

export const grammarLessons: Record<string, LearningItem[]> = {
  'en-beginner': [
    {
      id: 'g1',
      question: '___ is a student.',
      options: ['I', 'Me', 'My', 'Mine'],
      correctAnswer: 'I',
      hint: '主格形式',
    },
    {
      id: 'g2',
      question: 'She ___ to school every day.',
      options: ['go', 'goes', 'going', 'went'],
      correctAnswer: 'goes',
      hint: '第三人称单数动词变化',
    },
    {
      id: 'g3',
      question: 'I ___ apples.',
      options: ['like', 'likes', 'liking', 'liked'],
      correctAnswer: 'like',
      hint: '第一人称一般现在时',
    },
    {
      id: 'g4',
      question: 'This is ___ book.',
      options: ['a', 'an', 'the', 'some'],
      correctAnswer: 'a',
      hint: '以辅音音素开头',
    },
    {
      id: 'g5',
      question: '___ you like coffee?',
      options: ['Does', 'Do', 'Is', 'Are'],
      correctAnswer: 'Do',
      hint: '一般疑问句',
    },
    {
      id: 'g6',
      question: 'The cat is ___ the table.',
      options: ['in', 'on', 'at', 'to'],
      correctAnswer: 'on',
      hint: '在...上面',
    },
    {
      id: 'g7',
      question: 'I have ___ friends.',
      options: ['a', 'an', 'many', 'much'],
      correctAnswer: 'many',
      hint: '可数名词复数',
    },
    {
      id: 'g8',
      question: '___ are you from?',
      options: ['What', 'Where', 'Who', 'Which'],
      correctAnswer: 'Where',
      hint: '询问地点',
    },
    {
      id: 'g9',
      question: 'It is ___ day today.',
      options: ['a', 'an', 'the', '-'],
      correctAnswer: 'a',
      hint: '元音音素开头的词前',
    },
    {
      id: 'g10',
      question: 'They ___ playing football.',
      options: ['is', 'am', 'are', 'be'],
      correctAnswer: 'are',
      hint: '复数主语be动词',
    },
  ],
}

export const listeningLessons: Record<string, LearningItem[]> = {
  'en-beginner': [
    {
      id: 'l1',
      question: '听对话：What color is the apple?',
      options: ['Red', 'Green', 'Yellow', 'Blue'],
      correctAnswer: 'Red',
      hint: '描述苹果的颜色',
    },
    {
      id: 'l2',
      question: '听对话：How many books are there?',
      options: ['One', 'Two', 'Three', 'Four'],
      correctAnswer: 'Three',
      hint: '描述数量',
    },
    {
      id: 'l3',
      question: '听对话：Where is the cat?',
      options: ['In the box', 'On the table', 'Under the bed', 'Behind the door'],
      correctAnswer: 'On the table',
      hint: '描述位置',
    },
    {
      id: 'l4',
      question: '听对话：What time is it?',
      options: ['7 o\'clock', '8 o\'clock', '9 o\'clock', '10 o\'clock'],
      correctAnswer: '8 o\'clock',
      hint: '描述时间',
    },
    {
      id: 'l5',
      question: '听对话：Who is she?',
      options: ['A teacher', 'A doctor', 'A student', 'A nurse'],
      correctAnswer: 'A teacher',
      hint: '询问职业',
    },
    {
      id: 'l6',
      question: '听对话：What is the weather like?',
      options: ['Sunny', 'Rainy', 'Cloudy', 'Snowy'],
      correctAnswer: 'Sunny',
      hint: '描述天气',
    },
  ],
}

export const speakingLessons: Record<string, LearningItem[]> = {
  'en-beginner': [
    {
      id: 's1',
      question: '跟读：Hello, how are you?',
      options: [],
      correctAnswer: 'Hello, how are you?',
      hint: '打招呼常用语',
    },
    {
      id: 's2',
      question: '跟读：Nice to meet you.',
      options: [],
      correctAnswer: 'Nice to meet you.',
      hint: '初次见面用语',
    },
    {
      id: 's3',
      question: '跟读：My name is...',
      options: [],
      correctAnswer: 'My name is...',
      hint: '自我介绍',
    },
    {
      id: 's4',
      question: '跟读：Thank you very much.',
      options: [],
      correctAnswer: 'Thank you very much.',
      hint: '表示感谢',
    },
    {
      id: 's5',
      question: '跟读：You are welcome.',
      options: [],
      correctAnswer: 'You are welcome.',
      hint: '回应感谢',
    },
  ],
}

export const achievements: Achievement[] = [
  {
    id: 'first-lesson',
    name: '初学者',
    description: '完成第一节课程',
    icon: '🎯',
    requirement: 1,
    type: 'lesson',
    unlocked: false,
  },
  {
    id: 'week-streak',
    name: '七日坚持',
    description: '连续学习7天',
    icon: '🔥',
    requirement: 7,
    type: 'streak',
    unlocked: false,
  },
  {
    id: 'month-streak',
    name: '月度达人',
    description: '连续学习30天',
    icon: '⭐',
    requirement: 30,
    type: 'streak',
    unlocked: false,
  },
  {
    id: 'vocabulary-master',
    name: '词汇大师',
    description: '完成100个单词学习',
    icon: '📚',
    requirement: 100,
    type: 'vocabulary',
    unlocked: false,
  },
  {
    id: 'grammar-expert',
    name: '语法专家',
    description: '语法正确率达到90%',
    icon: '✍️',
    requirement: 90,
    type: 'grammar',
    unlocked: false,
  },
  {
    id: 'speaking-pro',
    name: '口语达人',
    description: '完成50次口语练习',
    icon: '🎤',
    requirement: 50,
    type: 'speaking',
    unlocked: false,
  },
  {
    id: 'listening-pro',
    name: '听力满分',
    description: '听力正确率达到100%',
    icon: '🎧',
    requirement: 100,
    type: 'listening',
    unlocked: false,
  },
  {
    id: 'polyglot',
    name: '多语言达人',
    description: '学习三种不同语言',
    icon: '🌍',
    requirement: 3,
    type: 'language',
    unlocked: false,
  },
  {
    id: 'study-hours',
    name: '学习时长',
    description: '累计学习100小时',
    icon: '⏰',
    requirement: 100,
    type: 'hours',
    unlocked: false,
  },
  {
    id: 'perfect-day',
    name: '完美一天',
    description: '一天内完成所有学习模块',
    icon: '🏆',
    requirement: 1,
    type: 'perfect',
    unlocked: false,
  },
]

export const samplePosts: Post[] = [
  {
    id: 'p1',
    userId: 'user1',
    userName: '英语爱好者',
    userAvatar: '',
    title: '分享我的英语学习心得',
    content: '学习英语最重要的是坚持每天练习，不要害怕犯错。我每天会用Lingolearn练习30分钟，已经坚持了3个月，效果很明显！',
    likes: 128,
    comments: 45,
    createdAt: '2024-01-15T10:30:00Z',
    tags: ['英语', '学习方法', '经验分享'],
  },
  {
    id: 'p2',
    userId: 'user2',
    userName: '日语学习者',
    userAvatar: '',
    title: 'N2考试备考经验总结',
    content: '备考N2需要系统性地学习语法和词汇。我建议每天背50个单词，做一套阅读理解，听力练习也不能少。坚持就是胜利！',
    likes: 256,
    comments: 89,
    createdAt: '2024-01-14T15:20:00Z',
    tags: ['日语', 'JLPT', 'N2备考'],
  },
  {
    id: 'p3',
    userId: 'user3',
    userName: '韩语小白',
    userAvatar: '',
    title: '韩语入门：发音真的很重要',
    content: '刚开始学习韩语觉得发音好难，后来发现只要多听多模仿，就能慢慢掌握。建议大家先从基础发音开始，不要急于求成。',
    likes: 89,
    comments: 32,
    createdAt: '2024-01-13T09:15:00Z',
    tags: ['韩语', '发音', '入门'],
  },
  {
    id: 'p4',
    userId: 'user4',
    userName: '学习达人',
    userAvatar: '',
    title: '如何保持学习动力？',
    content: '给自己设定小目标，完成后给予奖励。可以加入学习社区，和大家一起打卡互相监督。Lingolearn的成就系统真的很棒！',
    likes: 312,
    comments: 67,
    createdAt: '2024-01-12T18:45:00Z',
    tags: ['学习方法', '动力', '社区'],
  },
]
