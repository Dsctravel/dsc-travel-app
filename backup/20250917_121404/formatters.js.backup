export const asArray = (v) => {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    try { return JSON.parse(v) } catch { return [] }
  }
  return v ?? [];
};

export const fmt = (v) =>
  v
    ? new Date(v).toLocaleString('pt-BR', {
        timeZone: 'UTC',
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—'

export const formatTime = (isoString) => {
  if (!isoString) return '--:--';
  
  try {
    const timePart = isoString.split('T')[1]?.split(':');
    if (!timePart || timePart.length < 2) return '--:--';
    
    const hours = timePart[0];
    const minutes = timePart[1];
    
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error('Erro ao formatar horário:', error);
    return '--:--';
  }
};

export const formatDate = (isoString) => {
  if (!isoString) return '';
  
  try {
    const datePart = isoString.split('T')[0];
    const [year, month, day] = datePart.split('-');
    
    const months = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    
    const monthName = months[parseInt(month, 10) - 1];
    return `${parseInt(day, 10)} de ${monthName}`;
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return '';
  }
};

export const getValidSegments = (segments) => {
  if (!Array.isArray(segments)) return [];
  
  return segments.filter(segment => 
    segment.flight && 
    segment.flight !== 'Cartão de Fidelidade' &&
    segment.depart_at &&
    segment.arrive_at &&
    segment.from_city &&
    segment.to_city &&
    !segment.to_city.toLowerCase().includes('ginecologista') &&
    !segment.to_city.toLowerCase().includes('especialista') &&
    segment.from_city.length <= 10 &&
    segment.to_city.length <= 10
  );
};

export const getFinalDestination = (segments) => {
  if (!segments || !Array.isArray(segments)) return 'Destino';
  
  const validSegments = getValidSegments(segments);
  if (validSegments.length === 0) return 'Destino';
  
  const sortedSegments = [...validSegments].sort((a, b) => 
    new Date(a.depart_at) - new Date(b.depart_at)
  );
  
  const now = new Date();
  const lastFlight = sortedSegments[sortedSegments.length - 1];
  const finalArrival = new Date(lastFlight.arrive_at);
  
  // Se a viagem completa já terminou, mostrar destino final onde chegou
  if (now > finalArrival) {
    const finalCode = lastFlight.to_city;
    return mapCityCode(finalCode);
  }
  
  // Se ainda está na viagem ou não começou, mostrar destino da ida
  const midPoint = Math.ceil(sortedSegments.length / 2);
  const outboundDestination = sortedSegments[midPoint - 1].to_city;
  return mapCityCode(outboundDestination);
};

const mapCityCode = (code) => {
  const cityMap = {
    'GYN': 'Goiânia',
    'SCL': 'Santiago',
    'GRU': 'São Paulo',
    'VDC': 'Vitória da Conquista',
    'CGH': 'São Paulo',
    'SSA': 'Salvador',
    'CNF': 'Belo Horizonte'
  };
  return cityMap[code] || code;
};

export const getNextFlight = (segments) => {
  const validSegments = getValidSegments(segments);
  if (validSegments.length === 0) return null;
  
  const now = new Date();
  
  const upcomingFlight = validSegments.find(segment => {
    const departureDate = new Date(segment.depart_at);
    return departureDate > now;
  });
  
  return upcomingFlight || validSegments[0];
};

export const getPassengerName = (viagem) => {
  if (viagem?.family_name) {
    return viagem.family_name;
  }
  
  if (viagem?.passengers && Array.isArray(viagem.passengers)) {
    const passengerWithName = viagem.passengers.find(p => p.name);
    if (passengerWithName) {
      return passengerWithName.name;
    }
  }
  
  if (viagem?.segments && Array.isArray(viagem.segments)) {
    const validSegments = getValidSegments(viagem.segments);
    for (const segment of validSegments) {
      if (segment.passenger_name && segment.passenger_name.length > 3) {
        return segment.passenger_name;
      }
    }
  }
  
  return 'Passageiro';
};

export const hasHotel = (viagem) => {
  return Array.isArray(viagem?.hotels) && viagem.hotels.length > 0;
};

export const hasTransfer = (viagem) => {
  return Array.isArray(viagem?.transfers) && viagem.transfers.length > 0;
};

export const hasCityTour = (viagem) => {
  if (!hasTransfer(viagem)) return false;
  
  return viagem.transfers.some(transfer => 
    transfer.type?.toLowerCase().includes('city tour') ||
    transfer.service?.toLowerCase().includes('city tour') ||
    transfer.description?.toLowerCase().includes('city tour') ||
    transfer.name?.toLowerCase().includes('city tour')
  );
};

export const hasInsurance = (viagem) => {
  return Array.isArray(viagem?.insurance) && viagem.insurance.length > 0;
};
