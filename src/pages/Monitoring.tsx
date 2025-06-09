import React, { useEffect, useState } from 'react';
import {
  Trophy,
  Activity,
  TrendingUp,
  Gamepad2,
  Clock,
  Star,
  Target,
  Zap,
  Users,
  Award
} from 'lucide-react';
import Squares from '../components/Squares';

type Game = {
  id?: string | number;
  name: string;
  platform: string;
  score: number;
};

type PlatformStat = {
  platform: string;
  count: number;
  totalScore: number;
};

type Summary = {
  totalGames: number;
  totalHoursPlayed: number;
};

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  variant: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'info';
  isLoading?: boolean;
}

const StatCard = ({ title, value, subtitle, icon, variant, isLoading }: StatCardProps) => {
  const variantClasses = {
    primary: 'border-cyan-500/30 hover:border-cyan-500/60 hover:shadow-cyan-500/20 bg-gradient-to-br from-cyan-900/20 to-blue-900/20',
    secondary: 'border-purple-500/30 hover:border-purple-500/60 hover:shadow-purple-500/20 bg-gradient-to-br from-purple-900/20 to-violet-900/20',
    accent: 'border-pink-500/30 hover:border-pink-500/60 hover:shadow-pink-500/20 bg-gradient-to-br from-pink-900/20 to-purple-900/20',
    success: 'border-green-500/30 hover:border-green-500/60 hover:shadow-green-500/20 bg-gradient-to-br from-green-900/20 to-emerald-900/20',
    warning: 'border-yellow-500/30 hover:border-yellow-500/60 hover:shadow-yellow-500/20 bg-gradient-to-br from-yellow-900/20 to-orange-900/20',
    info: 'border-blue-500/30 hover:border-blue-500/60 hover:shadow-blue-500/20 bg-gradient-to-br from-blue-900/20 to-indigo-900/20'
  };

  const iconClasses = {
    primary: 'text-cyan-400 bg-cyan-500/20',
    secondary: 'text-purple-400 bg-purple-500/20',
    accent: 'text-pink-400 bg-pink-500/20',
    success: 'text-green-400 bg-green-500/20',
    warning: 'text-yellow-400 bg-yellow-500/20',
    info: 'text-blue-400 bg-blue-500/20'
  };

  return (
    <div className={`group relative overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-500 hover:scale-105 ${variantClasses[variant]}`}>
      {/* Efecto de brillo animado */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
      
      <div className="relative p-6">
        {/* Header con icono */}
        <div className="flex items-center mb-4">
          <div className={`p-3 rounded-xl ${iconClasses[variant]} backdrop-blur-sm`}>
            {icon}
          </div>
          <h3 className="ml-3 text-lg font-semibold text-white/90">{title}</h3>
        </div>

        {/* Valor principal */}
        <div className="mb-3">
          {isLoading ? (
            <div className="h-12 bg-gray-700/50 rounded-lg animate-pulse"></div>
          ) : (
            <span className="text-4xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {value}
            </span>
          )}
        </div>

        {/* Subtítulo */}
        <p className="text-sm text-gray-400 leading-relaxed">
          {subtitle}
        </p>

        {/* Decoración inferior */}
        <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r opacity-60 group-hover:opacity-100 transition-opacity duration-300 ${
          variant === 'primary' ? 'from-cyan-500 to-blue-500' :
          variant === 'secondary' ? 'from-purple-500 to-violet-500' :
          variant === 'accent' ? 'from-pink-500 to-purple-500' :
          variant === 'success' ? 'from-green-500 to-emerald-500' :
          variant === 'warning' ? 'from-yellow-500 to-orange-500' :
          'from-blue-500 to-indigo-500'
        }`}></div>
      </div>
    </div>
  );
};

interface GameCardProps {
  game: Game;
  rank: number;
}

const GameCard = ({ game, rank }: GameCardProps) => {
  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-500 to-amber-500';
    if (rank === 2) return 'from-gray-400 to-gray-500';
    if (rank === 3) return 'from-amber-600 to-orange-600';
    return 'from-cyan-500 to-blue-500';
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) return <Trophy className="w-5 h-5" />;
    return <Award className="w-5 h-5" />;
  };

  return (
    <div className="group bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300 hover:scale-105">
      {/* Efecto de brillo */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none rounded-xl"></div>
      
      <div className="relative flex items-center space-x-4">
        {/* Rank badge */}
        <div className={`p-3 rounded-xl bg-gradient-to-br ${getRankColor(rank)} shadow-lg flex items-center justify-center min-w-[48px]`}>
          <span className="text-white font-bold text-sm">{rank}</span>
        </div>

        {/* Game info */}
        <div className="flex-1">
          <h4 className="text-white font-semibold text-lg group-hover:text-cyan-400 transition-colors duration-300">
            {game.name}
          </h4>
          <div className="flex items-center space-x-4 mt-1">
            <span className="text-gray-400 text-sm">
              Plataforma: <span className="text-purple-400 font-medium">{game.platform}</span>
            </span>
            <span className="text-gray-400 text-sm">
              Puntaje: <span className="text-green-400 font-medium">{game.score}</span>
            </span>
          </div>
        </div>

        {/* Trophy icon */}
        <div className="text-gray-500 group-hover:text-cyan-400 transition-colors duration-300">
          {getRankIcon(rank)}
        </div>
      </div>
    </div>
  );
};

interface PlatformCardProps {
  platform: PlatformStat;
}

const PlatformCard = ({ platform }: PlatformCardProps) => {
  const getPlatformIcon = () => {
    if (platform.platform.toLowerCase().includes('xbox')) return <Gamepad2 className="w-6 h-6" />;
    if (platform.platform.toLowerCase().includes('playstation')) return <Gamepad2 className="w-6 h-6" />;
    if (platform.platform.toLowerCase().includes('pc')) return <Users className="w-6 h-6" />;
    return <Star className="w-6 h-6" />;
  };

  return (
    <div className="group bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-purple-500/40 transition-all duration-300 hover:scale-105">
      {/* Efecto de brillo */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none rounded-xl"></div>
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
            {getPlatformIcon()}
          </div>
          <h4 className="ml-3 text-xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">
            {platform.platform}
          </h4>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Juegos:</span>
            <span className="text-cyan-400 font-bold text-lg">{platform.count}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Puntaje Total:</span>
            <span className="text-green-400 font-bold text-lg">{platform.totalScore}</span>
          </div>
        </div>

        {/* Progress bar visual */}
        <div className="mt-4 h-2 bg-gray-700/50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(100, (platform.count / 10) * 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default function Monitoring() {
  const [topGames, setTopGames] = useState<Game[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStat[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("http://localhost:8000/api/top-games").then(r => r.json()),
      fetch("http://localhost:8000/api/platform-stats").then(r => r.json()),
      fetch("http://localhost:8000/api/summary").then(r => r.json()),
    ])
      .then(([topGamesData, platformStatsData, summaryData]) => {
        setTopGames(topGamesData);
        setPlatformStats(platformStatsData);
        setSummary(summaryData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar datos:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="relative min-h-full overflow-hidden">
        {/* Fondo con efectos */}
        <div className="absolute inset-0 z-0">
          <Squares 
            speed={0.5} 
            squareSize={40}
            direction='diagonal'
            borderColor='#fff'
            hoverFillColor='#222'
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10"></div>
        
        <div className="relative z-20 flex items-center justify-center min-h-full">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Cargando datos...
            </h2>
            <p className="text-gray-400 mt-2">Analizando estadísticas del sistema</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-full overflow-hidden">
      {/* Fondo con efectos */}
      <div className="absolute inset-0 z-0">
        <Squares 
          speed={0.5} 
          squareSize={40}
          direction='diagonal'
          borderColor='#fff'
          hoverFillColor='#222'
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10"></div>

      {/* Contenido principal */}
      <div className="relative z-20 min-h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent mb-4">
              Estadísticas y Rankings
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
            <p className="text-gray-400 mt-4 text-lg">Análisis detallado del rendimiento y métricas del sistema</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatCard
              title="Juegos Totales"
              value={summary?.totalGames ?? '-'}
              subtitle="Total de juegos en la biblioteca"
              icon={<Trophy className="w-6 h-6" />}
              variant="success"
              isLoading={loading}
            />
            <StatCard
              title="Horas Jugadas"
              value={summary?.totalHoursPlayed ?? '-'}
              subtitle="Tiempo total invertido en gaming"
              icon={<Clock className="w-6 h-6" />}
              variant="info"
              isLoading={loading}
            />
            <StatCard
              title="Plataformas"
              value={platformStats.length}
              subtitle="Número de plataformas activas"
              icon={<Gamepad2 className="w-6 h-6" />}
              variant="warning"
              isLoading={loading}
            />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Games Section */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-gray-900/90 to-black/90 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/25">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="ml-3 text-2xl font-bold text-white">Top 5 Juegos</h2>
                </div>
                
                <div className="space-y-4">
                  {topGames.map((game, index) => (
                    <GameCard key={game.id || game.name} game={game} rank={index + 1} />
                  ))}
                </div>
              </div>
            </div>

            {/* Platform Stats Section */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-gray-900/90 to-black/90 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg shadow-purple-500/25">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="ml-3 text-2xl font-bold text-white">Estadísticas por Plataforma</h2>
                </div>
                
                <div className="space-y-4">
                  {platformStats.map((platform) => (
                    <PlatformCard key={platform.platform} platform={platform} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="mt-12">
            <div className="bg-gradient-to-r from-gray-900/90 to-black/90 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8">
              <div className="flex items-center mb-8">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-500/25">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h2 className="ml-3 text-2xl font-bold text-white">Resumen de Actividad</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center group">
                  <div className="p-4 bg-green-500/20 rounded-xl mb-4 group-hover:bg-green-500/30 transition-colors duration-300">
                    <Trophy className="w-8 h-8 text-green-400 mx-auto" />
                  </div>
                  <div className="text-4xl font-bold text-green-400 mb-2">{summary?.totalGames || 0}</div>
                  <div className="text-gray-400">Juegos Totales</div>
                </div>
                
                <div className="text-center group">
                  <div className="p-4 bg-blue-500/20 rounded-xl mb-4 group-hover:bg-blue-500/30 transition-colors duration-300">
                    <Clock className="w-8 h-8 text-blue-400 mx-auto" />
                  </div>
                  <div className="text-4xl font-bold text-blue-400 mb-2">{summary?.totalHoursPlayed || 0}</div>
                  <div className="text-gray-400">Horas Jugadas</div>
                </div>
                
                <div className="text-center group">
                  <div className="p-4 bg-orange-500/20 rounded-xl mb-4 group-hover:bg-orange-500/30 transition-colors duration-300">
                    <Gamepad2 className="w-8 h-8 text-orange-400 mx-auto" />
                  </div>
                  <div className="text-4xl font-bold text-orange-400 mb-2">{platformStats.length}</div>
                  <div className="text-gray-400">Plataformas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}