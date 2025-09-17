import { getValidSegments, formatTime, formatDate } from '@utils/formatters'
import { useState } from 'react'

export default function FlightDetails({ viagem, onBack }) {
  const validSegments = getValidSegments(viagem?.segments || [])
  
  if (validSegments.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <button onClick={onBack}>← Voltar</button>
        <p>Nenhum voo válido encontrado</p>
      </div>
    )
  }

  const voosIda = validSegments.slice(0, Math.ceil(validSegments.length / 2))
  const voosVolta = validSegments.slice(Math.ceil(validSegments.length / 2))

  // Sistema de detecção de companhias - FUNCIONANDO
  const getCompanyData = (flight) => {
    const companies = {
      'G3': { 
        name: 'Gol', 
        logo: '/images/gol-logo.png',
        rating: '7.6 Muito bom',
        color: '#FF6900'
      },
      'LA': { 
        name: 'LATAM', 
        logo: '/images/latam-logo.png',
        rating: '8.1 Muito bom',
        color: '#8B0000'
      },
      'AD': { 
        name: 'Azul', 
        logo: '/images/azul-logo.png',
        rating: '8.3 Excelente',
        color: '#003366'
      }
    }

    // Detectar usando startsWith - MÉTODO QUE FUNCIONOU
    if (flight && flight.startsWith('G3')) return companies['G3'];
    if (flight && flight.startsWith('LA')) return companies['LA'];
    if (flight && flight.startsWith('AD')) return companies['AD'];

    return { 
      name: 'Companhia Aérea', 
      logo: null,
      rating: '7.0 Bom',
      color: '#666'
    }
  }

  const calcDuration = (depart, arrive) => {
    if (!depart || !arrive) return ''
    const depTime = new Date(depart).getTime()
    const arrTime = new Date(arrive).getTime()
    const diff = arrTime - depTime
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const getAirportName = (code) => {
    const airports = {
      'VDC': { city: 'Vitória da Conquista', airport: 'Aeroporto Vitória Da Conquista' },
      'GRU': { city: 'São Paulo', airport: 'Aeroporto Internacional Guarulhos' },
      'GYN': { city: 'Goiânia', airport: 'Aeroporto Santa Genoveva' },
      'CGH': { city: 'São Paulo', airport: 'Aeroporto de Congonhas' },
      'SCL': { city: 'Santiago', airport: 'Aeroporto Internacional de Santiago' }
    }
    
    return airports[code] || { city: code, airport: `Aeroporto ${code}` }
  }

  const FlightCard = ({ voo, index }) => {
    const company = getCompanyData(voo.flight)
    const fromAirport = getAirportName(voo.from_city)
    const toAirport = getAirportName(voo.to_city)
    const [logoError, setLogoError] = useState(false)
    
    return (
      <div key={index} style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e5e5e5'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Sistema de fallback funcionando */}
            {company.logo && !logoError ? (
              <img 
                src={company.logo}
                alt={company.name}
                style={{ 
                  height: '40px',
                  maxWidth: '80px',
                  objectFit: 'contain'
                }}
                onError={() => setLogoError(true)}
              />
            ) : (
              <div style={{
                width: '60px',
                height: '40px',
                backgroundColor: company.color || '#666',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: '700'
              }}>
                {company.name.substring(0, 3).toUpperCase()}
              </div>
            )}
            <div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>
                {company.name}
              </div>
              <div style={{
                backgroundColor: '#00C853',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600',
                display: 'inline-block',
                marginTop: '4px'
              }}>
                {company.rating}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '14px', color: '#666' }}>
            <div>Voo N°: {voo.flight}</div>
            <div>Classe: Econômica</div>
          </div>
        </div>

        {/* Horários */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
              {formatDate(voo.depart_at)}
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#000', marginBottom: '4px' }}>
              {formatTime(voo.depart_at)}
            </div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#000', marginBottom: '2px' }}>
              {voo.from_city}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {fromAirport.city}
            </div>
            <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
              {fromAirport.airport}
            </div>
          </div>

          <div style={{ textAlign: 'center', flex: '0 0 auto', margin: '0 20px' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
              Duração
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>
              {calcDuration(voo.depart_at, voo.arrive_at)}
            </div>
            <div style={{
              height: '1px',
              backgroundColor: '#ddd',
              margin: '8px 0',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                right: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '8px',
                height: '8px',
                backgroundColor: '#ddd',
                borderRadius: '50%'
              }} />
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
              {formatDate(voo.arrive_at)}
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#000', marginBottom: '4px' }}>
              {formatTime(voo.arrive_at)}
            </div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#000', marginBottom: '2px' }}>
              {voo.to_city}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {toAirport.city}
            </div>
            <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
              {toAirport.airport}
            </div>
          </div>
        </div>

        {/* Mais detalhes */}
        <div style={{
          textAlign: 'center',
          paddingTop: '12px',
          borderTop: '1px solid #f0f0f0'
        }}>
          <div style={{
            color: '#6c5ce7',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Mais detalhes ˅
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div style={{
        maxWidth: '390px',
        margin: '0 auto',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #e5e5e5'
        }}>
          <button 
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              marginRight: '16px',
              color: '#333'
            }}
          >
            ←
          </button>
          <h1 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '600',
            color: '#333'
          }}>
            Detalhes do Voo
          </h1>
        </div>

        {/* Conteúdo */}
        <div style={{ padding: '20px' }}>
          {voosIda.map((voo, index) => (
            <FlightCard key={`ida-${index}`} voo={voo} index={index} />
          ))}

          {voosVolta.map((voo, index) => (
            <FlightCard key={`volta-${index}`} voo={voo} index={index + voosIda.length} />
          ))}

          {/* Duração total */}
          {voosVolta.length > 0 && (
            <div style={{
              backgroundColor: '#f0f0f0',
              padding: '16px',
              borderRadius: '8px',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>
                Duração total: {calcDuration(voosIda[0]?.depart_at, voosVolta[voosVolta.length - 1]?.arrive_at)}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                Horários em hora local de cada cidade
              </div>
            </div>
          )}

          {/* Bagagem */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
              Bagagem
            </h3>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {validSegments[0]?.baggage || 'Incluído uma mochila ou bolsa'}
            </div>
          </div>

          {/* Botão */}
          <button style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#50CFAD',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Baixar Voucher Original
          </button>
        </div>
      </div>
    </div>
  )
}
