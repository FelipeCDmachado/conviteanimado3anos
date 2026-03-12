"use client"

import { useEffect, useState } from "react"
import { MapPin, Calendar, Clock, PartyPopper, Sparkles, UserPlus, Users, X, Music, Volume2, VolumeX } from "lucide-react"
import { supabase } from "@/lib/supabase"

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void
  }
  namespace YT {
    class Player {
      constructor(elementId: string, options: object)
      playVideo(): void
      pauseVideo(): void
    }
  }
}

type Guest = {
  id: number
  name: string
  created_at?: string
}

export default function ConviteAniversario() {
  const [mounted, setMounted] = useState(false)
  const [guests, setGuests] = useState<Guest[]>([])
  const [newGuest, setNewGuest] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [player, setPlayer] = useState<YT.Player | null>(null)
  const [ytReady, setYtReady] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadGuests()

    // Carregar YouTube API
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    // @ts-ignore
    window.onYouTubeIframeAPIReady = () => {
      // @ts-ignore
      const ytPlayer = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: '0u1w_A8J6Hw',
        playerVars: {
          autoplay: 0,
          loop: 1,
          playlist: '0u1w_A8J6Hw',
        },
        events: {
          onReady: () => {
            setYtReady(true)
            setPlayer(ytPlayer)
          },
        },
      })
    }
  }, [])


  const loadGuests = async () => {
    try {
      const { data, error } = await supabase
        .from("guests")
        .select("id, name, created_at")
        .order("created_at", { ascending: true })

      if (error) {
        console.error("Erro ao carregar convidados:", error)
        alert("Erro ao carregar convidados: " + error.message)
        return
      }

      if (data) {
        setGuests(data)
      }
    } catch (err) {
      console.error("Erro ao carregar convidados:", err)
      alert("Erro ao carregar convidados: TypeError: Failed to fetch")
    }
  }

  const addGuest = async () => {
    const guestName = newGuest.trim()

    if (!guestName) {
      alert("Digite um nome antes de adicionar.")
      return
    }

    try {
      setIsSaving(true)

      const { data, error } = await supabase
        .from("guests")
        .insert([{ name: guestName }])
        .select()

      if (error) {
        console.error("Erro ao adicionar convidado:", error)
        alert("Erro ao adicionar convidado: " + error.message)
        return
      }

      console.log("Convidado adicionado:", data)
      setNewGuest("")
      await loadGuests()
    } catch (err) {
      console.error("Erro ao adicionar convidado:", err)
      alert("Erro ao adicionar convidado: TypeError: Failed to fetch")
    } finally {
      setIsSaving(false)
    }
  }

  const removeGuest = async (id: number) => {
    try {
      const { error } = await supabase.from("guests").delete().eq("id", id)

      if (error) {
        console.error("Erro ao remover convidado:", error)
        alert("Erro ao remover convidado: " + error.message)
        return
      }

      await loadGuests()
    } catch (err) {
      console.error("Erro ao remover convidado:", err)
      alert("Erro ao remover convidado: TypeError: Failed to fetch")
    }
  }

  const toggleMusic = () => {
    if (player && ytReady) {
      if (isPlaying) {
        player.pauseVideo()
      } else {
        player.playVideo()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Player de música do YouTube - Under the Sea (escondido) */}
      <div id="youtube-player" className="hidden" />
      
      {/* Botão flutuante de música */}
      <button
        onClick={toggleMusic}
        className="fixed top-4 right-4 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 border-2 border-white/40 flex items-center justify-center shadow-lg shadow-cyan-500/40 hover:scale-110 transition-all duration-300 group"
        style={{
          boxShadow: isPlaying 
            ? '0 0 30px rgba(0, 200, 200, 0.6), 0 0 60px rgba(0, 200, 200, 0.3)' 
            : '0 10px 30px rgba(0, 80, 100, 0.4)'
        }}
      >
        {isPlaying ? (
          <Volume2 className="w-6 h-6 text-white animate-pulse" />
        ) : (
          <VolumeX className="w-6 h-6 text-white/80" />
        )}
        <div className={`absolute inset-0 rounded-full border-2 border-white/30 ${isPlaying ? 'animate-ping' : ''}`} style={{ animationDuration: '2s' }} />
      </button>

      {/* Indicador de música tocando */}
      {isPlaying && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-2 rounded-full border border-white/30">
          <Music className="w-4 h-4 text-cyan-200" />
          <div className="flex items-end gap-0.5">
            <div className="w-1 h-3 bg-cyan-300 rounded-full animate-[musicBar_0.5s_ease-in-out_infinite]" />
            <div className="w-1 h-4 bg-cyan-200 rounded-full animate-[musicBar_0.5s_ease-in-out_infinite_0.1s]" />
            <div className="w-1 h-2 bg-cyan-300 rounded-full animate-[musicBar_0.5s_ease-in-out_infinite_0.2s]" />
            <div className="w-1 h-5 bg-cyan-200 rounded-full animate-[musicBar_0.5s_ease-in-out_infinite_0.3s]" />
          </div>
        </div>
      )}

      {/* Background oceano profundo */}
      <div className="fixed inset-0 bg-gradient-to-b from-cyan-400 via-teal-600 via-60% to-[#0a3d4f]" />
      
      {/* Camada de luz superior - raios de sol atravessando água */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/50 via-transparent to-transparent h-1/3" />
        {/* Raios de luz */}
        <div className="absolute top-0 left-[10%] w-20 h-[80vh] bg-gradient-to-b from-white/20 via-cyan-200/10 to-transparent rotate-6 blur-xl" />
        <div className="absolute top-0 left-[30%] w-32 h-[90vh] bg-gradient-to-b from-white/15 via-cyan-200/5 to-transparent -rotate-3 blur-2xl animate-pulse" />
        <div className="absolute top-0 left-[55%] w-24 h-[70vh] bg-gradient-to-b from-white/20 via-cyan-200/10 to-transparent rotate-12 blur-xl" />
        <div className="absolute top-0 right-[15%] w-16 h-[85vh] bg-gradient-to-b from-white/15 via-cyan-200/5 to-transparent -rotate-6 blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Bolhas flutuantes */}
      {mounted && <Bubbles />}

      {/* Partículas flutuantes (plâncton) */}
      {mounted && <Particles />}

      {/* Peixes nadando */}
      {mounted && <SwimmingFish />}

      {/* Água-viva flutuante */}
      {mounted && <Jellyfish />}

      {/* Algas e vegetação marinha - esquerda */}
      <div className="fixed bottom-0 left-0 w-32 md:w-48 h-[60vh] pointer-events-none z-20">
        <Seaweed position="left" />
      </div>

      {/* Algas e vegetação marinha - direita */}
      <div className="fixed bottom-0 right-0 w-32 md:w-48 h-[60vh] pointer-events-none z-20">
        <Seaweed position="right" />
      </div>

      {/* Fundo do mar - areia e corais */}
      <div className="fixed bottom-0 left-0 right-0 h-32 md:h-40 pointer-events-none z-10">
        {/* Areia */}
        <div className="absolute bottom-0 left-0 right-0 h-20 md:h-24 bg-gradient-to-t from-[#c2a66b] via-[#d4b87a] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#c2a66b]" />
        
        {/* Pequenas pedras e conchas na areia */}
        <div className="absolute bottom-2 left-[10%] w-4 h-3 rounded-full bg-[#a08050] opacity-60" />
        <div className="absolute bottom-3 left-[25%] w-3 h-2 rounded-full bg-[#b09060] opacity-50" />
        <div className="absolute bottom-1 left-[60%] w-5 h-3 rounded-full bg-[#a08050] opacity-40" />
        <div className="absolute bottom-2 right-[20%] w-4 h-2 rounded-full bg-[#c0a070] opacity-50" />
        
        {/* Estrela do mar animada */}
        <div className="absolute bottom-4 left-[15%] animate-[wiggle_3s_ease-in-out_infinite]">
          <Starfish className="w-10 h-10 text-[#ff6b6b] drop-shadow-lg" />
        </div>
        <div className="absolute bottom-6 right-[25%] animate-[wiggle_4s_ease-in-out_infinite]" style={{ animationDelay: '1s' }}>
          <Starfish className="w-8 h-8 text-[#e879f9] drop-shadow-lg" />
        </div>

        {/* Conchas animadas */}
        <div className="absolute bottom-3 left-[40%] animate-[pulse_2s_ease-in-out_infinite]">
          <Shell className="w-6 h-6 text-[#fde68a] drop-shadow-md" />
        </div>
        <div className="absolute bottom-4 right-[40%] animate-[pulse_3s_ease-in-out_infinite]" style={{ animationDelay: '0.5s' }}>
          <Shell className="w-5 h-5 text-[#fcd5ce] drop-shadow-md" />
        </div>
      </div>

      {/* Caranguejo animado */}
      {mounted && <AnimatedCrab />}

      {/* Corais decorativos */}
      <Corals />

      {/* Conteúdo principal */}
      <div className="relative z-30 flex flex-col items-center justify-start min-h-screen px-4 py-8 pb-40">
        
        {/* Elemento 3D animado - Conchas girando */}
        <div className="mb-6 relative">
          <div className="flex items-center justify-center gap-6">
            <div className="animate-[spin3d_6s_linear_infinite]">
              <Shell3D className="w-16 h-16 text-amber-300" />
            </div>
            <div className="animate-[bounce_2s_ease-in-out_infinite]">
              <Sparkles className="w-10 h-10 text-cyan-200" />
            </div>
            <div className="animate-[spin3d_6s_linear_infinite]" style={{ animationDelay: '3s', animationDirection: 'reverse' }}>
              <Shell3D className="w-16 h-16 text-pink-300" />
            </div>
          </div>
        </div>

        {/* Card principal do convite - estilo bolha/água */}
        <div 
          className="w-full max-w-md bg-white/20 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/30 transform perspective-1000 hover:scale-[1.02] transition-all duration-500"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 80, 100, 0.5), inset 0 0 60px rgba(255, 255, 255, 0.1), 0 0 40px rgba(0, 200, 200, 0.2)'
          }}
        >
          {/* Header decorativo */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              <span className="text-cyan-100 text-sm font-medium tracking-widest uppercase">Convite Especial</span>
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            
            <h1 className="font-serif text-3xl md:text-4xl text-white mb-2 drop-shadow-lg">
              A Pequena
            </h1>
            <h2 className="font-serif text-5xl md:text-6xl bg-gradient-to-r from-cyan-200 via-white to-cyan-200 bg-clip-text text-transparent drop-shadow-lg">
              Maria Júlia
            </h2>
            <div className="mt-3 flex items-center justify-center gap-3">
              <span className="text-cyan-100 font-medium">faz</span>
              <div className="relative">
                <span className="font-serif text-6xl md:text-7xl text-red-400 drop-shadow-[0_0_20px_rgba(255,100,100,0.5)] animate-[bounce_2s_ease-in-out_infinite]">
                  3
                </span>
                <PartyPopper className="absolute -top-2 -right-6 w-6 h-6 text-amber-400 animate-bounce" />
              </div>
              <span className="text-cyan-100 font-medium">aninhos!</span>
            </div>
          </div>

          {/* Divisor decorativo com peixinhos */}
          <div className="flex items-center justify-center gap-4 my-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-white/50 to-white/50" />
            <div className="flex gap-2 items-center">
              <FishIcon className="w-5 h-5 text-amber-400 animate-[swim_2s_ease-in-out_infinite]" />
              <div className="w-2 h-2 rounded-full bg-white/60" />
              <FishIcon className="w-5 h-5 text-cyan-300 animate-[swim_2s_ease-in-out_infinite]" style={{ animationDelay: '0.5s', transform: 'scaleX(-1)' }} />
            </div>
            <div className="h-px w-12 bg-gradient-to-l from-transparent via-white/50 to-white/50" />
          </div>

          {/* Informações do evento */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-white/10 backdrop-blur rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-cyan-200 font-medium">Data</p>
                <p className="text-xl font-bold text-white">04 de Abril de 2026</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-white/10 backdrop-blur rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-cyan-200 font-medium">Horário</p>
                <p className="text-xl font-bold text-white">18:30 horas</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3 bg-white/10 backdrop-blur rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 shrink-0 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-cyan-200 font-medium">Local</p>
                <p className="text-lg font-bold text-white">Salão de Festas Porto Dourado 1</p>
                <p className="text-sm text-cyan-200">Residencial Porto Dourado 1</p>
              </div>
            </div>
          </div>

          {/* Elemento 3D animado - Bolha flutuante com estrela */}
          <div className="flex justify-center my-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/40 to-white/10 border border-white/30 flex items-center justify-center animate-[float_4s_ease-in-out_infinite]"
                style={{ boxShadow: 'inset -4px -4px 10px rgba(255,255,255,0.3), inset 4px 4px 10px rgba(0,100,120,0.1), 0 10px 40px rgba(0,200,200,0.3)' }}>
                <Starfish className="w-12 h-12 text-amber-400 animate-[spin_8s_linear_infinite]" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white/30 blur-sm" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-white/20 blur-sm" />
            </div>
          </div>

          {/* Botão para localização */}
          <a 
            href="https://maps.app.goo.gl/b3fhZyH82qKKjR7v6?g_st=ic"
            target="_blank"
            rel="noopener noreferrer"
            className="group block w-full p-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white rounded-2xl text-center font-semibold shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transform hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-center justify-center gap-2">
              <MapPin className="w-5 h-5 group-hover:animate-bounce" />
              <span>Ver Localização</span>
            </div>
          </a>

          {/* Lista de Convidados */}
          <div className="mt-6 p-4 bg-white/10 backdrop-blur rounded-2xl border border-white/20">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="w-5 h-5 text-amber-300" />
              <h3 className="text-lg font-semibold text-white">Lista de Convidados</h3>
              <span className="text-sm text-cyan-200">({guests.length})</span>
            </div>

            {/* Input para adicionar convidado */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newGuest}
                onChange={(e) => setNewGuest(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addGuest()}
                placeholder="Nome do convidado..."
                className="flex-1 px-4 py-2 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addGuest}
                disabled={isSaving}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-white rounded-xl font-medium shadow-lg shadow-amber-500/30 hover:shadow-xl transition-all duration-300 flex items-center gap-1 disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
              </button>
            </div>

            {/* Lista de convidados */}
            {guests.length > 0 ? (
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {guests.map((guest) => (
                  <div
                    key={guest.id}
                    className="flex items-center justify-between p-2 bg-white/10 rounded-lg border border-white/10 group hover:bg-white/20 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-white text-sm font-semibold">
                        {guest.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white text-sm">{guest.name}</span>
                    </div>
                    <button
                      onClick={() => removeGuest(guest.id)}
                      className="p-1 text-white/50 hover:text-red-400 hover:bg-red-400/20 rounded-full transition-all opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-cyan-200/60 text-sm py-4">
                Nenhum convidado adicionado ainda
              </p>
            )}
          </div>
        </div>

        {/* Imagem Ariel com amigos */}
        <div className="mt-8 mb-6 transform hover:scale-105 transition-transform duration-500 animate-[float_6s_ease-in-out_infinite]" style={{ animationDelay: '2s' }}>
          <div className="relative">
            <img 
              src="/ariel.png"
              alt="Ariel com Linguado e Sebastião"
              className="w-64 md:w-80 h-auto rounded-2xl shadow-2xl border-2 border-white/30"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 80, 100, 0.6), 0 0 40px rgba(0, 200, 200, 0.3)'
              }}
            />
          </div>
        </div>

        {/* Mensagem final */}
        <div className="text-center text-white mb-8">
          <p className="font-serif text-2xl md:text-3xl drop-shadow-lg mb-2 text-balance">
            Venha mergulhar nessa festa!
          </p>
          <p className="text-cyan-100 text-sm">
            Sua presença tornará esse dia ainda mais especial
          </p>
        </div>

        {/* Footer decorativo */}
        <div className="flex items-center gap-3 text-cyan-200 text-sm">
          <Shell className="w-5 h-5 text-amber-300 animate-pulse" />
          <span>Com carinho</span>
          <Shell className="w-5 h-5 text-amber-300 animate-pulse" />
        </div>
      </div>

      {/* Estilos CSS para animações */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes sway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(-10deg) scale(1); }
          50% { transform: rotate(10deg) scale(1.1); }
        }

        @keyframes swim {
          0%, 100% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(3px) translateY(-2px); }
          75% { transform: translateX(-3px) translateY(2px); }
        }

        @keyframes swimAcross {
          0% { transform: translateX(-100px) translateY(0); }
          25% { transform: translateX(25vw) translateY(-10px); }
          50% { transform: translateX(50vw) translateY(5px); }
          75% { transform: translateX(75vw) translateY(-5px); }
          100% { transform: translateX(calc(100vw + 100px)) translateY(0); }
        }

        @keyframes jellyFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }

        @keyframes tentacles {
          0%, 100% { transform: skewX(-5deg); }
          50% { transform: skewX(5deg); }
        }

        @keyframes crabWalk {
          0% { transform: translateX(-50px) scaleX(1); }
          49% { transform: translateX(100px) scaleX(1); }
          50% { transform: translateX(100px) scaleX(-1); }
          99% { transform: translateX(-50px) scaleX(-1); }
          100% { transform: translateX(-50px) scaleX(1); }
        }

        @keyframes spin3d {
          0% { transform: perspective(500px) rotateY(0deg); }
          100% { transform: perspective(500px) rotateY(360deg); }
        }

        @keyframes bubble {
          0% {
            transform: translateY(100vh) translateX(0) scale(0.5);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-20vh) translateX(var(--drift)) scale(1);
            opacity: 0;
          }
        }

        @keyframes particle {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-10px) translateX(-5px);
            opacity: 0.4;
          }
          75% {
            transform: translateY(-30px) translateX(15px);
            opacity: 0.5;
          }
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        @keyframes musicBar {
          0%, 100% { height: 8px; }
          50% { height: 16px; }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </main>
  )
}

// Componente de bolhas animadas
function Bubbles() {
  const bubbles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    size: Math.random() * 25 + 8,
    left: Math.random() * 100,
    delay: Math.random() * 20,
    duration: Math.random() * 12 + 18,
    drift: (Math.random() - 0.5) * 80,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`,
            bottom: '-50px',
            '--drift': `${bubble.drift}px`,
            animation: `bubble ${bubble.duration}s ease-in-out ${bubble.delay}s infinite`,
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.1) 50%, transparent)',
            boxShadow: 'inset -2px -2px 8px rgba(255,255,255,0.4), inset 2px 2px 8px rgba(0,100,120,0.1)',
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

// Partículas flutuantes (plâncton)
function Particles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 10,
    duration: Math.random() * 8 + 6,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-5">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-cyan-200/40"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            animation: `particle ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

// Peixes nadando
function SwimmingFish() {
  const fishSchool = [
    { top: '15%', delay: 0, duration: 15, color: 'text-amber-400' },
    { top: '25%', delay: 5, duration: 18, color: 'text-cyan-300' },
    { top: '45%', delay: 10, duration: 20, color: 'text-pink-400' },
    { top: '60%', delay: 3, duration: 16, color: 'text-yellow-300' },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-5">
      {fishSchool.map((fish, i) => (
        <div
          key={i}
          className="absolute left-0"
          style={{
            top: fish.top,
            animation: `swimAcross ${fish.duration}s linear ${fish.delay}s infinite`,
          }}
        >
          <FishIcon className={`w-8 h-8 ${fish.color} drop-shadow-lg`} />
        </div>
      ))}
    </div>
  )
}

// Água-viva flutuante
function Jellyfish() {
  return (
    <div className="fixed top-[20%] right-[10%] pointer-events-none z-5 animate-[jellyFloat_8s_ease-in-out_infinite]">
      <svg viewBox="0 0 60 80" className="w-16 h-20 md:w-20 md:h-24">
        {/* Corpo da água-viva */}
        <defs>
          <radialGradient id="jellyGrad" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="rgba(236,72,153,0.8)" />
            <stop offset="100%" stopColor="rgba(168,85,247,0.4)" />
          </radialGradient>
        </defs>
        <ellipse cx="30" cy="25" rx="25" ry="20" fill="url(#jellyGrad)" className="drop-shadow-lg" />
        <ellipse cx="30" cy="25" rx="20" ry="15" fill="rgba(255,255,255,0.3)" />
        
        {/* Tentáculos */}
        <g className="animate-[tentacles_2s_ease-in-out_infinite]">
          <path d="M15 40 Q10 55 15 70" stroke="rgba(236,72,153,0.6)" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M22 42 Q18 58 22 75" stroke="rgba(168,85,247,0.5)" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M30 43 Q30 60 30 78" stroke="rgba(236,72,153,0.6)" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M38 42 Q42 58 38 75" stroke="rgba(168,85,247,0.5)" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M45 40 Q50 55 45 70" stroke="rgba(236,72,153,0.6)" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  )
}

// Caranguejo animado
function AnimatedCrab() {
  return (
    <div className="fixed bottom-12 left-[20%] pointer-events-none z-25 animate-[crabWalk_12s_linear_infinite]">
      <svg viewBox="0 0 50 35" className="w-10 h-8 md:w-12 md:h-10 drop-shadow-lg">
        {/* Corpo */}
        <ellipse cx="25" cy="20" rx="15" ry="10" fill="#ef4444" />
        <ellipse cx="25" cy="18" rx="12" ry="7" fill="#f87171" />
        
        {/* Olhos */}
        <circle cx="20" cy="12" r="3" fill="#fef3c7" />
        <circle cx="30" cy="12" r="3" fill="#fef3c7" />
        <circle cx="20" cy="12" r="1.5" fill="#1f2937" />
        <circle cx="30" cy="12" r="1.5" fill="#1f2937" />
        
        {/* Hastes dos olhos */}
        <line x1="20" y1="15" x2="20" y2="18" stroke="#dc2626" strokeWidth="2" />
        <line x1="30" y1="15" x2="30" y2="18" stroke="#dc2626" strokeWidth="2" />
        
        {/* Garras */}
        <ellipse cx="5" cy="20" rx="5" ry="4" fill="#ef4444" />
        <ellipse cx="45" cy="20" rx="5" ry="4" fill="#ef4444" />
        <path d="M2 18 L0 15 L3 17" fill="#ef4444" />
        <path d="M48 18 L50 15 L47 17" fill="#ef4444" />
        
        {/* Pernas */}
        <line x1="12" y1="25" x2="8" y2="32" stroke="#dc2626" strokeWidth="2" />
        <line x1="15" y1="27" x2="12" y2="33" stroke="#dc2626" strokeWidth="2" />
        <line x1="38" y1="25" x2="42" y2="32" stroke="#dc2626" strokeWidth="2" />
        <line x1="35" y1="27" x2="38" y2="33" stroke="#dc2626" strokeWidth="2" />
      </svg>
    </div>
  )
}

// Algas marinhas
function Seaweed({ position }: { position: 'left' | 'right' }) {
  const isLeft = position === 'left'
  
  return (
    <svg 
      viewBox="0 0 100 300" 
      className="w-full h-full"
      style={{ transform: isLeft ? 'scaleX(1)' : 'scaleX(-1)' }}
    >
      {/* Alga 1 - mais alta */}
      <path
        d="M30 300 Q35 250 25 200 Q15 150 30 100 Q40 60 25 20"
        fill="none"
        stroke="#166534"
        strokeWidth="8"
        strokeLinecap="round"
        className="animate-[sway_4s_ease-in-out_infinite]"
        style={{ transformOrigin: 'bottom center' }}
      />
      {/* Folhas da alga 1 */}
      <ellipse cx="25" cy="180" rx="15" ry="8" fill="#15803d" className="animate-[sway_3s_ease-in-out_infinite]" style={{ animationDelay: '0.5s' }} />
      <ellipse cx="30" cy="130" rx="12" ry="6" fill="#16a34a" className="animate-[sway_3.5s_ease-in-out_infinite]" style={{ animationDelay: '1s' }} />
      <ellipse cx="28" cy="80" rx="10" ry="5" fill="#22c55e" className="animate-[sway_4s_ease-in-out_infinite]" style={{ animationDelay: '0.3s' }} />
      
      {/* Alga 2 - média */}
      <path
        d="M60 300 Q55 260 65 220 Q75 180 60 140 Q50 110 65 80"
        fill="none"
        stroke="#14532d"
        strokeWidth="6"
        strokeLinecap="round"
        className="animate-[sway_5s_ease-in-out_infinite]"
        style={{ transformOrigin: 'bottom center', animationDelay: '1s' }}
      />
      <ellipse cx="65" cy="200" rx="12" ry="6" fill="#166534" className="animate-[sway_4s_ease-in-out_infinite]" style={{ animationDelay: '1.5s' }} />
      <ellipse cx="62" cy="150" rx="10" ry="5" fill="#15803d" className="animate-[sway_3s_ease-in-out_infinite]" style={{ animationDelay: '2s' }} />
      
      {/* Alga 3 - pequena */}
      <path
        d="M15 300 Q20 270 12 240 Q5 210 18 180"
        fill="none"
        stroke="#22c55e"
        strokeWidth="5"
        strokeLinecap="round"
        className="animate-[sway_3s_ease-in-out_infinite]"
        style={{ transformOrigin: 'bottom center', animationDelay: '2s' }}
      />
      <ellipse cx="15" cy="220" rx="8" ry="4" fill="#4ade80" className="animate-[sway_2.5s_ease-in-out_infinite]" />
      
      {/* Alga 4 - background */}
      <path
        d="M80 300 Q85 280 78 260 Q72 240 82 220"
        fill="none"
        stroke="#16a34a"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.7"
        className="animate-[sway_4s_ease-in-out_infinite]"
        style={{ transformOrigin: 'bottom center', animationDelay: '0.8s' }}
      />
    </svg>
  )
}

// Corais
function Corals() {
  return (
    <>
      {/* Coral esquerdo */}
      <div className="fixed bottom-16 left-4 md:left-12 z-15 pointer-events-none">
        <svg viewBox="0 0 60 80" className="w-16 md:w-20 h-20 md:h-24">
          <path d="M30 80 L30 50 Q20 40 15 25 Q12 15 20 10" stroke="#f87171" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M30 50 Q40 40 45 25 Q48 15 40 10" stroke="#f87171" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M30 60 Q25 55 20 45 Q15 38 18 30" stroke="#fb923c" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M30 60 Q35 55 40 45 Q45 38 42 30" stroke="#fb923c" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="20" cy="10" r="4" fill="#fca5a5" />
          <circle cx="40" cy="10" r="4" fill="#fca5a5" />
          <circle cx="18" cy="30" r="3" fill="#fdba74" />
          <circle cx="42" cy="30" r="3" fill="#fdba74" />
        </svg>
      </div>
      
      {/* Coral direito */}
      <div className="fixed bottom-20 right-4 md:right-16 z-15 pointer-events-none">
        <svg viewBox="0 0 50 70" className="w-12 md:w-16 h-16 md:h-20">
          <path d="M25 70 L25 45 Q15 35 10 20 Q8 12 15 8" stroke="#c084fc" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M25 45 Q35 35 40 20 Q42 12 35 8" stroke="#c084fc" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="15" cy="8" r="4" fill="#d8b4fe" />
          <circle cx="35" cy="8" r="4" fill="#d8b4fe" />
          <path d="M25 55 L25 40 Q20 30 22 20" stroke="#a78bfa" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="22" cy="20" r="2" fill="#c4b5fd" />
        </svg>
      </div>
    </>
  )
}

// Ícone de estrela do mar
function Starfish({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2L14.5 8.5L21.5 9.5L16 14.5L17.5 21.5L12 18L6.5 21.5L8 14.5L2.5 9.5L9.5 8.5L12 2Z" />
    </svg>
  )
}

// Ícone de concha
function Shell({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 3C7 3 3 7 3 12C3 17 7 21 12 21C13 21 14 20.8 15 20.5C14 19.5 13.5 18 13.5 16.5C13.5 13.5 16 11 19 11C19.5 11 20 11.1 20.5 11.2C20.8 10.2 21 9.1 21 8C21 5 17 3 12 3Z" />
      <path d="M12 5C9 5 6 6.5 6 9C6 11.5 9 13 12 13C15 13 18 11.5 18 9C18 6.5 15 5 12 5Z" opacity="0.5" />
    </svg>
  )
}

// Concha 3D animada
function Shell3D({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 50 50" className={className} fill="currentColor">
      <defs>
        <linearGradient id="shellGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <path d="M25 5C15 5 5 15 5 25C5 35 15 45 25 45C35 45 45 35 45 25" fill="url(#shellGrad)" />
      <path d="M25 10C18 10 10 18 10 25C10 32 18 40 25 40" fill="currentColor" opacity="0.3" />
      <path d="M25 5 Q30 15 25 25 Q20 35 25 45" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M15 15 Q25 20 35 15" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M12 25 Q25 28 38 25" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M15 35 Q25 32 35 35" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
    </svg>
  )
}

// Ícone de peixe
function FishIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
      <path d="M12 4C8 4 4 8 4 12C4 16 8 20 12 20C16 20 20 16 20 12L22 10L20 12C20 8 16 4 12 4Z" />
      <path d="M2 12L5 9L5 15L2 12Z" />
      <circle cx="16" cy="10" r="1.5" fill="white" />
      <circle cx="16" cy="10" r="0.8" fill="#1f2937" />
    </svg>
  )
}
