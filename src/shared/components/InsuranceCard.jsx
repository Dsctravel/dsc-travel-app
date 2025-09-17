export default function InsuranceCard({ insurance }) {
  return (
    <div style={{
      padding: "15px",
      backgroundColor: "#f5f5f5",
      marginBottom: "10px",
      borderRadius: "5px"
    }}>
      <div>🛡️ Seguro: {insurance.company || "Seguro viagem"}</div>
      <div style={{fontSize: "14px", color: "#555", marginTop: "6px"}}>
        Apólice: {insurance.policy || "—"} • Plano: {insurance.coverage || "—"}
      </div>
      <div style={{fontSize: "14px", color: "#555", marginTop: "6px"}}>
        Período: {insurance.start_date || "—"} → {insurance.end_date || "—"}
      </div>
      <div style={{fontSize: "14px", color: "#555", marginTop: "6px"}}>
        Titular: {insurance.insured_name || "—"}
      </div>
      <span style={{float: "right", color: "green"}}>Confirmado</span>
    </div>
  )
}
