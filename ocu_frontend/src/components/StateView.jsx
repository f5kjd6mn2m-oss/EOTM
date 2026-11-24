/** Yuklanish / xato / bo'sh holatlarni bir xil ko'rsatadi */
export default function StateView({ loading, error, empty, emptyText = "Ma'lumot yo'q", onRetry, children }) {
  if (loading) return <div className="state">Yuklanmoqda…</div>;
  if (error)
    return (
      <div className="state state-error">
        {error}
        {onRetry && (
          <button className="btn btn-ghost" onClick={onRetry}>
            Qayta urinish
          </button>
        )}
      </div>
    );
  if (empty) return <div className="state">{emptyText}</div>;
  return children;
}
