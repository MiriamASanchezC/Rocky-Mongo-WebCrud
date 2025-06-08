import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
} from '@mui/material';

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
//   hola mundo 


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

  useEffect(() => {
    if ((operationType === 'update' || operationType === 'delete') && searchName.length >= 2) {
      axios.get(`${API}/games/search?name=${searchName}`)
        .then(res => setMatchingGames(res.data))
        .catch(() => setMatchingGames([]));
    } else {
      setMatchingGames([]);
    }
  }, [searchName, operationType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (operationType === 'insert') {
        await axios.post(`${API}/games`, game);
        alert('Juego agregado exitosamente');
      } else if (operationType === 'update' && game.id) {
        await axios.put(`${API}/games/${game.id}`, game);
        alert('Juego actualizado');
      } else if (operationType === 'delete' && game.id) {
        await axios.delete(`${API}/games/${game.id}`);
        alert('Juego eliminado');
      }
    } catch (err) {
      alert('Ocurrió un error');
    }
  };

  const handleChange = (field: keyof Game) => (
    e: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    const value =
      e.target.type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
    setGame(prev => ({ ...prev, [field]: value }));
  };

  const handleGameSelect = (e: React.ChangeEvent<{ value: unknown }>) => {
    const selectedGame = matchingGames.find(g => g.id === e.target.value);
    if (selectedGame) setGame(selectedGame);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestión de Juegos
      </Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Tipo de Operación</InputLabel>
              <Select
                value={operationType}
                label="Tipo de Operación"
                onChange={(e) => {
                  setOperationType(e.target.value as OperationType);
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
                }}
              >
                <MenuItem value="insert">Agregar Juego</MenuItem>
                <MenuItem value="update">Actualizar Juego</MenuItem>
                <MenuItem value="delete">Eliminar Juego</MenuItem>
              </Select>
            </FormControl>

            {(operationType === 'update' || operationType === 'delete') && (
              <TextField
                fullWidth
                margin="normal"
                label="Buscar por nombre"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            )}

            {((operationType === 'update' || operationType === 'delete') && matchingGames.length > 0) && (
              <FormControl fullWidth margin="normal">
                <InputLabel>Selecciona un juego</InputLabel>
                <Select
                  value={game.id || ''}
                  label="Selecciona un juego"
                  onChange={handleGameSelect}
                >
                  {matchingGames.map((g) => (
                    <MenuItem key={g.id} value={g.id}>
                      {`${g.name} | ${g.platform}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {operationType === 'update' && (
              <TextField
                fullWidth
                margin="normal"
                label="ID del Juego"
                value={game.id || ''}
                InputProps={{ readOnly: true }}
              />
            )}

            {operationType === 'delete' && (
              <TextField
                fullWidth
                margin="normal"
                label="ID del Juego"
                value={game.id || ''}
                onChange={handleChange('id')}
                helperText="Este ID será usado para eliminar el juego"
              />
            )}

            {operationType !== 'delete' && (
              <>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Nombre del Juego"
                  value={game.name}
                  onChange={handleChange('name')}
                />

                <FormControl fullWidth margin="normal">
                  <InputLabel>Plataforma</InputLabel>
                  <Select
                    value={game.platform}
                    label="Plataforma"
                    onChange={handleChange('platform')}
                  >
                    <MenuItem value="PC">PC</MenuItem>
                    <MenuItem value="PlayStation">PlayStation</MenuItem>
                    <MenuItem value="Xbox">Xbox</MenuItem>
                    <MenuItem value="Nintendo">Nintendo</MenuItem>
                    <MenuItem value="Mobile">Mobile</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  margin="normal"
                  label="Puntaje"
                  type="number"
                  value={game.score}
                  onChange={handleChange('score')}
                  inputProps={{ min: 0, max: 100 }}
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Horas Jugadas"
                  type="number"
                  value={game.hoursPlayed}
                  onChange={handleChange('hoursPlayed')}
                  inputProps={{ min: 0 }}
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Última vez jugado"
                  type="date"
                  value={game.lastPlayed}
                  onChange={handleChange('lastPlayed')}
                  InputLabelProps={{ shrink: true }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={game.completed}
                      onChange={handleChange('completed')}
                    />
                  }
                  label="Juego Completado"
                />
              </>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              {operationType === 'insert' && 'Agregar Juego'}
              {operationType === 'update' && 'Actualizar Juego'}
              {operationType === 'delete' && 'Eliminar Juego'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
