import { tokens } from '../styles/tokens'

export default function HeaderModern({ destino, imagem, usuario }) {
  return (
    <div style={{
      position: 'relative',
      height: '280px',
      marginTop: '-20px',
      marginLeft: '-20px',
      marginRight: '-20px',
      borderRadius: `0 0 ${tokens.radius.lg} ${tokens.radius.lg}`,
      overflow: 'hidden'
    }}>
      {/* Imagem de fundo */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${imagem || 'https://images.unsplash.com/photo-1541882860-4de8a75228e8?w=800'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} />
      
      {/* Overlay gradiente */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)'
      }} />
      
      {/* Conteúdo */}
      <div style={{
        position: 'relative',
        height: '100%',
        padding: tokens.spacing.xl,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        {/* Top bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            fontSize: tokens.typography.sizes.xl,
            fontWeight: tokens.typography.weights.bold,
            color: tokens.neutral.white
          }}>
            DSC
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: tokens.neutral.white,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            👤
          </div>
        </div>
        
        {/* Título */}
        <div>
          <h1 style={{
            margin: 0,
            fontSize: tokens.typography.sizes.hero,
            fontWeight: tokens.typography.weights.bold,
            color: tokens.neutral.white,
            marginBottom: tokens.spacing.sm
          }}>
            Viagem a {destino}
          </h1>
          <p style={{
            margin: 0,
            fontSize: tokens.typography.sizes.lg,
            color: 'rgba(255,255,255,0.9)'
          }}>
            {usuario}
          </p>
        </div>
      </div>
    </div>
  )
}
