export default function FlightDetails({ viagem, onBack }) {
  if (!viagem?.segments) return null

  const formatTime = (datetime) => {
    if (!datetime) return '--:--'
    // Extrair apenas HH:MM do formato ISO
    const match = datetime.match(/T(\d{2}):(\d{2})/)
    if (match) return `${match[1]}:${match[2]}`
    
    // Fallback para Date se não for ISO
    const date = new Date(datetime)
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  const formatDate = (datetime) => {
    if (!datetime) return ''
    // Para "2025-09-17T04:25:00" retornar "17 de setembro"
    const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
    const match = datetime.match(/(\d{4})-(\d{2})-(\d{2})/)
    if (match) {
      const day = parseInt(match[3])
      const month = months[parseInt(match[2]) - 1]
      return `${day} de ${month}`
    }
    return ''
  }
