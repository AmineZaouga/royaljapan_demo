export default function ErrorAlert({ message, onClose }) {
  return (
    <div className="error-alert" style={{border:'1px solid #f44336',background:'#fff0f0',padding:12,margin:12}}>
      <div style={{color:'#b71c1c',marginBottom:8}}>{message}</div>
      {onClose && (
        <button onClick={onClose} style={{padding:'6px 10px'}}>Dismiss</button>
      )}
    </div>
  );
}
