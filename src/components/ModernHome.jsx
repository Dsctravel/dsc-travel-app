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

  const nomeFamilia = nomePassageiro;
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
            {nomeFamilia}
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

            {proximoVoo ? (
              <div 
                onClick={() => onOpenDetails('voos')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  gap: '16px',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  backgroundColor: '#e8f0ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundImage: 'url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
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
                  backgroundColor: '#50CFAD',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
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
                padding: '16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                gap: '16px',
                opacity: 0.6
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  backgroundColor: '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  ✈️
                </div>
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

          <div style={{ position: 'relative', paddingLeft: '8px' }}>
            <div style={{
              position: 'absolute',
              left: '8px',
              top: '24px',
              bottom: '24px',
              width: '2px',
              backgroundColor: '#e0e0e0'
            }} />

            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '24px',
              position: 'relative',
              opacity: temHotel ? 1 : 0.4
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: temHotel ? '#50CFAD' : '#e0e0e0',
                position: 'absolute',
                left: '0',
                zIndex: 1
              }} />
              <div style={{
                marginLeft: '36px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                gap: '12px'
              }}>
                <div style={{ fontSize: '20px' }}>🏨</div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: temHotel ? '#1a1a1a' : '#999'
                  }}>
                    Hotel {destino}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#999',
                    marginTop: '2px'
                  }}>
                    {temHotel ? `Check-in ${dataProximoVoo}` : 'A definir'}
                  </div>
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#999',
                  fontWeight: '600'
                }}>
                  {temHotel ? 'CHECK-IN' : 'A DEFINIR'}
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '24px',
              position: 'relative',
              opacity: temTransfer ? 1 : 0.4
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: temTransfer ? '#50CFAD' : '#e0e0e0',
                position: 'absolute',
                left: '0',
                zIndex: 1
              }} />
              <div style={{
                marginLeft: '36px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                gap: '12px'
              }}>
                <div style={{ fontSize: '20px' }}>🚗</div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: temTransfer ? '#1a1a1a' : '#999'
                  }}>
                    Transfer Aeroporto → Hotel
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#999',
                    marginTop: '2px'
                  }}>
                    {temTransfer ? dataProximoVoo : 'A definir'}
                  </div>
                </div>
              </div>
            </div>

            {(temCityTour || temTransfer) && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '24px',
                position: 'relative',
                opacity: temCityTour ? 1 : 0.4
              }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: temCityTour ? '#50CFAD' : '#e0e0e0',
                  position: 'absolute',
                  left: '0',
                  zIndex: 1
                }} />
                <div style={{
                  marginLeft: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  gap: '12px'
                }}>
                  <div style={{ fontSize: '20px' }}>🎫</div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color: temCityTour ? '#1a1a1a' : '#999'
                    }}>
                      Passeio pela cidade
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#999',
                      marginTop: '2px'
                    }}>
                      {temCityTour ? 'Incluído' : 'A definir'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {temSeguro && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '24px',
                position: 'relative'
              }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: '#50CFAD',
                  position: 'absolute',
                  left: '0',
                  zIndex: 1
                }} />
                <div style={{
                  marginLeft: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  gap: '12px'
                }}>
                  <div style={{ fontSize: '20px' }}>🛡️</div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#1a1a1a'
                    }}>
                      Seguro Viagem
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#999',
                      marginTop: '2px'
                    }}>
                      Ativo
                    </div>
                  </div>
                </div>
              </div>
            )}
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
