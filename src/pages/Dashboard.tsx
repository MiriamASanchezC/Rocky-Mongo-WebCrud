import { useEffect, useState } from 'react';
import { Trophy, Gamepad2, TrendingUp, Clock, Star, Target } from 'lucide-react';
import Hyperspeed from '../components/Hyperspeed';
import PixelCard from '../components/PixelCard';

interface Summary {
  totalGames: number;
  totalScore: number;
  totalHoursPlayed: number;
  bestGame: string;
  bestScore: number;
  currentGame: string;
  lastCompleted: {
    name: string;
    lastPlayed: string;
  } | null;
  completedCount: number;
  inProgressCount: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  variant: 'pink' | 'blue' | 'yellow' | 'green' | 'purple' | 'cyan';
  isLoading?: boolean;
}

const StatCard = ({ title, value, subtitle, icon, variant, isLoading }: StatCardProps) => {
  const iconClasses = {
    pink: 'text-pink-400 bg-pink-500/20',
    blue: 'text-blue-400 bg-blue-500/20',
    yellow: 'text-yellow-400 bg-yellow-500/20',
    green: 'text-green-400 bg-green-500/20',
    purple: 'text-purple-400 bg-purple-500/20',
    cyan: 'text-cyan-400 bg-cyan-500/20'
  };

  return (
    <PixelCard variant={variant}>
      <div className="absolute inset-0 p-6 flex flex-col h-full w-full text-white">
        {/* Header con icono */}
        <div className="flex items-center mb-4">
          <div className={`p-3 rounded-xl ${iconClasses[variant]} backdrop-blur-sm`}>
            {icon}
          </div>
          <h3 className="ml-3 text-lg font-semibold text-white/90">{title}</h3>
        </div>

        {/* Valor principal */}
        <div className="mb-3 flex-1 flex items-center justify-center">
          {isLoading ? (
            <div className="h-12 bg-gray-700/50 rounded-lg animate-pulse w-full"></div>
          ) : (
            <span className="text-4xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {value}
            </span>
          )}
        </div>

        {/* Subtítulo */}
        <p className="text-sm text-gray-300 leading-relaxed text-center">
          {subtitle}
        </p>
      </div>
    </PixelCard>
  );
};

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/summary')
      .then((res) => res.json())
      .then((data) => {
        setSummary(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching summary:', err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="relative min-h-full overflow-hidden">
      {/* Fondo con efecto hyperspeed */}
      <div className="absolute inset-0 z-0">
        <Hyperspeed
          effectOptions={{
            onSpeedUp: () => { },
            onSlowDown: () => { },
            distortion: 'turbulentDistortion',
            length: 400,
            roadWidth: 10,
            islandWidth: 2,
            lanesPerRoad: 4,
            fov: 90,
            fovSpeedUp: 150,
            speedUp: 2,
            carLightsFade: 0.4,
            totalSideLightSticks: 20,
            lightPairsPerRoadWay: 40,
            shoulderLinesWidthPercentage: 0.05,
            brokenLinesWidthPercentage: 0.1,
            brokenLinesLengthPercentage: 0.5,
            lightStickWidth: [0.12, 0.5],
            lightStickHeight: [1.3, 1.7],
            movingAwaySpeed: [60, 80],
            movingCloserSpeed: [-120, -160],
            carLightsLength: [400 * 0.03, 400 * 0.2],
            carLightsRadius: [0.05, 0.14],
            carWidthPercentage: [0.3, 0.5],
            carShiftX: [-0.8, 0.8],
            carFloorSeparation: [0, 5],
            colors: {
              roadColor: 0x080808,
              islandColor: 0x0a0a0a,
              background: 0x000000,
              shoulderLines: 0xFFFFFF,
              brokenLines: 0xFFFFFF,
              leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
              rightCars: [0x03B3C3, 0x0E5EA5, 0x324555],
              sticks: 0x03B3C3,
            }
          }}
        />
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-10"></div>

      {/* Contenido principal */}
      <div className="relative z-20 min-h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
              Mi Perfil
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
          </div>

          {/* Grid de estadísticas con PixelCard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <StatCard
              title="Juegos Completados"
              value={summary?.completedCount ?? '-'}
              subtitle={`Último completado: ${summary?.lastCompleted?.name ?? 'N/A'}`}
              icon={<Trophy className="w-6 h-6" />}
              variant="pink"
              isLoading={isLoading}
            />

            <StatCard
              title="Juegos en Progreso"
              value={summary?.inProgressCount ?? '-'}
              subtitle={`Actual: ${summary?.currentGame ?? 'N/A'}`}
              icon={<Gamepad2 className="w-6 h-6" />}
              variant="blue"
              isLoading={isLoading}
            />

            <StatCard
              title="Puntaje Total"
              value={summary?.totalScore?.toLocaleString() ?? '-'}
              subtitle={`Mejor: ${summary?.bestScore?.toLocaleString() ?? '-'} (${summary?.bestGame ?? 'N/A'})`}
              icon={<TrendingUp className="w-6 h-6" />}
              variant="yellow"
              isLoading={isLoading}
            />

            <StatCard
              title="Horas Jugadas"
              value={summary?.totalHoursPlayed ?? '-'}
              subtitle="Tiempo total invertido en gaming"
              icon={<Clock className="w-6 h-6" />}
              variant="green"
              isLoading={isLoading}
            />

            <StatCard
              title="Total de Juegos"
              value={summary?.totalGames ?? '-'}
              subtitle="Biblioteca completa de juegos"
              icon={<Star className="w-6 h-6" />}
              variant="purple"
              isLoading={isLoading}
            />

            <StatCard
              title="Ratio Completados"
              value={summary ? `${Math.round((summary.completedCount / summary.totalGames) * 100)}%` : '-'}
              subtitle="Porcentaje de juegos terminados"
              icon={<Target className="w-6 h-6" />}
              variant="cyan"
              isLoading={isLoading}
            />
          </div>

          {/* Información adicional */}
          <div className="bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-cyan-400" />
              Resumen de Actividad
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-400">{summary?.completedCount || 0}</div>
                <div className="text-gray-400">Juegos Completados</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400">{summary?.totalHoursPlayed || 0}</div>
                <div className="text-gray-400">Horas Jugadas</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400">1</div>
                <div className="text-gray-400">Plataformas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}