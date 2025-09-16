import { fmt } from '../utils/formatters'

export default function FlightCard({ segment }) {
  return (
    <div style={{
      padding: '15px',
      backgroundColor: '#f5f5f5',
      marginBottom: '10px',
      borderRadius: '5px',
    }}>
      ✈️ Voo:{' '}
      {segment.from_city ?? segment.origin ?? segment.origin_raw} →{' '}
      {(segment.to_city ?? segment.destination ?? segment.destination_raw) || 'A definir'}
      <div style={{ fontSize: '14px', color: '#555', marginTop: '6px' }}>
        Nº {segment.flight} • {fmt(segment.depart_at)} → {fmt(segment.arrive_at)} •
        Bagagem: {segment.baggage || '—'}
      </div>
      <span style={{ float: 'right', color: 'green' }}>Confirmado</span>
    </div>
  )
}
