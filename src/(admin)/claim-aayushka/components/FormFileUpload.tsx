export default function FormFileUpload({ name, label, form }: any) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="file"
        {...form.register(name)}
        className="block w-full text-sm text-gray-500 file:border file:border-gray-300 file:rounded file:px-3 file:py-1"
      />
    </div>
  );
}
