import React from "react"
import {useState, useEffect} from "react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../components/ui/card"
import {Button} from "../components/ui/button"
import {Input} from "../components/ui/input"
import {Textarea} from "../components/ui/textarea"
import {Label} from "../components/ui/label"
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "../components/ui/sheet"
import {PlusCircle, BookOpen, User, Calendar, Plus} from "lucide-react"
import {toast} from "sonner"
import axios from "axios";

interface Blog {
    _id: string
    title: string
    content: string
    author: string
    createdAt: string
    updatedAt: string
}

export default function BlogHomeScreen() {
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        author: "",
    })
    const [updated, setUpdated] = useState(0)

    useEffect(() => {
        axios.get(`http://localhost:5000/posts`)
            .then((res) => {
                console.log(res.data)
                setBlogs(res.data)
            })
            .catch(() => {
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [updated])

    function createBlog() {
        axios.post('http://localhost:5000/create', formData)
            .then(response => {
                console.log('Response:', response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log(formData)

        if (!formData.title.trim() || !formData.content.trim() || !formData.author.trim()) {
            toast.error("Please fill in all fields")
            return
        }
        createBlog()
        setIsSheetOpen(false)
        setUpdated(prev => prev + 1)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    return (
        <div className="min-h-screen py-8 z-20 relative">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">EchoVerse</h1>
                    <p className="text-lg text-gray-600">Share your thoughts with the world</p>
                </div>

                {/* Add Blog Button */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-6 w-6"/>
                        <h2 className="text-2xl font-bold text-gray-900">All Blog Posts</h2>
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                            {blogs && blogs.length} {blogs && blogs.length === 1 ? "post" : "posts"}
                        </span>
                    </div>

                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button className="flex items-center gap-2 bg-black text-white">
                                <Plus className="h-4 w-4"/>
                                Add New Post
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[400px] sm:w-[540px] bg-white px-4">
                            <SheetHeader>
                                <SheetTitle className="flex items-center gap-2">
                                    <PlusCircle className="h-5 w-5"/>
                                    Create New Blog Post
                                </SheetTitle>
                                <SheetDescription>Share your thoughts and ideas with the community</SheetDescription>
                            </SheetHeader>

                            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        placeholder="Enter blog title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="focus:outline-none focus:ring-0 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="author">Author</Label>
                                    <Input
                                        id="author"
                                        name="author"
                                        placeholder="Your name"
                                        value={formData.author}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content">Content</Label>
                                    <Textarea
                                        id="content"
                                        name="content"
                                        placeholder="Write your blog content here..."
                                        value={formData.content}
                                        onChange={handleInputChange}
                                        rows={8}
                                        required
                                        className="resize-none"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button type="submit" disabled={isSubmitting}
                                            className="flex-1 bg-black text-white">
                                        {isSubmitting ? "Publishing..." : "Publish Blog Post"}
                                    </Button>
                                    <Button type="button" variant="outline"
                                            onClick={() => setIsSheetOpen(false)} disabled={isSubmitting}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Blog List */}
                <div className="space-y-6">
                    {isLoading ? (
                        <div className="text-center py-8">
                            {/*<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>*/}
                            <p className="mt-2 text-gray-600">Loading blogs...</p>
                        </div>
                    ) : blogs.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-8">
                                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4"/>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
                                <p className="text-gray-600">Be the first to share your thoughts!</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6">
                            {blogs.map((blog) => (
                                <Card key={blog._id} className="hover:shadow-lg transition-shadow bg-white/50">
                                    <CardHeader>
                                        <CardTitle className="text-xl">{blog.title}</CardTitle>
                                        <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4"/>
                          {blog.author}
                      </span>
                                            <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4"/>
                                                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                      </span>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{blog.content}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
