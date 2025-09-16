  // Tela Home - Usar ModernHome
  if (tela === 'home') {
    return (
      <ModernHome 
        viagem={viagem} 
        onLogout={() => {
          setTela('login')
          setCodigo('')
          setViagem(null)
        }}
      />
    )
  }
  
  // Fallback para a home antiga (caso precise reverter)
  const { origem, destino } = getOrigemDestino()
