interface RowfieldProps {
  label: string;
  value: string;
}

 const RowField = ({ label, value }: RowfieldProps) => (
  <div className="grid grid-cols-3  border-b border-gray-100">
    <span className="text-gray-600 ">{label}</span>
    <span className="text-gray-600 mx-2">:</span>
    <span className="font-medium text-gray-900 flex-1 text-right">{value}</span>
  </div>
);

export default RowField;