import { useState } from 'react'
import dadosViagem from './dados.json'

function App() {
  const [tela, setTela] = useState('home')
  const { viagem } = dadosViagem

  if (tela === 'detalhes-voo') {
    return (
      <div style={{padding: '20px', maxWidth: '400px', margin: '0 auto'}}>
        <div style={{backgroundColor: '#1e3a5f', color: 'white', padding: '20px'}}>
          <button onClick={() => setTela('home')} style={{background: 'none', border: 'none', color: 'white', fontSize: '20px'}}>←</button>
          <h2>Detalhes do Voo</h2>
        </div>
        
        <div style={{padding: '20px', backgroundColor: 'white'}}>
          <h3>IDA</h3>
          <div style={{marginBottom: '20px'}}>
            <p><strong>{viagem.voos.ida.companhia}</strong></p>
            <p>{viagem.voos.ida.origem} → {viagem.voos.ida.destino}</p>
            <p>{viagem.voos.ida.data}</p>
            <p style={{color: 'green'}}>✓ Confirmado</p>
          </div>
          
          <h3>VOLTA</h3>
          <div>
            <p><strong>{viagem.voos.volta.companhia}</strong></p>
            <p>{viagem.voos.volta.origem} → {viagem.voos.volta.destino}</p>
            <p>{viagem.voos.volta.data}</p>
            <p style={{color: 'green'}}>✓ Confirmado</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{padding: '20px', maxWidth: '400px', margin: '0 auto'}}>
      <div style={{backgroundColor: '#4A90E2', color: 'white', padding: '20px', marginBottom: '20px'}}>
        <h1>✈️ DSC TRAVEL</h1>
      </div>

      <div style={{backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
        <h2>{viagem.titulo}</h2>
        
        <div style={{marginTop: '20px'}}>
          {viagem.itens.map((item, index) => (
            <div 
              key={index}
              onClick={item.tipo === 'voo' ? () => setTela('detalhes-voo') : null}
              style={{
                padding: '15px', 
                backgroundColor: '#f5f5f5', 
                marginBottom: '10px', 
                borderRadius: '5px',
                cursor: item.tipo === 'voo' ? 'pointer' : 'default'
              }}
            >
              {item.tipo === 'voo' && '✈️ '}
              {item.tipo === 'transfer' && '🚐 '}
              {item.tipo === 'hotel' && '🏨 '}
              {item.tipo === 'tour' && '🎫 '}
              {item.nome}
              <span style={{float: 'right', color: 'green'}}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
