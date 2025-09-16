export default function Header({ origem, destino }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      marginBottom: '20px',
      borderRadius: '10px',
    }}>
      <h1>✈️ DSC TRAVEL</h1>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '15px', 
        marginTop: '20px',
        fontSize: '28px',
        fontWeight: 'bold'
      }}>
        <span>{origem}</span>
        <span>→</span>
        <span>{destino}</span>
      </div>
    </div>
  )
}
