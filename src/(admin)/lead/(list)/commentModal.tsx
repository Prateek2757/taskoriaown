import {
    AtSign,
    Bold,
    Image,
    Italic,
    Paperclip,
    Smile,
    Underline,
} from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import LeadComment from '../components/LeadComment';

type ViewModalProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function CommentModal({ open, setOpen }: ViewModalProps) {
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="!w-full sm:!max-w-[600px] gap-1">
                <SheetHeader className="sticky top-0 border-b">
                    <SheetTitle>Lead Detail</SheetTitle>
                </SheetHeader>
                <div className="overflow-y-auto px-4 py-2 flex-1">
                    <LeadComment />
                </div>
                <SheetFooter className="sticky bottom-0 border-t flex-row items-center justify-between">
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 w-full">
                        <textarea
                            // value={comment}
                            // onChange={(e) => setComment(e.target.value)}
                            placeholder="Add comment..."
                            className="w-full p-3 border-0 resize-none bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none"
                        />
                        <div className="flex items-center justify-between mt-2 border-t-1 pt-2">
                            <div className="flex items-center space-x-3">
                                <button
                                    type="button"
                                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                                >
                                    <Bold className="w-4 h-4 text-gray-600" />
                                </button>
                                <button
                                    type="button"
                                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                                >
                                    <Italic className="w-4 h-4 text-gray-600" />
                                </button>
                                <button
                                    type="button"
                                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                                >
                                    <Underline className="w-4 h-4 text-gray-600" />
                                </button>
                                <button
                                    type="button"
                                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                                >
                                    <Paperclip className="w-4 h-4 text-gray-600" />
                                </button>
                                <button
                                    type="button"
                                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                                >
                                    <Image className="w-4 h-4 text-gray-600" />
                                </button>
                                <button
                                    type="button"
                                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                                >
                                    <Smile className="w-4 h-4 text-gray-600" />
                                </button>
                                <button
                                    type="button"
                                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                                >
                                    <AtSign className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>
                            <Button
                                type="button"
                                // onClick={handleSubmit}
                                className="cursor-pointer text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
