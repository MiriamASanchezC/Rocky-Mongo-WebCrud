import { useState, useEffect } from 'react';
import {
  Database,
  Plus,
  Edit3,
  Trash2,
  Search,
  Save,
  Monitor,
  Gamepad2,
  Smartphone,
  Laptop,
  Tv,
  Calendar,
  Clock,
  Target,
  CheckCircle2,
  AlertCircle,
  Zap
} from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:8000/api';

type OperationType = 'insert' | 'update' | 'delete';

interface Game {
  id?: string;
  name: string;
  platform: string;
  score: number;
  completed: boolean;
  hoursPlayed: number;
  lastPlayed: string;
}

interface FormFieldProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
}

const FormField = ({ label, icon, children, variant = 'primary' }: FormFieldProps) => {
  const variantClasses = {
    primary: 'border-cyan-500/30 focus-within:border-cyan-500/60',
    secondary: 'border-purple-500/30 focus-within:border-purple-500/60',
    accent: 'border-pink-500/30 focus-within:border-pink-500/60'
  };

  return (
    <div className={`group relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border ${variantClasses[variant]} rounded-xl p-4 transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex items-center mb-3">
        <div className="text-cyan-400 mr-2">{icon}</div>
        <label className="text-sm font-medium text-gray-300 group-focus-within:text-white transition-colors duration-300">
          {label}
        </label>
      </div>
      {children}
    </div>
  );
};

export default function Operations() {
  const [operationType, setOperationType] = useState<OperationType>('insert');
  const [game, setGame] = useState<Game>({
    name: '',
    platform: '',
    score: 0,
    completed: false,
    hoursPlayed: 0,
    lastPlayed: new Date().toISOString().split('T')[0],
  });
  const [searchName, setSearchName] = useState('');
  const [matchingGames, setMatchingGames] = useState<Game[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    if ((operationType === 'update' || operationType === 'delete') && searchName.length >= 2) {
      axios.get(`${API}/games/search?name=${searchName}`)
        .then(res => setMatchingGames(res.data))
        .catch(() => setMatchingGames([]));
    } else {
      setMatchingGames([]);
    }
  }, [searchName, operationType]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (operationType === 'insert') {
        await axios.post(`${API}/games`, game);
        showNotification('success', 'Juego agregado exitosamente');
      } else if (operationType === 'update' && game.id) {
        await axios.put(`${API}/games/${game.id}`, game);
        showNotification('success', 'Juego actualizado correctamente');
      } else if (operationType === 'delete' && game.id) {
        await axios.delete(`${API}/games/${game.id}`);
        showNotification('success', 'Juego eliminado correctamente');
      }
      
      // Reset form after successful operation
      if (operationType === 'insert' || operationType === 'delete') {
        setGame({
          name: '',
          platform: '',
          score: 0,
          completed: false,
          hoursPlayed: 0,
          lastPlayed: new Date().toISOString().split('T')[0],
        });
      }
    } catch (err) {
      showNotification('error', 'Ocurrió un error durante la operación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof Game) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : e.target.value;
    setGame(prev => ({ ...prev, [field]: value }));
  };

  const handleGameSelect = (gameId: string) => {
    const selectedGame = matchingGames.find(g => g.id === gameId);
    if (selectedGame) setGame(selectedGame);
  };

  const resetForm = () => {
    setGame({
      name: '',
      platform: '',
      score: 0,
      completed: false,
      hoursPlayed: 0,
      lastPlayed: new Date().toISOString().split('T')[0],
    });
    setSearchName('');
    setMatchingGames([]);
  };

  const getOperationIcon = () => {
    switch (operationType) {
      case 'insert': return <Plus className="w-5 h-5" />;
      case 'update': return <Edit3 className="w-5 h-5" />;
      case 'delete': return <Trash2 className="w-5 h-5" />;
    }
  };

  const getOperationColor = () => {
    switch (operationType) {
      case 'insert': return 'from-green-500 to-emerald-500';
      case 'update': return 'from-blue-500 to-cyan-500';
      case 'delete': return 'from-red-500 to-pink-500';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'pc': return <Monitor className="w-4 h-4" />;
      case 'playstation': return <Gamepad2 className="w-4 h-4" />;
      case 'xbox': return <Gamepad2 className="w-4 h-4" />;
      case 'nintendo': return <Tv className="w-4 h-4" />;
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      default: return <Laptop className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative min-h-full overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5"></div>
      
      {/* Notificación */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl backdrop-blur-sm border transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-green-900/80 border-green-500/50 text-green-400' 
            : 'bg-red-900/80 border-red-500/50 text-red-400'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="relative z-10 min-h-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-400 via-cyan-500 to-blue-400 bg-clip-text text-transparent mb-4">
              Gestión de Juegos
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full"></div>
            <p className="text-gray-400 mt-4 text-lg">Sistema de administración de base de datos gaming</p>
          </div>

          {/* Operation Type Selector */}
          <div className="mb-8">
            <FormField label="Tipo de Operación" icon={<Database className="w-5 h-5" />} variant="primary">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['insert', 'update', 'delete'] as OperationType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setOperationType(type);
                      resetForm();
                    }}
                    className={`group relative p-4 rounded-xl border transition-all duration-300 ${
                      operationType === type
                        ? 'border-cyan-500/60 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 shadow-lg shadow-cyan-500/20'
                        : 'border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/30'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        operationType === type ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-700/50 text-gray-400'
                      }`}>
                        {type === 'insert' && <Plus className="w-5 h-5" />}
                        {type === 'update' && <Edit3 className="w-5 h-5" />}
                        {type === 'delete' && <Trash2 className="w-5 h-5" />}
                      </div>
                      <span className={`font-medium ${
                        operationType === type ? 'text-white' : 'text-gray-300'
                      }`}>
                        {type === 'insert' ? 'Agregar Juego' : type === 'update' ? 'Actualizar Juego' : 'Eliminar Juego'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </FormField>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Search for Update/Delete */}
            {(operationType === 'update' || operationType === 'delete') && (
              <FormField label="Buscar Juego" icon={<Search className="w-5 h-5" />} variant="secondary">
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Escribe el nombre del juego..."
                  className="w-full bg-transparent text-white placeholder-gray-500 border-none outline-none text-lg"
                />
                
                {matchingGames.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-400 mb-3">Juegos encontrados:</p>
                    <div className="grid gap-2 max-h-48 overflow-y-auto">
                      {matchingGames.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => handleGameSelect(g.id!)}
                          className={`p-3 rounded-lg border text-left transition-all duration-300 hover:scale-[1.02] ${
                            game.id === g.id
                              ? 'border-purple-500/60 bg-purple-500/20'
                              : 'border-gray-700/50 hover:border-gray-600/50 bg-gray-800/30'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            {getPlatformIcon(g.platform)}
                            <div>
                              <div className="text-white font-medium">{g.name}</div>
                              <div className="text-gray-400 text-sm">{g.platform} • Score: {g.score}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </FormField>
            )}

            {/* Game ID Display for Update */}
            {operationType === 'update' && game.id && (
              <FormField label="ID del Juego" icon={<Target className="w-5 h-5" />} variant="accent">
                <input
                  type="text"
                  value={game.id}
                  readOnly
                  className="w-full bg-gray-800/50 text-gray-400 border border-gray-700/50 rounded-lg px-4 py-3 text-lg"
                />
              </FormField>
            )}

            {/* Game Details Form */}
            {operationType !== 'delete' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Game Name */}
                <FormField label="Nombre del Juego" icon={<Gamepad2 className="w-5 h-5" />}>
                  <input
                    type="text"
                    value={game.name}
                    onChange={handleChange('name')}
                    placeholder="Ej: Cyberpunk 2077"
                    required
                    className="w-full bg-transparent text-white placeholder-gray-500 border-none outline-none text-lg"
                  />
                </FormField>

                {/* Platform */}
                <FormField label="Plataforma" icon={<Monitor className="w-5 h-5" />}>
                  <select
                    value={game.platform}
                    onChange={handleChange('platform')}
                    required
                    className="w-full bg-gray-800/50 text-white border border-gray-700/50 rounded-lg px-4 py-3 text-lg focus:border-cyan-500/60 focus:outline-none transition-colors duration-300"
                  >
                    <option value="">Selecciona una plataforma</option>
                    <option value="PC">PC</option>
                    <option value="PlayStation">PlayStation</option>
                    <option value="Xbox">Xbox</option>
                    <option value="Nintendo">Nintendo</option>
                    <option value="Mobile">Mobile</option>
                  </select>
                </FormField>

                {/* Score */}
                <FormField label="Puntaje (0-100)" icon={<Target className="w-5 h-5" />}>
                  <input
                    type="number"
                    value={game.score}
                    onChange={handleChange('score')}
                    min="0"
                    max="100"
                    className="w-full bg-transparent text-white border-none outline-none text-lg"
                  />
                </FormField>

                {/* Hours Played */}
                <FormField label="Horas Jugadas" icon={<Clock className="w-5 h-5" />}>
                  <input
                    type="number"
                    value={game.hoursPlayed}
                    onChange={handleChange('hoursPlayed')}
                    min="0"
                    className="w-full bg-transparent text-white border-none outline-none text-lg"
                  />
                </FormField>

                {/* Last Played */}
                <FormField label="Última vez jugado" icon={<Calendar className="w-5 h-5" />}>
                  <input
                    type="date"
                    value={game.lastPlayed}
                    onChange={handleChange('lastPlayed')}
                    className="w-full bg-gray-800/50 text-white border border-gray-700/50 rounded-lg px-4 py-3 text-lg focus:border-cyan-500/60 focus:outline-none transition-colors duration-300"
                  />
                </FormField>

                {/* Completed Toggle */}
                <FormField label="Estado del Juego" icon={<CheckCircle2 className="w-5 h-5" />}>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={game.completed}
                      onChange={handleChange('completed')}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full transition-all duration-300 ${
                      game.completed ? 'bg-green-500' : 'bg-gray-600'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 ${
                        game.completed ? 'translate-x-6' : 'translate-x-1'
                      } mt-0.5`}></div>
                    </div>
                    <span className={`text-lg font-medium ${game.completed ? 'text-green-400' : 'text-gray-400'}`}>
                      {game.completed ? 'Completado' : 'En progreso'}
                    </span>
                  </label>
                </FormField>
              </div>
            )}

            {/* Delete Confirmation */}
            {operationType === 'delete' && game.id && (
              <div className="bg-gradient-to-br from-red-900/20 to-pink-900/20 border border-red-500/30 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                  <h3 className="text-xl font-bold text-red-400">Confirmar Eliminación</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  ¿Estás seguro de que quieres eliminar "{game.name}"? Esta acción no se puede deshacer.
                </p>
                <div className="bg-red-900/30 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-400">Juego:</span> <span className="text-white">{game.name}</span></div>
                    <div><span className="text-gray-400">Plataforma:</span> <span className="text-white">{game.platform}</span></div>
                    <div><span className="text-gray-400">Puntaje:</span> <span className="text-white">{game.score}</span></div>
                    <div><span className="text-gray-400">Horas:</span> <span className="text-white">{game.hoursPlayed}</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting || (operationType !== 'insert' && !game.id)}
                className={`group relative w-full overflow-hidden rounded-xl border p-4 font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  !isSubmitting && (operationType === 'insert' || game.id)
                    ? `border-transparent bg-gradient-to-r ${getOperationColor()} hover:scale-[1.02] shadow-lg`
                    : 'border-gray-700/50 bg-gray-800/50 text-gray-400'
                }`}
              >
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                
                <div className="relative flex items-center justify-center space-x-3">
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      {getOperationIcon()}
                      <span>
                        {operationType === 'insert' && 'Agregar Juego'}
                        {operationType === 'update' && 'Actualizar Juego'}
                        {operationType === 'delete' && 'Eliminar Juego'}
                      </span>
                      <Zap className="w-5 h-5" />
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}