import { tokens } from '../styles/tokens'

export default function Timeline({ eventos, eventoAtual }) {
  return (
    <div style={{ 
      position: 'relative',
      padding: `${tokens.spacing.lg} 0`,
      marginTop: tokens.spacing.xl
    }}>
      {/* Linha vertical */}
      <div style={{
        position: 'absolute',
        left: '20px',
        top: '40px',
        bottom: '40px',
        width: '2px',
        backgroundColor: tokens.neutral[100]
      }} />
      
      {eventos.map((evento, index) => (
        <div key={index} style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: tokens.spacing.lg,
          position: 'relative'
        }}>
          {/* Círculo indicador */}
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: index <= eventoAtual ? tokens.colors.primary : tokens.neutral[300],
            position: 'absolute',
            left: '15px',
            zIndex: 1,
            transition: tokens.transitions.base
          }} />
          
          {/* Conteúdo */}
          <div style={{
            marginLeft: '50px',
            padding: tokens.spacing.md,
            backgroundColor: index === eventoAtual ? tokens.neutral.white : 'transparent',
            borderRadius: tokens.radius.md,
            boxShadow: index === eventoAtual ? tokens.shadows.sm : 'none',
            transition: tokens.transitions.base,
            width: '100%'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: tokens.spacing.sm
            }}>
              <span style={{ fontSize: '20px' }}>{evento.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontWeight: tokens.typography.weights.medium,
                  color: tokens.neutral[900],
                  fontSize: tokens.typography.sizes.base
                }}>
                  {evento.titulo}
                </div>
                <div style={{
                  color: tokens.neutral[500],
                  fontSize: tokens.typography.sizes.sm,
                  marginTop: '2px'
                }}>
                  {evento.data}
                </div>
              </div>
              {index <= eventoAtual && (
                <div style={{
                  padding: '4px 12px',
                  backgroundColor: tokens.colors.primary,
                  color: tokens.neutral.white,
                  borderRadius: tokens.radius.full,
                  fontSize: tokens.typography.sizes.xs,
                  fontWeight: tokens.typography.weights.medium
                }}>
                  ✓
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
