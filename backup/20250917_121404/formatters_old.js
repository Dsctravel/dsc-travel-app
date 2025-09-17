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

// Converter segment para formato de leg
const segmentToLeg = (segment) => ({
  depAirport: segment.from_city,
  arrAirport: segment.to_city,
  depUtc: segment.depart_at,
  arrUtc: segment.arrive_at,
  flight: segment.flight
});

const toMs = (isoString) => new Date(isoString).getTime();

// Construir trajetos (journeys) agrupando pernas por conexões
const buildJourneys = (legs, stopoverMs = 24 * 60 * 60 * 1000) => {
  const ordered = [...legs].sort((a, b) => toMs(a.depUtc) - toMs(b.depUtc));
  const journeys = [];
  let current = [];

  for (let i = 0; i < ordered.length; i++) {
    const leg = ordered[i];
    
    if (current.length === 0) {
      current.push(leg);
      continue;
    }

    const prev = current[current.length - 1];
    const isSameAirportChain = prev.arrAirport === leg.depAirport;
    const gapMs = toMs(leg.depUtc) - toMs(prev.arrUtc);
    const isConnection = isSameAirportChain && gapMs <= stopoverMs;

    if (isConnection) {
      current.push(leg);
    } else {
      journeys.push({ legs: current });
      current = [leg];
    }
  }

  if (current.length) journeys.push({ legs: current });
  return journeys;
};

// Status de uma perna em relação ao momento atual
const legStatus = (leg, nowMs) => {
  const dep = toMs(leg.depUtc);
  const arr = toMs(leg.arrUtc);
  
  if (nowMs >= arr) return 'completed';
  if (nowMs >= dep && nowMs < arr) return 'in_progress';
  return 'upcoming';
};

// Encontrar trajeto atual baseado no tempo
const getCurrentJourney = (journeys, now = new Date()) => {
  const nowMs = now.getTime();

  // 1. Se há perna em progresso, esse é o trajeto atual
  for (const journey of journeys) {
    if (journey.legs.some(leg => legStatus(leg, nowMs) === 'in_progress')) {
      return journey;
    }
  }

  // 2. Primeiro trajeto com perna futura
  for (const journey of journeys) {
    if (journey.legs.some(leg => legStatus(leg, nowMs) === 'upcoming')) {
      return journey;
    }
  }

  // 3. Todos concluídos - último trajeto
  return journeys[journeys.length - 1] || null;
};

export const getFinalDestination = (segments) => {
  if (!segments || !Array.isArray(segments)) return 'Destino';
  
  const validSegments = getValidSegments(segments);
  if (validSegments.length === 0) return 'Destino';
  
  // Converter segments para legs
  const legs = validSegments.map(segmentToLeg);
  
  // Construir trajetos
  const journeys = buildJourneys(legs);
  if (journeys.length === 0) return 'Destino';
  
  // Encontrar trajeto atual
  const currentJourney = getCurrentJourney(journeys);
  if (!currentJourney) return 'Destino';
  
  // Destino final é o último aeroporto do trajeto atual
  const lastLeg = currentJourney.legs[currentJourney.legs.length - 1];
  return mapCityCode(lastLeg.arrAirport);
};

export const getNextFlight = (segments) => {
  const validSegments = getValidSegments(segments);
  if (validSegments.length === 0) return null;
  
  const now = new Date();
  
  // Encontrar próximo voo que ainda não partiu
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
