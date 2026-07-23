export default function EmptyState({ message, action }) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500 text-lg">{message}</p>
      {action && (
        <button onClick={action.onClick} className="btn-primary mt-4">
          {action.label}
        </button>
      )}
    </div>
  )
}