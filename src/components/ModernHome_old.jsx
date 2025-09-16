import { fmt } from '../utils/formatters'

export default function ModernHome({ viagem, onLogout, onOpenDetails }) {
  console.log("Dados da viagem:", viagem)

  const getDestino = () => {
    if (!viagem?.destinations) return 'Santiago'
    return viagem.destinations.find(d => d === 'Santiago') || viagem.destinations[viagem.destinations.length - 1] || 'Santiago'
  }

  const getEventos = () => {
    const eventos = []
    
    // Adicionar TODOS os eventos com suas datas reais
    
    // Voos
    if (viagem?.segments) {
      viagem.segments.forEach((segment, index) => {
        eventos.push({
          tipo: 'voo',
          titulo: `Voo ${segment.from_city} → ${segment.to_city}`,
          subtitulo: `${segment.flight} • ${segment.airline || 'LATAM'}`,
          data: segment.depart_at,
          dataFormatada: fmt(segment.depart_at),
          status: index === 0 ? 'confirmado' : '',
          ativo: true,
          imagem: '✈️'
        })
      })
    }

    // Hotel
    if (viagem?.hotels) {
      viagem.hotels.forEach(hotel => {
        eventos.push({
          tipo: 'hotel',
          titulo: hotel.hotel_name,
          subtitulo: `Check-in ${hotel.check_in}`,
          data: hotel.check_in,
          dataFormatada: hotel.check_in,
          status: 'CHECK-IN',
          ativo: false,
          imagem: '🏨'
        })
      })
    }

    // Transfer
    if (viagem?.transfers) {
      viagem.transfers.forEach(transfer => {
        if (transfer.date_in) {
          eventos.push({
            tipo: 'transfer',
            titulo: 'Transfer Aeroporto → Hotel',
            subtitulo: transfer.date_in,
            data: transfer.date_in,
            dataFormatada: transfer.date_in,
            status: '',
            ativo: true,
            imagem: '🚗'
          })
        }
        if (transfer.date_out) {
          eventos.push({
            tipo: 'transfer',
            titulo: 'Transfer Hotel → Aeroporto',
            subtitulo: transfer.date_out,
            data: transfer.date_out,
            dataFormatada: transfer.date_out,
            status: '',
            ativo: true,
            imagem: '🚗'
          })
        }
      })
    }

    // Seguro
    if (viagem?.insurance) {
      viagem.insurance.forEach(seguro => {
        eventos.push({
          tipo: 'seguro',
          titulo: 'Seguro Viagem',
          subtitulo: seguro.company || 'Cobertura completa',
          data: viagem.travel_start,
          dataFormatada: `${viagem.travel_start} a ${viagem.travel_end}`,
          status: '',
          ativo: false,
          imagem: '🛡️'
        })
      })
    }

    // Ordenar por data
    eventos.sort((a, b) => {
      const dateA = new Date(a.data || '2025-01-01')
      const dateB = new Date(b.data || '2025-01-01')
      return dateA - dateB
    })

    return eventos
  }

  const destino = getDestino()
  const eventos = getEventos()
  const segundoNome = viagem?.family_name?.split(' ').pop() || 'Silva'

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '390px',
        margin: '0 auto',
        backgroundColor: 'white',
        minHeight: '100vh',
        position: 'relative',
        boxShadow: '0 0 40px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          height: '380px',
          position: 'relative',
          backgroundImage: `url('https://images.unsplash.com/photo-1541882860-4de8a75228e8?w=800')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)'
          }} />
          
          <div style={{
            position: 'relative',
            padding: '50px 20px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              color: 'white',
              fontSize: '24px',
              fontWeight: '600',
              letterSpacing: '1px'
            }}>
              DSC
            </div>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              👤
            </div>
          </div>
        </div>

        <div style={{
          margin: '-120px 20px 20px',
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          position: 'relative'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '8px',
            color: '#1a1a1a'
          }}>
            Viagem a {destino}
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#666',
            marginBottom: '32px'
          }}>
            Família {segundoNome}
          </p>

          <div style={{ marginBottom: '32px' }}>
            <p style={{
              fontSize: '13px',
              color: '#999',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '16px',
              fontWeight: '600'
            }}>
              Próxima etapa
            </p>

            {eventos[0] && (
              console.log("Clicou no voo!");
              <div  style={{
                display: "flex", cursor: "pointer",
                alignItems: 'center',
                padding: '16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                gap: '16px'
              }}>
                <div  style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  backgroundColor: '#e8f0ff',
                  display: "flex", cursor: "pointer",
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  {eventos[0].imagem}
                </div>
                <div  style={{ flex: 1 }}>
                  <div  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '4px'
                  }}>
                    {eventos[0].titulo}
                  </div>
                  <div  style={{
                    fontSize: '14px',
                    color: '#666'
                  }}>
                    {eventos[0].dataFormatada}
                  </div>
                </div>
                {eventos[0].status && (
              </div>
            )}
            <button
              onClick={() => onOpenDetails?.("voos")}
              style={{
                marginTop: "10px",
                padding: "8px 16px",
                backgroundColor: "transparent",
                color: "#50CFAD",
                border: "1px solid #50CFAD",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              Ver todos os voos →
            </button>
            {eventos[0].status && (
              <div style={{ display: "none" }}>
                  <div  style={{
                    backgroundColor: '#50CFAD',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {eventos[0].status}
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ position: 'relative', paddingLeft: '8px', maxHeight: '400px', overflowY: 'auto' }}>
            <div  style={{
              position: 'absolute',
              left: '8px',
              top: '24px',
              bottom: '24px',
              width: '2px',
              backgroundColor: '#e0e0e0'
            }} />

            {eventos.slice(1).map((evento, index) => (
              <div key={index} style={{
                display: "flex", cursor: "pointer",
                alignItems: 'center',
                marginBottom: '24px',
                position: 'relative'
              }}>
                <div  style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: evento.ativo ? '#50CFAD' : '#e0e0e0',
                  position: 'absolute',
                  left: '0',
                  zIndex: 1
                }} />

                <div  style={{
                  marginLeft: '36px',
                  display: "flex", cursor: "pointer",
                  alignItems: 'center',
                  width: '100%',
                  gap: '12px'
                }}>
                  <div style={{ fontSize: '20px' }}>{evento.imagem}</div>
                  <div style={{ flex: 1 }}>
                    <div  style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#1a1a1a'
                    }}>
                      {evento.titulo}
                    </div>
                    <div  style={{
                      fontSize: '13px',
                      color: '#999',
                      marginTop: '2px'
                    }}>
                      {evento.subtitulo}
                    </div>
                  </div>
                  {evento.status && (
                    <div  style={{
                      fontSize: '11px',
                      color: '#999',
                      fontWeight: '600'
                    }}>
                      {evento.status}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '0 20px 20px' }}>
          <button
            onClick={onLogout}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#f0f0f0',
              border: 'none',
              borderRadius: '12px',
              color: '#666',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  )
}
