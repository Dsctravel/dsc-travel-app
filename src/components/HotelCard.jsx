export default function HotelCard({ hotel }) {
  return (
    <div style={{
      padding: "15px",
      backgroundColor: "#f5f5f5",
      marginBottom: "10px",
      borderRadius: "5px"
    }}>
      <div>🏨 Hotel: {hotel.hotel_name}</div>
      <div style={{fontSize: "14px", color: "#555", marginTop: "6px"}}>
        📍 {hotel.address}
      </div>
      <div style={{fontSize: "14px", color: "#555", marginTop: "6px"}}>
        Check-in: {hotel.check_in} • Check-out: {hotel.check_out} • Quarto: {hotel.room_type}
      </div>
      <span style={{float: "right", color: "green"}}>Confirmado</span>
    </div>
  )
}
