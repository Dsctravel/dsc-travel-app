import { useState } from 'react'

export default function Login({ onLogin }) {
  const [codigo, setCodigo] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const buscarViagem = async () => {
    setCarregando(true)
    setErro('')
    try {
      await onLogin(codigo.toUpperCase())
    } catch (e) {
      setErro('Código não encontrado')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        marginBottom: '20px',
        borderRadius: '10px',
      }}>
        <h1>✈️ DSC TRAVEL</h1>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}>
        <h2>Acessar sua viagem</h2>
        <p>Digite o código da reserva (PNR)</p>

        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Ex: ABC123"
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            marginBottom: '10px',
          }}
        />

        <button
          onClick={buscarViagem}
          disabled={carregando}
          style={{
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: carregando ? 'wait' : 'pointer',
          }}
        >
          {carregando ? 'Buscando...' : 'Acessar'}
        </button>

        {erro && (
          <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
            {erro}
          </p>
        )}
      </div>
    </div>
  )
}
