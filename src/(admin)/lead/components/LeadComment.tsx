import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function LeadComment() {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([
        {
            id: 1,
            user: {
                name: 'Noah Pierre',
                avatar: '/api/placeholder/32/32',
            },
            time: '58 minutes ago',
            content:
                "I'm a bit unclear about how condensation forms in the water cycle. Can someone break it down?",
            replies: [
                {
                    id: 2,
                    user: {
                        name: 'Skill Sprout',
                        avatar: '/api/placeholder/32/32',
                        verified: true,
                    },
                    time: '8 minutes ago',
                    content:
                        "Condensation happens when water vapor cools down and changes back into liquid droplets. It's the step before precipitation. The example with the glass of ice water in the video was great visual!",
                },
            ],
        },
        {
            id: 3,
            user: {
                name: 'Mollie Hall',
                avatar: '/api/placeholder/32/32',
            },
            time: '5 hours ago',
            content:
                "I really enjoyed today's lesson on the water cycle! The animations made the processes so much easier to understand.",
        },
    ]);

    const handleSubmit = () => {
        if (comment.trim()) {
            const newComment = {
                id: Date.now(),
                user: {
                    name: 'Current User',
                    avatar: '/api/placeholder/32/32',
                },
                time: 'just now',
                content: comment,
                replies: [],
            };
            setComments([newComment, ...comments]);
            setComment('');
        }
    };

    const UserAvatar = ({ src, alt }: { src: string; alt: string }) => (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                {alt?.charAt(0) || 'U'}
            </div>
        </div>
    );

    return (
        <>
            <div className="flex items-center mb-6 border-b-1 pb-2">
                <h3 className="text-lg font-semibold text-gray-900 ">
                    Comments
                </h3>
                <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {comments.length}
                </span>
            </div>

            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="space-y-4">
                        <div className="flex space-x-3">
                            <UserAvatar
                                src={comment.user.avatar}
                                alt={comment.user.name}
                            />
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-semibold text-gray-900 text-sm">
                                        {comment.user.name}
                                    </span>
                                    {comment.user.verified && (
                                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                            <svg
                                                className="w-2.5 h-2.5 text-white"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <title>SVG</title>
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                    <span className="text-sm text-gray-500">
                                        {comment.time}
                                    </span>
                                </div>
                                <p className="text-gray-700 mb-3 text-sm">
                                    {comment.content}
                                </p>
                                <div className="flex items-center space-x-4">
                                    <button
                                        type="button"
                                        className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        <span className="text-sm">Reply</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {comment.replies && comment.replies.length > 0 && (
                            <div className="ml-11 space-y-4">
                                {comment.replies.map((reply) => (
                                    <div
                                        key={reply.id}
                                        className="flex space-x-3"
                                    >
                                        <UserAvatar
                                            src={reply.user.avatar}
                                            alt={reply.user.name}
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className="font-semibold text-gray-900 text-sm">
                                                    {reply.user.name}
                                                </span>
                                                {reply.user.verified && (
                                                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                                        <svg
                                                            className="w-2.5 h-2.5 text-white"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <title>SVG</title>
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}
                                                <span className="text-sm text-gray-500">
                                                    {reply.time}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 mb-3 text-sm">
                                                {reply.content}
                                            </p>
                                            <div className="flex items-center space-x-4">
                                                <button
                                                    type="button"
                                                    className="cursor-pointer flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
                                                >
                                                    <MessageCircle className="w-4 h-4" />
                                                    <span className="text-sm">
                                                        Reply
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}
