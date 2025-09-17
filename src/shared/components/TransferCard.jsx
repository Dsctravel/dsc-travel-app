export default function TransferCard({ transfer }) {
  return (
    <div style={{
      padding: "15px",
      backgroundColor: "#f5f5f5",
      marginBottom: "10px",
      borderRadius: "5px"
    }}>
      {transfer.date_in && (
        <>
          <div>🚗 Transfer IDA: {transfer.pickup_in} → {transfer.dropoff_in}</div>
          <div style={{fontSize: "14px", color: "#555", marginTop: "6px"}}>
            Data: {transfer.date_in} • Horário: {transfer.time_in}
          </div>
        </>
      )}
      {transfer.date_out && (
        <>
          <div style={{marginTop: "10px"}}>🚗 Transfer VOLTA: {transfer.pickup_out} → {transfer.dropoff_out}</div>
          <div style={{fontSize: "14px", color: "#555", marginTop: "6px"}}>
            Data: {transfer.date_out} • Horário: {transfer.time_out}
          </div>
        </>
      )}
      <div style={{fontSize: "14px", color: "#555", marginTop: "4px"}}>
        Passageiros: {transfer.passengers}
      </div>
      <span style={{float: "right", color: "green"}}>Confirmado</span>
    </div>
  )
}
