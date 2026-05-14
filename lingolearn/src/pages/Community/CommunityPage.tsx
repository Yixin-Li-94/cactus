import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { samplePosts, Post } from '@/data/mockData'
import {
  Users,
  Heart,
  MessageCircle,
  Share2,
  Plus,
  Search,
  TrendingUp,
  Clock,
  Award,
  Filter,
} from 'lucide-react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { generateId } from '@/utils/helpers'

const popularTags = ['英语', '日语', '韩语', '学习方法', 'JLPT', 'TOPIK', '经验分享', '备考']

export default function CommunityPage() {
  const { user, isAuthenticated } = useAuthStore()
  const [posts, setPosts] = useState<Post[]>(samplePosts)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostTags, setNewPostTags] = useState<string[]>([])
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = !selectedTag || post.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const handleLike = (postId: string) => {
    if (!isAuthenticated) return

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: likedPosts.has(postId) ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    )

    setLikedPosts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  const handleCreatePost = () => {
    if (!user || !newPostTitle.trim() || !newPostContent.trim()) return

    const newPost: Post = {
      id: generateId(),
      userId: user.id,
      userName: user.username,
      userAvatar: user.avatar,
      title: newPostTitle,
      content: newPostContent,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      tags: newPostTags,
    }

    setPosts([newPost, ...posts])
    setNewPostTitle('')
    setNewPostContent('')
    setNewPostTags([])
    setShowNewPost(false)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return '刚刚'
    if (diffHours < 24) return `${diffHours}小时前`
    if (diffDays < 7) return `${diffDays}天前`
    return date.toLocaleDateString('zh-CN')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
            学习社区
          </h1>
          <p className="text-gray-600">
            与学习伙伴交流，分享学习心得
          </p>
        </div>
        {isAuthenticated && (
          <Button onClick={() => setShowNewPost(true)}>
            <Plus size={18} className="mr-2" />
            发布帖子
          </Button>
        )}
      </div>

      {/* New Post Modal */}
      {showNewPost && (
        <Card className="p-6 border-2 border-primary-200">
          <h3 className="font-heading font-semibold text-lg text-gray-900 mb-4">
            发布新帖子
          </h3>

          <div className="space-y-4">
            <Input
              placeholder="帖子标题"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
            />

            <textarea
              placeholder="分享你的学习心得、经验或问题..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[120px]"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                添加标签
              </label>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() =>
                      setNewPostTags((prev) =>
                        prev.includes(tag)
                          ? prev.filter((t) => t !== tag)
                          : [...prev, tag]
                      )
                    }
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      newPostTags.includes(tag)
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowNewPost(false)}>
                取消
              </Button>
              <Button onClick={handleCreatePost} disabled={!newPostTitle.trim() || !newPostContent.trim()}>
                发布
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="搜索帖子..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                !selectedTag
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              全部
            </button>
            {popularTags.slice(0, 6).map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedTag === tag
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
          <div className="text-sm text-gray-500">帖子总数</div>
        </Card>
        <Card className="p-4 text-center">
          <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
          <div className="text-2xl font-bold text-gray-900">
            {posts.reduce((sum, p) => sum + p.likes, 0)}
          </div>
          <div className="text-sm text-gray-500">获赞总数</div>
        </Card>
        <Card className="p-4 text-center">
          <MessageCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <div className="text-2xl font-bold text-gray-900">
            {posts.reduce((sum, p) => sum + p.comments, 0)}
          </div>
          <div className="text-sm text-gray-500">评论总数</div>
        </Card>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex gap-4">
              <img
                src={post.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.userName}`}
                alt={post.userName}
                className="w-12 h-12 rounded-full flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="font-heading font-semibold text-lg text-gray-900 mb-1">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{post.userName}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.content}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-6 text-gray-500">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 transition-colors ${
                      likedPosts.has(post.id)
                        ? 'text-red-500'
                        : 'hover:text-red-500'
                    }`}
                  >
                    <Heart
                      size={18}
                      fill={likedPosts.has(post.id) ? 'currentColor' : 'none'}
                    />
                    <span>{post.likes}</span>
                  </button>

                  <button className="flex items-center gap-2 hover:text-primary-500 transition-colors">
                    <MessageCircle size={18} />
                    <span>{post.comments}</span>
                  </button>

                  <button className="flex items-center gap-2 hover:text-primary-500 transition-colors">
                    <Share2 size={18} />
                    <span>分享</span>
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {filteredPosts.length === 0 && (
          <Card className="p-12 text-center">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              未找到相关帖子
            </h3>
            <p className="text-gray-500">
              尝试调整搜索条件或标签筛选
            </p>
          </Card>
        )}
      </div>

      {/* Quick Links */}
      {!isAuthenticated && (
        <Card className="p-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-semibold text-xl mb-2">
                加入社区
              </h3>
              <p className="text-primary-100">
                登录后可以发帖、点赞和评论
              </p>
            </div>
            <Link to="/login">
              <Button variant="secondary" className="bg-white text-primary-600 hover:bg-primary-50">
                立即登录
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  )
}
