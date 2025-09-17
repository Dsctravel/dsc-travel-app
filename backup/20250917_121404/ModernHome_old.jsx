import { 
  formatDate, 
  getFinalDestination, 
  getNextFlight, 
  getPassengerName,
  hasHotel,
  hasTransfer,
  hasCityTour,
  hasInsurance
} from '../utils/formatters'
import { useState } from 'react'

export default function ModernHome({ viagem, onLogout, onOpenDetails = () => {} }) {
  console.log("Dados da viagem:", viagem)

  const destino = getFinalDestination(viagem?.segments);
  const nomePassageiro = getPassengerName(viagem);
  const proximoVoo = getNextFlight(viagem?.segments);
  const dataProximoVoo = proximoVoo ? formatDate(proximoVoo.depart_at) : '';
  
  const temHotel = hasHotel(viagem);
  const temTransfer = hasTransfer(viagem);
  const temCityTour = hasCityTour(viagem);
  const temSeguro = hasInsurance(viagem);

  // Sistema de imagens dinâmicas por destino
  const getDestinationImage = (destination) => {
    const imageMap = {
      'GYN': '/images/goiania_1200x600.jpg',
      'SCL': '/images/santiago_1200x600.jpg',
      'GRU': '/images/sao_paulo_1200x600.jpg',
      'VDC': '/images/aviao_asa_1200x600.jpg',
      'SSA': '/images/salvador_1200x600.jpg',
      'CNF': '/images/belo_horizonte_1200x600.jpg',
      'Goiânia': '/images/goiania_1200x600.jpg',
      'Santiago': '/images/santiago_1200x600.jpg',
      'São Paulo': '/images/sao_paulo_1200x600.jpg',
      'Vitória da Conquista': '/images/aviao_asa_1200x600.jpg',
      'Salvador': '/images/salvador_1200x600.jpg',
      'Belo Horizonte': '/images/belo_horizonte_1200x600.jpg'
    };
    
    return imageMap[destination] || '/images/aviao_asa_1200x600.jpg';
  };

  const cityImage = getDestinationImage(destino);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
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
          height: '300px',
          position: 'relative',
          backgroundImage: `url('${cityImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)'
          }} />
          
          <div style={{
            position: 'relative',
            padding: '40px 24px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              color: 'white',
              fontSize: '20px',
              fontWeight: '700',
              letterSpacing: '1px'
            }}>
              DSC
            </div>
            <div style={{
              width: '32px',
              height: '32px',
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
          margin: '-80px 24px 24px',
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px 24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          position: 'relative'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '8px',
            color: '#09077d',
            fontFamily: 'serif',
            lineHeight: '1.2'
          }}>
            Viagem a {destino}
          </h1>
          
          <p style={{
            fontSize: '14px',
            color: '#09077d',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '24px'
          }}>
            {nomePassageiro}
          </p>

          <div style={{ marginBottom: '32px' }}>
            <p style={{
              fontSize: '11px',
              color: '#50cfad',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '16px',
              fontWeight: '600'
            }}>
              Próxima etapa
            </p>

            {proximoVoo ? (
              <div 
                onClick={() => onOpenDetails('voos')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px 20px',
                  backgroundColor: '#f8fffe',
                  borderRadius: '12px',
                  gap: '16px',
                  cursor: 'pointer',
                  border: '1px solid #e8f5f3'
                }}
              >
                <div style={{
                  fontSize: '20px',
                  color: '#50cfad'
                }}>
                  ✈️
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '4px'
                  }}>
                    Voo de Ida
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#666'
                  }}>
                    {dataProximoVoo || 'Data a definir'}
                  </div>
                </div>
                <div style={{
                  backgroundColor: '#50cfad',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  Confirmado
                </div>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                gap: '16px',
                opacity: 0.6
              }}>
                <div style={{ fontSize: '20px', color: '#999' }}>✈️</div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#999',
                    marginBottom: '4px'
                  }}>
                    Voo
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#999'
                  }}>
                    A definir
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Timeline dos produtos */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: '10px',
              top: '20px',
              bottom: '20px',
              width: '2px',
              backgroundColor: '#e8f5f3'
            }} />

            {/* Transfer */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '24px',
              position: 'relative'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: temTransfer ? '#50cfad' : '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1,
                marginRight: '16px'
              }}>
                <div style={{ fontSize: '10px', color: 'white' }}>🚖</div>
              </div>
              <div style={{ flex: 1, paddingTop: '2px' }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: temTransfer ? '#333' : '#999',
                  marginBottom: '4px'
                }}>
                  Transfer Aeroporto → Hotel
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#666'
                }}>
                  {temTransfer ? dataProximoVoo : '24 de setembro'}
                </div>
              </div>
            </div>

            {/* Hotel */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '24px',
              position: 'relative'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: temHotel ? '#50cfad' : '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1,
                marginRight: '16px'
              }}>
                <div style={{ fontSize: '10px', color: 'white' }}>🏨</div>
              </div>
              <div style={{ flex: 1, paddingTop: '2px' }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: temHotel ? '#333' : '#999',
                  marginBottom: '4px'
                }}>
                  Hotel {destino}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#666'
                }}>
                  {temHotel ? `Check-in ${dataProximoVoo}` : 'Check-in 24 de setembro'}
                </div>
              </div>
            </div>

            {/* Passeio */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '24px',
              position: 'relative'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: temCityTour ? '#50cfad' : '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1,
                marginRight: '16px'
              }}>
                <div style={{ fontSize: '10px', color: 'white' }}>🏛️</div>
              </div>
              <div style={{ flex: 1, paddingTop: '2px' }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: temCityTour ? '#333' : '#999',
                  marginBottom: '4px'
                }}>
                  Passeio pela cidade
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#666'
                }}>
                  {temCityTour ? 'Incluído' : 'A definir'}
                </div>
              </div>
            </div>

            {/* Seguro */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '8px',
              position: 'relative'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: temSeguro ? '#50cfad' : '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1,
                marginRight: '16px'
              }}>
                <div style={{ fontSize: '10px', color: 'white' }}>🛡️</div>
              </div>
              <div style={{ flex: 1, paddingTop: '2px' }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: temSeguro ? '#333' : '#999',
                  marginBottom: '4px'
                }}>
                  Seguro Viagem
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#666'
                }}>
                  {temSeguro ? 'Ativo' : 'A definir'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '0 24px 24px' }}>
          <button
            onClick={onLogout}
            style={{
              width: '100%',
              padding: '16px',
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
