import { Grid as MuiGrid, Typography, Avatar, Box } from '@mui/material';
import { EmojiEvents, SportsEsports, Timeline } from '@mui/icons-material';
import Hyperspeed from '../components/Hyperspeed';
import PixelCard from '../components/PixelCard';

const Grid = MuiGrid as any;

export default function Dashboard() {
  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
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
      <Box 
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          px: 3,
          width: '100%',
          maxWidth: 'lg',
          mx: 'auto',
        }}
      >
        <Grid container spacing={3} mt={4} justifyContent="center">
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
              Mi Perfil 
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <PixelCard variant="pink">
              <Box sx={{ 
                position: 'absolute',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
                color: 'white'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <EmojiEvents />
                  </Avatar>
                  <Typography variant="h6">
                    Juegos Completados
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ textAlign: 'center', my: 2 }}>
                  12
                </Typography>
                <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
                  Último juego completado: The Legend of Zelda
                </Typography>
              </Box>
            </PixelCard>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <PixelCard variant="blue">
              <Box sx={{ 
                position: 'absolute',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
                color: 'white'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                    <SportsEsports />
                  </Avatar>
                  <Typography variant="h6">
                    Juegos en Progreso
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ textAlign: 'center', my: 2 }}>
                  5
                </Typography>
                <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
                  Juego actual: God of War
                </Typography>
              </Box>
            </PixelCard>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <PixelCard variant="yellow">
              <Box sx={{ 
                position: 'absolute',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
                color: 'white'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                    <Timeline />
                  </Avatar>
                  <Typography variant="h6">
                    Puntaje Total
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ textAlign: 'center', my: 2 }}>
                  8,750
                </Typography>
                <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
                  Mejor puntaje: 1,200 (The Last of Us)
                </Typography>
              </Box>
            </PixelCard>
          </Grid>
        </Grid>
      </Box>
    </>
  );
} 