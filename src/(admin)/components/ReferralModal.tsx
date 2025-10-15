import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/uiComponents/custom-toast/custom-toast';
import { SYSTEM_CONSTANTS } from '@/constants/staticConstant';
import { type PostCallData, apiGetCall } from '@/helper/apiService';
import { Check, Copy, Download } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface ReferralModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ReferralModal({ isOpen, onClose }: ReferralModalProps) {
    const [referralLink, setReferralLink] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const generateReferralLink = useCallback(async () => {
        try {
            setIsLoading(true);
            const submitData: PostCallData = {
                endpoint: 'generate_referral_link',
            };

            const response = await apiGetCall(submitData);

            console.log('this is referral link generation response', response);

            if (
                response &&
                response.data.code === SYSTEM_CONSTANTS.success_code
            ) {
                showToast(
                    response?.data.code,
                    response?.data.message,
                    'Referral Link Generation',
                );
                setReferralLink(response.data.referralLink);
                setQrCode(response.data.qrCode);
                setIsCopied(false);
                setIsDownloading(false);
            } else {
                showToast(
                    response?.data.code,
                    response?.data.message,
                    'Referral Link Generation',
                );
            }
        } catch (error) {
            console.error('Error generating referral link:', error);
            showToast(
                SYSTEM_CONSTANTS.error_code,
                `Error: ${error || 'Failed to generate referral link'}`,
                'Referral Link',
            );
        } finally {
            setIsLoading(false);
            console.log('Referal Link Generation Sucess');
        }
    }, [showToast]);

    const fallbackCopyTextToClipboard = (text: string) => {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;

            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            textArea.style.width = '2em';
            textArea.style.height = '2em';
            textArea.style.padding = '0';
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';
            textArea.style.background = 'transparent';

            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            textArea.setSelectionRange(0, 99999);

            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);

            if (successful) {
                setIsCopied(true);
                showToast(
                    SYSTEM_CONSTANTS.success_code,
                    'Referral link copied to clipboard!',
                    'Copy Success',
                );
                setTimeout(() => setIsCopied(false), 2000);
            } else {
                throw new Error('Copy command failed');
            }
        } catch (fallbackError) {
            console.error('Fallback copy failed:', fallbackError);
            showToast(
                SYSTEM_CONSTANTS.error_code,
                'Failed to copy referral link. Please copy manually.',
                'Copy Error',
            );
        }
    };

    // This words on https:// environment
    // const copyToClipboard = async () => {
    //     try {
    //         await navigator.clipboard.writeText(referralLink);
    //         setIsCopied(true);
    //         showToast(
    //             SYSTEM_CONSTANTS.success_code,
    //             'Referral link copied to clipboard!',
    //             'Copy Success',
    //         );
    //         setTimeout(() => setIsCopied(false), 2000);
    //     } catch (error) {
    //         console.error('Failed to copy:', error);
    //         showToast(
    //             SYSTEM_CONSTANTS.error_code,
    //             'Failed to copy referral link',
    //             'Copy Error',
    //         );
    //     }
    // };

    // for http:// environment - non secure
    const copyToClipboard = async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(referralLink);
                setIsCopied(true);
                showToast(
                    SYSTEM_CONSTANTS.success_code,
                    'Referral link copied to clipboard!',
                    'Copy Success',
                );
                setTimeout(() => setIsCopied(false), 2000);
            } else {
                fallbackCopyTextToClipboard(referralLink);
            }
        } catch (error) {
            console.error('Modern clipboard API failed:', error);
            fallbackCopyTextToClipboard(referralLink);
        }
    };

    const downloadQRCode = async () => {
        try {
            setIsDownloading(true);

            const link = document.createElement('a');
            link.href = qrCode;
            link.download = `referral-qr-code-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showToast(
                SYSTEM_CONSTANTS.success_code,
                'QR Code downloaded successfully!',
                'Download Success',
            );
        } catch (error) {
            console.error('Failed to download QR code:', error);
            showToast(
                SYSTEM_CONSTANTS.error_code,
                'Failed to download QR code',
                'Download Error',
            );
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDialogClose = () => {
        setReferralLink('');
        setQrCode('');
        setIsCopied(false);
        setIsDownloading(false);
        onClose();
    };

    useEffect(() => {
        if (isOpen && !referralLink) {
            generateReferralLink();
        }
    }, [isOpen, referralLink, generateReferralLink]);
    return (
        <Dialog open={isOpen} onOpenChange={handleDialogClose}>
            <DialogContent className="min-w-[90vw] md:min-w-[600px] max-h-[90vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle className="text-center text-lg font-semibold">
                        Referral Link & QR Code
                    </DialogTitle>
                </DialogHeader>
                {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">
                                Generating referral link...
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 p-4">
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-gray-700">
                                Referral Link:
                            </h3>
                            <div className="flex items-center gap-2 p-1 rounded-lg border">
                                <div className="flex-1 text-sm text-gray-600 break-all">
                                    <Input value={referralLink} readOnly />
                                </div>
                                <Button
                                    onClick={copyToClipboard}
                                    variant="outline"
                                    size="sm"
                                    className="cursor-pointer flex items-center gap-2 shrink-0"
                                    disabled={!referralLink}
                                >
                                    {isCopied ? (
                                        <>
                                            <Check
                                                size={16}
                                                className="text-green-600"
                                            />
                                            <span>Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={16} />
                                            <span>Copy</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-gray-700">
                                QR Code:
                            </h3>
                            <div className="flex flex-col items-center space-y-4">
                                {qrCode && (
                                    <div className="relative">
                                        <img
                                            src={qrCode}
                                            alt="Referral QR Code"
                                            className="w-64 h-64 border border-gray-200 rounded-lg shadow-sm"
                                        />
                                    </div>
                                )}
                                <Button
                                    onClick={downloadQRCode}
                                    variant="outline"
                                    className="cursor-pointer flex items-center gap-2"
                                    disabled={!qrCode || isDownloading}
                                >
                                    <Download size={16} />
                                    <span>
                                        {isDownloading
                                            ? 'Downloading...'
                                            : 'Download QR Code'}
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
