import { useState, useEffect } from 'react'
import { supabase } from './services/supabase'
import { fmt } from './shared/utils/formatters'
import Header from "./shared/components/Header"
import FlightCard from "./features/flights/components/FlightCard"
import ProductCards from "./shared/components/ProductCards"
import HotelCard from './shared/components/HotelCard'
import TransferCard from './shared/components/TransferCard'
import InsuranceCard from './shared/components/InsuranceCard'
import ModernHome from './features/travel/components/ModernHome'
import FlightDetails from './features/flights/components/FlightDetails'

export default function App() {
  const [tela, setTela] = useState('login')
  const [codigo, setCodigo] = useState('')
  const [viagem, setViagem] = useState(null)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [expandido, setExpandido] = useState(null)
  const [telaDetalhe, setTelaDetalhe] = useState(null)

  const buscarViagem = async () => {
    setCarregando(true)
    setErro('')
    try {
      const { data, error } = await supabase
        .from('trips_v2')
        .select('*')
        .eq('pnr', codigo.toUpperCase())
        .single()

      if (error) throw error
      if (data) {
        setViagem(data)
        setTela('home')
        setExpandido(null)
        setTelaDetalhe(null)
      }
    } catch (e) {
      setErro('Código não encontrado')
    } finally {
      setCarregando(false)
    }
  }

  const getTodosPassageiros = (passengers) => {
    if (!passengers || passengers.length === 0) return []
    return passengers.map((p) => ({
      nome: p.name,
      tipo: p.type === 'ADT' ? 'Adulto' : p.type === 'CHD' ? 'Criança' : 'Bebê',
    }))
  }

  const getOrigemDestino = () => {
    if (!viagem?.segments || viagem.segments.length === 0) {
      return { origem: '---', destino: '---' }
    }

    const firstSegment = viagem.segments[0]
    const lastSegment = viagem.segments[viagem.segments.length - 1]
    
    return {
      origem: firstSegment?.from_city || '---',
      destino: lastSegment?.to_city || '---',
    }
  }

  if (tela === 'login') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          padding: '32px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          margin: '16px'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '32px'
          }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1a1a1a',
              marginBottom: '8px'
            }}>
              DSC Travel
            </h1>
            <p style={{
              color: '#666',
              fontSize: '16px'
            }}>
              Digite seu código de reserva
            </p>
          </div>

          <input
            type="text"
            placeholder="Código da reserva (ex: ABC123)"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              marginBottom: '16px',
              outline: 'none',
              transition: 'border-color 0.3s',
              textTransform: 'uppercase'
            }}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />

          {erro && (
            <div style={{
              color: '#dc3545',
              fontSize: '14px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              {erro}
            </div>
          )}

          <button
            onClick={buscarViagem}
            disabled={carregando || !codigo}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
              backgroundColor: carregando || !codigo ? '#ccc' : '#007bff',
              border: 'none',
              borderRadius: '8px',
              cursor: carregando || !codigo ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s'
            }}
          >
            {carregando ? 'Buscando...' : 'Acessar Viagem'}
          </button>
        </div>
      </div>
    )
  }

  if (tela === 'home') {
    return (
      <ModernHome
        viagem={viagem}
        onLogout={() => {
          setTela('login')
          setCodigo('')
          setViagem(null)
          setErro('')
        }}
        onOpenDetails={(secao) => {
          setTelaDetalhe(secao)
          setTela('detalhes')
        }}
      />
    )
  }

  if (tela === 'detalhes') {
    if (telaDetalhe === 'voos') {
      return (
        <FlightDetails
          viagem={viagem}
          onBack={() => setTela('home')}
        />
      )
    }

    // Outras páginas de detalhes serão implementadas aqui
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        padding: '20px'
      }}>
        <button
          onClick={() => setTela('home')}
          style={{
            marginBottom: '20px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ← Voltar
        </button>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h2>Seção: {telaDetalhe}</h2>
          <p>Página em desenvolvimento</p>
        </div>
      </div>
    )
  }

  return null
}
