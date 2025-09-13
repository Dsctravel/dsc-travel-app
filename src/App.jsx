import { useState } from 'react'
import dadosViagem from './dados.json'

function App() {
  const [tela, setTela] = useState('home')
  const { viagem } = dadosViagem

  // Tela de Detalhes do Voo
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

  // Tela de Detalhes do Transfer
  if (tela === 'detalhes-transfer') {
    return (
      <div style={{padding: '20px', maxWidth: '400px', margin: '0 auto'}}>
        <div style={{backgroundColor: '#1e3a5f', color: 'white', padding: '20px'}}>
          <button onClick={() => setTela('home')} style={{background: 'none', border: 'none', color: 'white', fontSize: '20px'}}>←</button>
          <h2>Detalhes do Transfer</h2>
        </div>
        
        <div style={{padding: '20px', backgroundColor: 'white'}}>
          <h3>🚐 TRANSFER DE CHEGADA</h3>
          <div style={{marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px'}}>
            <p><strong>Aeroporto → Hotel</strong></p>
            <p>Data: 20 de agosto de 2024</p>
            <p>Horário: Após chegada do voo</p>
            <p>Motorista: Aguardando na saída</p>
            <p style={{color: 'green'}}>✓ Confirmado</p>
          </div>
          
          <h3>🚐 TRANSFER DE PARTIDA</h3>
          <div style={{padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px'}}>
            <p><strong>Hotel → Aeroporto</strong></p>
            <p>Data: 28 de agosto de 2024</p>
            <p>Horário: 18:00 (3h antes do voo)</p>
            <p>Retirada: Recepção do hotel</p>
            <p style={{color: 'green'}}>✓ Confirmado</p>
          </div>
        </div>
      </div>
    )
  }

  // Tela de Detalhes do Hotel
  if (tela === 'detalhes-hotel') {
    return (
      <div style={{padding: '20px', maxWidth: '400px', margin: '0 auto'}}>
        <div style={{backgroundColor: '#1e3a5f', color: 'white', padding: '20px'}}>
          <button onClick={() => setTela('home')} style={{background: 'none', border: 'none', color: 'white', fontSize: '20px'}}>←</button>
          <h2>Detalhes do Hotel</h2>
        </div>
        
        <div style={{padding: '20px', backgroundColor: 'white'}}>
          <h3>🏨 HOTEL SANTIAGO</h3>
          <div style={{marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px'}}>
            <p><strong>Check-in:</strong> 20 de agosto de 2024 - 14:00</p>
            <p><strong>Check-out:</strong> 28 de agosto de 2024 - 12:00</p>
            <p><strong>Regime:</strong> Café da manhã incluído</p>
            <p><strong>Quartos:</strong> 2 quartos duplos</p>
            <p style={{color: 'green'}}>✓ Confirmado</p>
          </div>
          
          <h4>Endereço:</h4>
          <div style={{padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px'}}>
            <p>Av. Providencia, 1234</p>
            <p>Santiago, Chile</p>
            <p>Tel: +56 2 1234-5678</p>
          </div>
        </div>
      </div>
    )
  }

  // Tela de City Tour
  if (tela === 'detalhes-tour') {
    return (
      <div style={{padding: '20px', maxWidth: '400px', margin: '0 auto'}}>
        <div style={{backgroundColor: '#1e3a5f', color: 'white', padding: '20px'}}>
          <button onClick={() => setTela('home')} style={{background: 'none', border: 'none', color: 'white', fontSize: '20px'}}>←</button>
          <h2>Detalhes do City Tour</h2>
        </div>
        
        <div style={{padding: '20px', backgroundColor: 'white'}}>
          <h3>🎫 CITY TOUR SANTIAGO</h3>
          <div style={{marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px'}}>
            <p><strong>Data:</strong> 21 de agosto de 2024</p>
            <p><strong>Horário:</strong> 09:00 às 13:00</p>
            <p><strong>Saída:</strong> Lobby do hotel</p>
            <p><strong>Guia:</strong> Português/Espanhol</p>
            <p style={{color: 'green'}}>✓ Confirmado</p>
          </div>
          
          <h4>Roteiro:</h4>
          <div style={{padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px'}}>
            <p>• Palácio La Moneda</p>
            <p>• Cerro San Cristóbal</p>
            <p>• Mercado Central</p>
            <p>• Plaza de Armas</p>
          </div>
        </div>
      </div>
    )
  }

  // Tela Home (Principal)
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
              onClick={() => {
                if (item.tipo === 'voo') setTela('detalhes-voo')
                if (item.tipo === 'transfer') setTela('detalhes-transfer')
                if (item.tipo === 'hotel') setTela('detalhes-hotel')
                if (item.tipo === 'tour') setTela('detalhes-tour')
              }}
              style={{
                padding: '15px', 
                backgroundColor: '#f5f5f5', 
                marginBottom: '10px', 
                borderRadius: '5px',
                cursor: 'pointer'
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
