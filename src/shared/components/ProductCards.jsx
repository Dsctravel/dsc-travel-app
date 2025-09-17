export default function ProductCards({ viagem, expandido, setExpandido }) {
  const toggleSection = (section) => {
    setExpandido(expandido === section ? null : section)
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "10px",
      marginTop: "15px",
      marginBottom: "15px"
    }}>
      {viagem.hotels?.length > 0 && (
        <div 
          onClick={() => toggleSection('hotel')}
          style={{
            padding: "15px",
            backgroundColor: expandido === 'hotel' ? "#667eea" : "#f0f4ff",
            borderRadius: "10px",
            textAlign: "center",
            cursor: "pointer",
            border: "2px solid #667eea",
            transition: "all 0.3s"
          }}>
          <div style={{ fontSize: "24px" }}>🏨</div>
          <div style={{ 
            fontSize: "12px", 
            fontWeight: "bold", 
            color: expandido === 'hotel' ? "white" : "#667eea" 
          }}>Hotel</div>
        </div>
      )}
      
      {viagem.transfers?.length > 0 && (
        <div 
          onClick={() => toggleSection('transfer')}
          style={{
            padding: "15px",
            backgroundColor: expandido === 'transfer' ? "#667eea" : "#f0f4ff",
            borderRadius: "10px",
            textAlign: "center",
            cursor: "pointer",
            border: "2px solid #667eea",
            transition: "all 0.3s"
          }}>
          <div style={{ fontSize: "24px" }}>🚗</div>
          <div style={{ 
            fontSize: "12px", 
            fontWeight: "bold", 
            color: expandido === 'transfer' ? "white" : "#667eea" 
          }}>Transfer</div>
        </div>
      )}
      
      {viagem.insurance?.length > 0 && (
        <div 
          onClick={() => toggleSection('seguro')}
          style={{
            padding: "15px",
            backgroundColor: expandido === 'seguro' ? "#667eea" : "#f0f4ff",
            borderRadius: "10px",
            textAlign: "center",
            cursor: "pointer",
            border: "2px solid #667eea",
            transition: "all 0.3s"
          }}>
          <div style={{ fontSize: "24px" }}>🛡️</div>
          <div style={{ 
            fontSize: "12px", 
            fontWeight: "bold", 
            color: expandido === 'seguro' ? "white" : "#667eea" 
          }}>Seguro</div>
        </div>
      )}
    </div>
  )
}
