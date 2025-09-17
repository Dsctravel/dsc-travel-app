import { useState } from 'react'
import { supabase } from './services/supabase'
import { fmt } from './utils/formatters'
import Header from './components/Header'
import FlightCard from './components/FlightCard'
import ProductCards from './components/ProductCards'
import HotelCard from './components/HotelCard'
import TransferCard from './components/TransferCard'
import InsuranceCard from './components/InsuranceCard'

export default function App() {
  const [tela, setTela] = useState('login')
  const [codigo, setCodigo] = useState('')
  const [viagem, setViagem] = useState(null)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [expandido, setExpandido] = useState(null)

  const buscarViagem = async () => {
    setCarregando(true)
    setErro('')
    try {
      const { data, error } = await supabase
        .from('trips_v2')
        .select('*')
        .eq('pnr', codigo.toUpperCase())
        .single()

      if (error) throw error
      if (data) {
        setViagem(data)
        setTela('home')
        setExpandido(null)
      }
    } catch (e) {
      setErro('Código não encontrado')
    } finally {
      setCarregando(false)
    }
  }

  const getPassageiroPrincipal = (passengers) => {
    if (!passengers || passengers.length === 0) return 'Cliente'
    return passengers[0].name || 'Cliente'
  }

  const getTodosPassageiros = (passengers) => {
    if (!passengers || passengers.length === 0) return []
    return passengers.map((p) => ({
      nome: p.name,
      tipo: p.type === 'ADT' ? 'Adulto' : p.type === 'CHD' ? 'Criança' : 'Bebê',
    }))
  }

  const getOrigemDestino = () => {
    if (!viagem?.segments || viagem.segments.length === 0) {
      return { origem: '---', destino: '---' }
    }
    
    const origem = viagem.segments[0].from_city || '---'
    const cidadesDestino = {}
    viagem.segments.forEach(s => {
      if (s.to_city && s.to_city !== origem) {
        cidadesDestino[s.to_city] = (cidadesDestino[s.to_city] || 0) + 1
      }
    })
    
    let destino = origem
    let maxVisitas = 0
    for (const [cidade, visitas] of Object.entries(cidadesDestino)) {
      if (visitas > maxVisitas) {
        destino = cidade
        maxVisitas = visitas
      }
    }
    
    return { origem, destino }
  }

  if (tela === 'login') {
    return (
      <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px',
          marginBottom: '20px',
          borderRadius: '10px',
        }}>
          <h1>✈️ DSC TRAVEL</h1>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}>
          <h2>Acessar sua viagem</h2>
          <p>Digite o código da reserva (PNR)</p>

          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Ex: QNXECK"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              marginBottom: '10px',
            }}
          />

          <button
            onClick={buscarViagem}
            disabled={carregando}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: carregando ? 'wait' : 'pointer',
            }}
          >
            {carregando ? 'Buscando...' : 'Acessar'}
          </button>

          {erro && (
            <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
              {erro}
            </p>
          )}
        </div>
      </div>
    )
  }

  if (tela === 'detalhes-passageiros') {
    return (
      <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white', 
          padding: '20px' 
        }}>
          <button
            onClick={() => setTela('home')}
            style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px' }}
          >
            ←
          </button>
          <h2>Passageiros</h2>
        </div>

        <div style={{ padding: '20px', backgroundColor: 'white' }}>
          <h3>Lista de Passageiros:</h3>
          {getTodosPassageiros(viagem.passengers).map((passageiro, index) => (
            <div key={index} style={{
              padding: '15px',
              backgroundColor: '#f5f5f5',
              marginBottom: '10px',
              borderRadius: '5px',
            }}>
              <p><strong>{passageiro.nome}</strong></p>
              <p>Tipo: {passageiro.tipo}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Tela Home
  const { origem, destino } = getOrigemDestino()
  
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Header origem={origem} destino={destino} />

      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}>
        <h2>Viagem de {getPassageiroPrincipal(viagem.passengers)}</h2>
        <p>Código: {viagem.pnr}</p>
        <p>Localizador: {viagem.locator}</p>

        <div
          onClick={() => setTela('detalhes-passageiros')}
          style={{
            padding: '15px',
            backgroundColor: '#f5f5f5',
            marginBottom: '10px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          👥 Passageiros ({viagem.passengers?.length || 0})
          <span style={{ float: 'right', color: 'green' }}>Ver detalhes →</span>
        </div>

        <ProductCards viagem={viagem} expandido={expandido} setExpandido={setExpandido} />

        {/* Área de detalhes expandidos */}
        {expandido === 'hotel' && viagem.hotels && (
          <div style={{ marginTop: '15px' }}>
            {viagem.hotels.map((hotel, index) => (
              <HotelCard key={index} hotel={hotel} />
            ))}
          </div>
        )}

        {expandido === 'transfer' && viagem.transfers && (
          <div style={{ marginTop: '15px' }}>
            {viagem.transfers.map((transfer, index) => (
              <TransferCard key={index} transfer={transfer} />
            ))}
          </div>
        )}

        {expandido === 'seguro' && viagem.insurance && (
          <div style={{ marginTop: '15px' }}>
            {viagem.insurance.map((ins, index) => (
              <InsuranceCard key={index} insurance={ins} />
            ))}
          </div>
        )}

        {/* Voos sempre visíveis */}
        <h3 style={{ marginTop: '20px' }}>Voos</h3>
        {viagem.segments && viagem.segments.map((segment, index) => (
          <FlightCard key={index} segment={segment} />
        ))}
      </div>

      <button
        onClick={() => {
          setTela('login')
          setCodigo('')
          setViagem(null)
        }}
        style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#764ba2',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Sair
      </button>
    </div>
  )
}
