'use client';

import { useRef, useState, useEffect } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FileText,
  Upload,
  CheckCircle,
  Download,
  Loader2,
  Sparkles,
  Info,
  RefreshCw,
  FileImage,
  ZoomIn,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AffiliateHook } from '@/hooks/AffiliateDashboard/useAffiliate';


function fmtDate(iso?: string | null) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Preview Panel ─────────────────────────────────────────────────────────────
// Shows either a local blob URL (pre-upload) or the saved Supabase URL (post-upload).
// Images: <img>  |  PDFs: embedded <iframe> with lightbox zoom

function FilePreview({
  src,
  fileName,
  isPdf,
}: {
  src:      string;
  fileName: string;
  isPdf:    boolean;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
        {isPdf ? (
          <div className="relative w-full h-52">
            <iframe
              src={`${src}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full"
              title="Tax Declaration Preview"
            />
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors cursor-zoom-in"
              aria-label="View full screen"
            >
              <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-lg px-3 py-1.5 flex items-center gap-1.5 text-sm font-medium shadow">
                <ZoomIn className="w-4 h-4" /> View full screen
              </span>
            </button>
          </div>
        ) : (
          // Image: natural aspect ratio capped at 200px
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="block w-full cursor-zoom-in"
            aria-label="View full screen"
          >
            <img
              src={src}
              alt="Tax declaration preview"
              className="w-full max-h-52 object-contain p-2 group-hover:opacity-90 transition-opacity"
            />
            <span className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-lg px-2 py-1 flex items-center gap-1 text-xs font-medium shadow">
              <ZoomIn className="w-3 h-3" /> Zoom
            </span>
          </button>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl w-full p-2">
          <DialogHeader className="px-3 pt-2 pb-1">
            <DialogTitle className="text-sm font-medium truncate flex items-center gap-2">
              {isPdf
                ? <FileText className="w-4 h-4 text-red-500 shrink-0" />
                : <FileImage className="w-4 h-4 text-blue-500 shrink-0" />}
              {fileName}
            </DialogTitle>
          </DialogHeader>
          {isPdf ? (
            <iframe
              src={src}
              className="w-full rounded-lg"
              style={{ height: '80vh' }}
              title="Tax Declaration Full View"
            />
          ) : (
            <img
              src={src}
              alt="Tax declaration full view"
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}


function TaxFileUploader({
  uploading,
  onFileSelect,
}: {
  uploading:    boolean;
  onFileSelect: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { onFileSelect(file); e.target.value = ''; }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="sr-only"
        aria-label="Upload TFN Declaration"
        onChange={handleChange}
        disabled={uploading}
      />
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !uploading && inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        className="border-2 border-dashed border-slate-200 hover:border-blue-300 transition-colors rounded-xl p-8 text-center cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
            <p className="text-sm font-medium text-blue-600">Uploading…</p>
            <p className="text-xs text-slate-400">Please wait</p>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-400 transition-colors mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600 mb-1">
              Click to upload or drag &amp; drop
            </p>
            <p className="text-xs text-slate-400 mb-4">PDF, JPG, or PNG — max 2 MB</p>
            <Button type="button" variant="outline" size="sm" tabIndex={-1} disabled={uploading}>
              Choose File
            </Button>
          </>
        )}
      </div>
    </>
  );
}

// ─── Uploaded file card (with replace) ────────────────────────────────────────

function UploadedFileCard({
  name,
  uploadedAt,
  fileUrl,
  previewSrc,
  uploading,
  onReplace,
}: {
  name:        string;
  uploadedAt?: string | null;
  fileUrl?:    string | null;
  previewSrc:  string;
  uploading:   boolean;
  onReplace:   (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isPdf    = name.toLowerCase().endsWith('.pdf');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { onReplace(file); e.target.value = ''; }
  };

  return (
    <div className="space-y-3">
      <FilePreview src={previewSrc} fileName={name} isPdf={isPdf} />

      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2 min-w-0">
          <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{name}</p>
            {uploadedAt && (
              <p className="text-xs text-slate-500">Uploaded {fmtDate(uploadedAt)}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {fileUrl && (
            <Button variant="ghost" size="sm" type="button" asChild>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4 mr-1" />
                Download
              </a>
            </Button>
          )}

          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="sr-only"
            onChange={handleChange}
            disabled={uploading}
            aria-label="Replace tax declaration"
          />
          <Button
            variant="ghost"
            size="sm"
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="text-slate-500 hover:text-slate-700"
          >
            {uploading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <><RefreshCw className="w-4 h-4 mr-1" />Replace</>}
          </Button>
        </div>
      </div>
    </div>
  );
}


export function TaxInfoTab({
  taxForm: { form, dto, loading, saving, uploading, onSubmit, uploadTaxFile },
}: {
  taxForm: AffiliateHook['taxForm'];
}) {
  const [localPreview, setLocalPreview] = useState<{
    src:  string;
    name: string;
    size: number;
    isPdf: boolean;
  } | null>(null);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview.src);
    };
  }, [localPreview]);

  const handleFileSelect = (file: File) => {
    // Revoke previous blob if any
    if (localPreview) URL.revokeObjectURL(localPreview.src);

    const blobUrl = URL.createObjectURL(file);
    setLocalPreview({
      src:   blobUrl,
      name:  file.name,
      size:  file.size,
      isPdf: file.type === 'application/pdf',
    });

    uploadTaxFile(file);
  };

  
  useEffect(() => {
    if (dto?.tax_file_url && localPreview) {
      URL.revokeObjectURL(localPreview.src);
      setLocalPreview(null);
    }
  }, [dto?.tax_file_url]);

  const savedUrl   = dto?.tax_file_url ?? null;
  const savedName  = dto?.tax_file_name ?? '';
  const previewSrc = localPreview?.src ?? savedUrl ?? null;
  const previewName = localPreview?.name ?? savedName;
  const hasPreview  = !!previewSrc;

  return (
    <Card className="border-0 shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          Tax Information
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-52 w-full rounded-xl" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">

              {/* ABN ─────────────────────────────────────────────────────── */}
              <FormField
                control={form.control}
                name="abn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ABN (Australian Business Number)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="12 345 678 901" maxLength={14} />
                    </FormControl>
                    <FormDescription>
                      11-digit ABN required for Australian tax reporting.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* TFN Declaration ─────────────────────────────────────────── */}
              <div className="space-y-2">
                <p className="text-sm font-medium leading-none">Tax Declaration</p>

                {hasPreview ? (
                  <UploadedFileCard
                    name={previewName}
                    uploadedAt={dto?.tax_uploaded_at}
                    fileUrl={savedUrl}
                    previewSrc={previewSrc!}
                    uploading={uploading}
                    onReplace={handleFileSelect}
                  />
                ) : (
                  <TaxFileUploader
                    uploading={uploading}
                    onFileSelect={handleFileSelect}
                  />
                )}

                {/* Uploading status pill */}
                {uploading && (
                  <div className="flex items-center gap-2 text-xs text-blue-600 pt-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>
                      Uploading
                      {localPreview ? ` ${localPreview.name} (${fmtSize(localPreview.size)})` : ''}
                      …
                    </span>
                  </div>
                )}
              </div>

              {/* Info banner ─────────────────────────────────────────────── */}
              <div className="p-4 bg-blue-50 rounded-xl flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Tax Information</p>
                  <p className="text-sm text-blue-700">
                    As an Australian affiliate you are responsible for reporting earnings to
                    the ATO. We will provide an annual payment summary for tax purposes.
                  </p>
                </div>
              </div>

              {/* Save ABN ───────────────────────────────────────────────── */}
              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  className="gradient-primary"
                  disabled={saving || !form.formState.isDirty}
                >
                  {saving
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</>
                    : 'Save Tax Information'}
                </Button>
                {form.formState.isDirty && (
                  <p className="text-xs text-amber-600 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    Unsaved changes
                  </p>
                )}
              </div>

            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}