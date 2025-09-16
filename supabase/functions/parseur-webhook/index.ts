import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const supabase = createClient('https://tpiuxtlzsaoojedbmopy.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwaXV4dGx6c2Fvb2plZGJtb3B5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTgwMDAxNSwiZXhwIjoyMDcxMzc2MDE1fQ.OhVbMZ87TQhdG-igbCmzj2Stxsy2seQrnOpez6b9bfc');

// utilitários para este fix
function sanitizeKeys(o) {
  if (Array.isArray(o)) return o.map(sanitizeKeys);
  if (o && typeof o === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(o)){
      const kk = typeof k === 'string' ? k.trim() : k;
      out[kk] = sanitizeKeys(v);
    }
    return out;
  }
  return o;
}

function get(obj, keys) {
  for (const k of keys){
    const direct = obj[k];
    if (direct !== undefined && direct !== null && String(direct).trim() !== '') return direct;
    const trimmed = typeof k === 'string' ? obj[k.trim()] : undefined;
    if (trimmed !== undefined && trimmed !== null && String(trimmed).trim() !== '') return trimmed;
  }
  return null;
}

function normalizeName(name) {
  if (!name) return '';
  return name.toUpperCase().replace(/\s+(DE|DA|DO|DOS|DAS)\s+/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractMonthYear(payload) {
  let dateStr = null;
  if (payload.departure_raw) dateStr = payload.departure_raw;
  else if (payload.check_in) dateStr = payload.check_in;
  else if (payload.transfer_date) dateStr = payload.transfer_date;
  else if (payload.transfer_date_in) dateStr = payload.transfer_date_in;
  else if (payload.coverage_start) dateStr = payload.coverage_start;
  else if (payload.tour_date) dateStr = payload.tour_date;
  else if (payload.flights?.[0]?.departure_raw) dateStr = payload.flights[0].departure_raw;
  
  if (!dateStr) return null;
  const match = dateStr.match(/(\d{2})\/(\d{4})/);
  if (match) {
    return `${match[1]}_${match[2]}`;
  }
  return null;
}

async function findMatchingTrip(payload) {
  const name = normalizeName(payload.customer_name || payload.guest_name || payload.passenger_name || payload.insured_name);
  if (!name) return null;
  
  const monthYear = extractMonthYear(payload);
  console.log(`Buscando correlação: Nome="${name}", Período="${monthYear}"`);
  
  const { data: candidates, error } = await supabase.from('trips_v2').select('*').ilike('family_name', `%${name.split(' ')[0]}%`).order('created_at', {
    ascending: false
  }).limit(10);
  
  if (error) {
    console.error('Erro na busca:', error);
    return null;
  }
  
  if (!candidates || candidates.length === 0) {
    console.log('Nenhum candidato encontrado');
    return null;
  }
  
  if (monthYear) {
    for (const trip of candidates){
      let tripMonthYear = null;
      if (trip.segments && trip.segments.length > 0) {
        const segment = trip.segments[0];
        if (segment.depart_at) {
          const date = new Date(segment.depart_at);
          tripMonthYear = `${String(date.getMonth() + 1).padStart(2, '0')}_${date.getFullYear()}`;
        }
      }
      
      if (!tripMonthYear && trip.hotels && trip.hotels.length > 0) {
        const hotel = trip.hotels[0];
        if (hotel.check_in) {
          const match = hotel.check_in.match(/(\d{2})\/(\d{4})/);
          if (match) tripMonthYear = `${match[1]}_${match[2]}`;
        }
      }
      
      if (tripMonthYear === monthYear) {
        console.log(`Match encontrado! PNR: ${trip.pnr}`);
        return trip;
      }
    }
  }
  
  const sameNameTrip = candidates.find((t)=>normalizeName(t.family_name) === name);
  if (sameNameTrip) {
    console.log(`Match por nome exato: ${sameNameTrip.pnr}`);
    return sameNameTrip;
  }
  
  console.log('Nenhum match encontrado');
  return null;
}

function createFlightsHash(flights) {
  if (!flights || flights.length === 0) return '';
  return flights.map((f)=>`${f.flight}_${f.from_city}_${f.to_city}_${f.depart_at}`).sort().join('|');
}

function createHotelHash(hotel) {
  return `${hotel.hotel_name}_${hotel.check_in}_${hotel.check_out}`;
}

Deno.serve(async (req)=>{
  try {
    const rawPayload = await req.json();
    const payload = sanitizeKeys(rawPayload);
    console.log('=== NOVO WEBHOOK ===');
    
    let productType = 'UNKNOWN';
    if (payload.hotel_name || payload.check_in) productType = 'HOTEL';
    else if (payload.flights && payload.flights.length > 0) productType = 'VOO';
    else if (payload.transfer_type || payload.pickup_location || payload.pickup_location_in) productType = 'TRANSFER';
    else if (payload.insurance_company || payload.policy_number) productType = 'SEGURO';
    else if (payload.tour_name || payload.tour_date) productType = 'PASSEIO';
    else if (payload.rental_company || payload.pickup_date) productType = 'CARRO';
    
    console.log('Tipo:', productType);
    console.log('Cliente:', payload.customer_name || payload.guest_name || payload.passenger_name || payload.insured_name);
    
    const { data: webhookLog, error: logError } = await supabase.from('webhook_logs').insert({
      source: 'parseur',
      payload: rawPayload,
      processed: false
    }).select().single();
    
    if (logError) throw logError;
    
    const existingTrip = await findMatchingTrip(payload);
    let pnr;
    
    if (existingTrip) {
      pnr = existingTrip.pnr;
      console.log(`Usando PNR existente: ${pnr}`);
    } else {
      pnr = payload.pnr || payload.booking_code || payload.confirmation_number;
      if (!pnr) {
        pnr = `AUTO_${Date.now()}`;
      }
      console.log(`Criando novo PNR: ${pnr}`);
    }
    
    let tripData = {
      pnr: pnr,
      status: 'active'
    };
    
    if (existingTrip) {
      tripData = {
        ...tripData,
        hotels: existingTrip.hotels || [],
        segments: existingTrip.segments || [],
        passengers: existingTrip.passengers || [],
        transfers: existingTrip.transfers || [],
        insurance: existingTrip.insurance || [],
        tours: existingTrip.tours || [],
        car_rental: existingTrip.car_rental || [],
        family_name: existingTrip.family_name,
        locator: existingTrip.locator
      };
    }
    
    if (productType === 'HOTEL') {
      const hotelData = {
        hotel_name: payload.hotel_name,
        check_in: payload.check_in,
        check_out: payload.check_out,
        room_type: payload.room_type,
        address: payload.address,
        guest_name: payload.guest_name || payload.customer_name
      };
      
      const hotelHash = createHotelHash(hotelData);
      const existingHotels = tripData.hotels || [];
      const hotelExists = existingHotels.some((h)=>createHotelHash(h) === hotelHash);
      
      if (!hotelExists) {
        tripData.hotels = [
          ...existingHotels,
          hotelData
        ];
        console.log(`Hotel adicionado: ${hotelData.hotel_name}`);
      } else {
        console.log(`Hotel já existe: ${hotelData.hotel_name}`);
      }
      
      if (!existingTrip) {
        tripData.locator = payload.booking_code;
        tripData.family_name = payload.guest_name || payload.customer_name;
        tripData.passengers = [
          {
            name: payload.guest_name || payload.customer_name,
            type: 'ADT'
          }
        ];
      }
    } else if (productType === 'TRANSFER') {
      const transferData = {
        type: get(payload, [
          'transfer_type'
        ]) || null,
        pickup_in: get(payload, [
          'pickup_location_in',
          'pickup_in',
          'pickup_location'
        ]) || null,
        dropoff_in: get(payload, [
          'dropoff_location_in',
          'dropoff_in'
        ]) || null,
        date_in: get(payload, [
          'transfer_date_in',
          'date_in'
        ]) || null,
        time_in: get(payload, [
          'transfer_time_in',
          'time_in'
        ]) || null,
        pickup_out: get(payload, [
          'pickup_location_out'
        ]) || null,
        dropoff_out: get(payload, [
          'dropoff_location_out',
          'dropoff_out'
        ]) || null,
        date_out: get(payload, [
          'transfer_date_out',
          'date_out'
        ]) || null,
        time_out: get(payload, [
          'transfer_time_out',
          'time_out'
        ]) || null,
        passengers: get(payload, [
          'transfer_passengers',
          'passengers'
        ]) || null,
        confirmation: get(payload, [
          'transfer_confirmation',
          'booking_code',
          'confirmation_number'
        ]) || null
      };
      
      console.log('TransferData criado:', JSON.stringify(transferData));
      
      const existingTransfers = tripData.transfers || [];
      const transferExists = existingTransfers.some((t)=>t.confirmation === transferData.confirmation);
      
      if (!transferExists) {
        tripData.transfers = [
          ...existingTransfers,
          transferData
        ];
        console.log('Transfer adicionado com todos os campos');
      } else {
        tripData.transfers = existingTransfers.map((t)=>t.confirmation === transferData.confirmation ? {
            ...t,
            ...Object.fromEntries(Object.entries(transferData).filter(([, v])=>v !== null))
          } : t);
        console.log('Transfer existente atualizado (merge não-nulo)');
      }
      
      if (!existingTrip) {
        tripData.locator = transferData.confirmation || payload.transfer_confirmation || payload.booking_code || payload.confirmation_number || 'TRANSFER';
        tripData.family_name = payload.customer_name || payload.passenger_name;
        tripData.passengers = [
          {
            name: payload.customer_name || payload.passenger_name,
            type: 'ADT'
          }
        ];
      }
    } else if (productType === 'SEGURO') {
      const insuranceData = {
        company: payload.insurance_company,
        policy: payload.policy_number,
        coverage: payload.coverage_type,
        start_date: payload.coverage_start,
        end_date: payload.coverage_end,
        insured_name: payload.insured_name || payload.customer_name,
        value: payload.coverage_value
      };
      
      const existingInsurance = tripData.insurance || [];
      const insuranceExists = existingInsurance.some((i)=>i.policy === insuranceData.policy);
      
      if (!insuranceExists) {
        tripData.insurance = [
          ...existingInsurance,
          insuranceData
        ];
        console.log('Seguro adicionado');
      } else {
        console.log('Seguro já existe');
      }
      
      if (!existingTrip) {
        tripData.locator = payload.policy_number || 'SEGURO';
        tripData.family_name = payload.insured_name || payload.customer_name;
        tripData.passengers = [
          {
            name: payload.insured_name || payload.customer_name,
            type: 'ADT'
          }
        ];
      }
    } else if (productType === 'PASSEIO') {
      const tourData = {
        tour_name: payload.tour_name,
        date: payload.tour_date,
        time: payload.tour_time,
        duration: payload.tour_duration,
        location: payload.tour_location,
        confirmation: payload.tour_confirmation || payload.confirmation_number,
        participants: payload.participants || 1
      };
      
      const existingTours = tripData.tours || [];
      const tourExists = existingTours.some((t)=>t.confirmation === tourData.confirmation || t.tour_name === tourData.tour_name && t.date === tourData.date);
      
      if (!tourExists) {
        tripData.tours = [
          ...existingTours,
          tourData
        ];
        console.log('Passeio adicionado');
      } else {
        console.log('Passeio já existe');
      }
      
      if (!existingTrip) {
        tripData.locator = payload.tour_confirmation || payload.confirmation_number || 'PASSEIO';
        tripData.family_name = payload.customer_name || payload.passenger_name;
        tripData.passengers = [
          {
            name: payload.customer_name || payload.passenger_name,
            type: 'ADT'
          }
        ];
      }
    } else if (productType === 'CARRO') {
      const carData = {
        rental_company: payload.rental_company,
        car_model: payload.car_model,
        pickup_date: payload.pickup_date,
        pickup_location: payload.pickup_location,
        return_date: payload.return_date,
        return_location: payload.return_location,
        confirmation: payload.rental_confirmation || payload.confirmation_number
      };
      
      const existingCars = tripData.car_rental || [];
      const carExists = existingCars.some((c)=>c.confirmation === carData.confirmation);
      
      if (!carExists) {
        tripData.car_rental = [
          ...existingCars,
          carData
        ];
        console.log('Aluguel de carro adicionado');
      } else {
        console.log('Aluguel de carro já existe');
      }
      
      if (!existingTrip) {
        tripData.locator = payload.rental_confirmation || payload.confirmation_number || 'CARRO';
        tripData.family_name = payload.customer_name || payload.renter_name;
        tripData.passengers = [
          {
            name: payload.customer_name || payload.renter_name,
            type: 'ADT'
          }
        ];
      }
    } else if (productType === 'VOO') {
      const parseDate = (dateStr)=>{
        if (!dateStr) return null;
        try {
          const [date, time] = dateStr.split(' ');
          const [day, month, year] = date.split('/');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${time}:00Z`;
        } catch (e) {
          console.error('Erro ao parsear data:', dateStr, e);
          return null;
        }
      };
      
      const segments = payload.flights?.filter((f)=>f.flight_number && f.flight_number !== 'Voo')?.map((f)=>({
          pnr: f.booking_pnr,
          flight: f.flight_number,
          from_city: (f.origin_raw || '').split(' - ')[0].trim(),
          to_city: (f.destination_raw || '').split(' - ')[0].trim(),
          depart_at: parseDate(f.departure_raw),
          arrive_at: parseDate(f.arrival_raw),
          baggage: f.baggage_raw
        })) || [];
      
      if (!segments || segments.length === 0) {
        console.log('Nenhum voo válido para processar');
      } else {
        const existingSegments = tripData.segments || [];
        const newFlightsHash = createFlightsHash(segments);
        const existingFlightsHash = createFlightsHash(existingSegments);
        
        console.log(`Hash voos novos: ${newFlightsHash.substring(0, 50)}...`);
        console.log(`Hash voos existentes: ${existingFlightsHash.substring(0, 50)}...`);
        
        if (newFlightsHash === existingFlightsHash) {
          console.log('Conjunto idêntico de voos já existe, ignorando completamente');
          tripData.segments = existingSegments;
        } else {
          const uniqueNewSegments = segments.filter((newSeg)=>{
            const exists = existingSegments.some((existSeg)=>existSeg.flight === newSeg.flight && existSeg.from_city === newSeg.from_city && existSeg.to_city === newSeg.to_city && existSeg.depart_at === newSeg.depart_at);
            if (exists) {
              console.log(`Voo duplicado ignorado: ${newSeg.flight} ${newSeg.from_city}->${newSeg.to_city} ${newSeg.depart_at}`);
            }
            return !exists;
          });
          
          if (uniqueNewSegments.length > 0) {
            tripData.segments = [
              ...existingSegments,
              ...uniqueNewSegments
            ];
            console.log(`${uniqueNewSegments.length} novos voos adicionados de ${segments.length} recebidos`);
            uniqueNewSegments.forEach((s)=>{
              console.log(`  + ${s.flight}: ${s.from_city} → ${s.to_city}`);
            });
          } else {
            tripData.segments = existingSegments;
            console.log('Nenhum voo novo para adicionar');
          }
        }
      }
      
      if (!existingTrip) {
        tripData.locator = payload.ticket_number;
        // FIX: Mapear insured_name para family_name nos voos
        tripData.family_name = payload.insured_name || payload.customer_name;
        tripData.passengers = [
          {
            // FIX: Mapear insured_name para name nos voos
            name: payload.insured_name || payload.customer_name,
            type: 'ADT'
          }
        ];
      } else {
        // FIX: Mapear insured_name para newName nos voos
        const newName = payload.insured_name || payload.customer_name;
        const existingNames = (tripData.passengers || []).map((p)=>p.name);
        if (newName && !existingNames.includes(newName)) {
          tripData.passengers = [
            ...tripData.passengers,
            {
              name: newName,
              type: 'ADT'
            }
          ];
        }
      }
    }
    
    const monthYear = extractMonthYear(payload);
    if (monthYear && !existingTrip) {
      const [month, year] = monthYear.split('_');
      tripData.travel_start = new Date(year, month - 1, 1);
      tripData.travel_end = new Date(year, month - 1, 30);
    }
    
    if (!tripData.segments) tripData.segments = [];
    if (!tripData.hotels) tripData.hotels = [];
    if (!tripData.transfers) tripData.transfers = [];
    if (!tripData.insurance) tripData.insurance = [];
    if (!tripData.tours) tripData.tours = [];
    if (!tripData.car_rental) tripData.car_rental = [];
    
    if (!tripData.locator) {
      tripData.locator = pnr || 'DEFAULT';
    }
    
    console.log(`Salvando viagem ${pnr}...`);
    const { error: tripError } = await supabase.from('trips_v2').upsert(tripData, {
      onConflict: 'pnr'
    });
    
    if (tripError) throw tripError;
    
    await supabase.from('webhook_logs').update({
      processed: true,
      processed_at: new Date().toISOString()
    }).eq('id', webhookLog.id);
    
    const resultado = existingTrip ? 'CORRELACIONADO' : 'NOVO';
    console.log(`✅ Sucesso! Viagem ${pnr} - ${resultado}`);
    
    return new Response(JSON.stringify({
      success: true,
      pnr: pnr,
      type: productType.toLowerCase(),
      correlated: !!existingTrip
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    console.error('❌ Erro:', error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 500
    });
  }
});
