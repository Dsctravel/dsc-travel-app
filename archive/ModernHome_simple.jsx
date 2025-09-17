import { fmt } from '../utils/formatters'
import { useState } from 'react'

export default function ModernHome({ viagem, onLogout }) {
  const [mostrarDetalhesVoos, setMostrarDetalhesVoos] = useState(false)
  
  // ... resto do código igual ...
  
  // Na parte do primeiro voo (Próxima Etapa), adicionar onClick:
  <div 
    onClick={() => setMostrarDetalhesVoos(!mostrarDetalhesVoos)}
    style={{ cursor: 'pointer' }}
  >
    {/* conteúdo do card do voo */}
  </div>
  
  // Após o card, mostrar detalhes se expandido:
  {mostrarDetalhesVoos && (
    <div style={{
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '12px',
      marginTop: '10px'
    }}>
      <h3>Todos os Voos:</h3>
      {viagem.segments.map((voo, i) => (
        <div key={i}>
          {voo.from_city} → {voo.to_city}
          {voo.flight} - {fmt(voo.depart_at)}
        </div>
      ))}
    </div>
  )}
