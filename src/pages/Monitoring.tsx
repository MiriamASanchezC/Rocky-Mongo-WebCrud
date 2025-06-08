import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid as MuiGrid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from '@mui/material';
import {
  EmojiEvents,
  SportsEsports,
  Timeline,
} from '@mui/icons-material';
import Squares from '../components/Squares';

const Grid = MuiGrid as any;

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
    return <Typography>Cargando...</Typography>;
  }

  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <Squares 
          speed={0.5} 
          squareSize={40}
          direction='diagonal'
          borderColor='#fff'
          hoverFillColor='#222'
        />
      </div>
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h4" gutterBottom>
          Estadísticas y Rankings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top 5 Juegos
                </Typography>
                <List>
                  {topGames.map((game, index) => (
                    <Box key={game.id || game.name}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {index + 1}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={game.name}
                          secondary={`Plataforma: ${game.platform} | Puntaje: ${game.score}`}
                        />
                      </ListItem>
                      {index < topGames.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Estadísticas por Plataforma
                </Typography>
                <List>
                  {platformStats.map((stat) => (
                    <Box key={stat.platform}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'secondary.main' }}>
                            <SportsEsports />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={stat.platform}
                          secondary={`Juegos: ${stat.count} | Puntaje Total: ${stat.totalScore}`}
                        />
                      </ListItem>
                      {stat.platform !== platformStats[platformStats.length - 1].platform && <Divider />}
                    </Box>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Resumen de Actividad
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1 }}>
                        <EmojiEvents />
                      </Avatar>
                      <Typography variant="h6">{summary ? summary.totalGames : '-'}</Typography>
                      <Typography color="text.secondary">Juegos Totales</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 1 }}>
                        <Timeline />
                      </Avatar>
                      <Typography variant="h6">{summary ? summary.totalHoursPlayed : '-'}</Typography>
                      <Typography color="text.secondary">Horas Jugadas</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 1 }}>
                        <SportsEsports />
                      </Avatar>
                      <Typography variant="h6">{platformStats.length}</Typography>
                      <Typography color="text.secondary">Plataformas</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
