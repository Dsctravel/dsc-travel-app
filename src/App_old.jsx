import { useState } from 'react'
import { supabase } from './services/supabase'

// Helper: normaliza para array (aceita array, string JSON ou null)
const asArray = (v) => {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    try { return JSON.parse(v) } catch { return [] }
  }
  return v ?? [];
};

const fmt = (v) =>
  v
    ? new Date(v).toLocaleString('pt-BR', {
        timeZone: 'UTC',
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—'

export default function App() {
  const [tela, setTela] = useState('login')
  const [codigo, setCodigo] = useState('')
  const [viagem, setViagem] = useState(null)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

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
      }
    } catch (e) {
      setErro('Código não encontrado. Tente ABC123')
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
    
    // Criar um mapa de frequência das cidades
    const cidadesDestino = {}
    viagem.segments.forEach(s => {
      if (s.to_city && s.to_city !== origem) {
        cidadesDestino[s.to_city] = (cidadesDestino[s.to_city] || 0) + 1
      }
    })
    
    // Pegar a cidade mais visitada que não seja a origem
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
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '20px',
            marginBottom: '20px',
            borderRadius: '10px',
          }}
        >
          <h1>✈️ DSC TRAVEL</h1>
        </div>

        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          <h2>Acessar sua viagem</h2>
          <p>Digite o código da reserva (PNR)</p>

          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Ex: ABC123"
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
            <div
              key={index}
              style={{
                padding: '15px',
                backgroundColor: '#f5f5f5',
                marginBottom: '10px',
                borderRadius: '5px',
              }}
            >
              <p>
                <strong>{passageiro.nome}</strong>
              </p>
              <p>Tipo: {passageiro.tipo}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // home
  const { origem, destino } = getOrigemDestino()
  
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px',
          marginBottom: '20px',
          borderRadius: '10px',
        }}
      >
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

      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
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

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
          marginTop: "15px",
          marginBottom: "15px"
        }}>
{viagem.hotels?.length > 0 && (
  <div 
    onClick={() => {
      const hotelElement = document.getElementById('hotel-section');
      hotelElement?.scrollIntoView({ behavior: 'smooth' });
    }}
    style={{
      padding: "15px",
      backgroundColor: "#f0f4ff",
      borderRadius: "10px",
      textAlign: "center",
      cursor: "pointer",
      border: "2px solid #667eea"
    }}>
    <div style={{ fontSize: "24px" }}>🏨</div>
    <div style={{ fontSize: "12px", fontWeight: "bold", color: "#667eea" }}>Hotel</div>
  </div>
)}          
          {viagem.transfers?.length > 0 && (
            <div style={{
              padding: "15px",
              backgroundColor: "#f0f4ff",
              borderRadius: "10px",
              textAlign: "center",
              cursor: "pointer",
              border: "2px solid #667eea"
            }}>
              <div style={{ fontSize: "24px" }}>🚗</div>
              <div style={{ fontSize: "12px", fontWeight: "bold", color: "#667eea" }}>Transfer</div>
            </div>
          )}
          
          {viagem.insurance?.length > 0 && (
            <div style={{
              padding: "15px",
              backgroundColor: "#f0f4ff",
              borderRadius: "10px",
              textAlign: "center",
              cursor: "pointer",
              border: "2px solid #667eea"
            }}>
              <div style={{ fontSize: "24px" }}>🛡️</div>
              <div style={{ fontSize: "12px", fontWeight: "bold", color: "#667eea" }}>Seguro</div>
            </div>
          )}
        </div>

        {viagem.segments &&
          viagem.segments.map((segment, index) => (
            <div
              key={index}
              style={{
                padding: '15px',
                backgroundColor: '#f5f5f5',
                marginBottom: '10px',
                borderRadius: '5px',
              }}
            >
              ✈️ Voo:{' '}
              {segment.from_city ?? segment.origin ?? segment.origin_raw} →{' '}
              {(segment.to_city ?? segment.destination ?? segment.destination_raw) ||
                'A definir'}
              <div style={{ fontSize: '14px', color: '#555', marginTop: '6px' }}>
                Nº {segment.flight} • {fmt(segment.depart_at)} → {fmt(segment.arrive_at)} •
                Bagagem: {segment.baggage || '—'}
              </div>
              <span style={{ float: 'right', color: 'green' }}>Confirmado</span>
            </div>
          ))}

        {viagem.hotels && viagem.hotels.length > 0 && viagem.hotels.map((hotel, index) => (
          <div id="hotel-section" key={index} style={{            padding: "15px",
            backgroundColor: "#f5f5f5",
            marginBottom: "10px",
            borderRadius: "5px"
          }}>
            <div>🏨 Hotel: {hotel.hotel_name}</div>
            <div style={{fontSize: "14px", color: "#555", marginTop: "6px"}}>
              📍 {hotel.address}
            </div>
            <div style={{fontSize: "14px", color: "#555", marginTop: "6px"}}>
              Check-in: {hotel.check_in} • Check-out: {hotel.check_out} • Quarto: {hotel.room_type}
            </div>
            <span style={{float: "right", color: "green"}}>Confirmado</span>
          </div>
        ))}

       {viagem.transfers && viagem.transfers.length > 0 && viagem.transfers.map((transfer, index) => (
       <div id="transfer-section" key={index} style={{
            backgroundColor: "#f5f5f5",
            marginBottom: "10px",
            borderRadius: "5px"
          }}>
            {transfer.date_in && (
              <>
                <div>🚗 Transfer IDA: {transfer.pickup_in} → {transfer.dropoff_in}</div>
                <div style={{fontSize: "14px", color: "#555", marginTop: "6px"}}>
                  Data: {transfer.date_in} • Horário: {transfer.time_in}
                </div>
              </>
            )}
            {transfer.date_out && (
              <>
                <div style={{marginTop: "10px"}}>🚗 Transfer VOLTA: {transfer.pickup_out} → {transfer.dropoff_out}</div>
                <div style={{fontSize: "14px", color: "#555", marginTop: "6px"}}>
                  Data: {transfer.date_out} • Horário: {transfer.time_out}
                </div>
              </>
            )}
            <div style={{fontSize: "14px", color: "#555", marginTop: "4px"}}>
              Passageiros: {transfer.passengers}
            </div>
            <span style={{float: "right", color: "green"}}>Confirmado</span>
          </div>
        ))}

     {Array.isArray(viagem.insurance) && viagem.insurance.length > 0 && viagem.insurance.map((ins, index) => (
       <div id={index === 0 ? "insurance-section" : undefined} key={index} style={{            padding: "15px",
            backgroundColor: "#f5f5f5",
            marginBottom: "10px",
            borderRadius: "5px"
          }}>
            <div>🛡️ Seguro: {ins.company || "Seguro viagem"}</div>
            <div style={{fontSize: "14px", color: "#555", marginTop: "6px"}}>
              Apólice: {ins.policy || "—"} • Plano: {ins.coverage || "—"}
            </div>
            <div style={{fontSize: "14px", color: "#555", marginTop: "6px"}}>
              Período: {ins.start_date || "—"} → {ins.end_date || "—"}
            </div>
            <div style={{fontSize: "14px", color: "#555", marginTop: "6px"}}>
              Titular: {ins.insured_name || "—"}
            </div>
            <span style={{float: "right", color: "green"}}>Confirmado</span>
          </div>
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
