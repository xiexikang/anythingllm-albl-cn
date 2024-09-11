export default function VectorDBIdentifier({ workspace }) {
  return (
    <div>
      <h3 className="input-label">向量数据库标识符</h3>
      <p className="text-white/60 text-xs font-medium py-1"> </p>
      <p className="text-white/60 text-sm">{workspace?.slug}</p>
    </div>
  );
}
