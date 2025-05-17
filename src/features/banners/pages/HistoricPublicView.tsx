import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  CardActions,
  Button,
  CircularProgress,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { bannerService } from '../services/BannerService'
import { Banner } from '../entities/Banner'

const HistoricPublicView = () => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await bannerService.getAllAuthenticated()
        setBanners(response.data)

        if (Array.isArray(response.data)) {
          setBanners(response.data)
        } else {
          console.warn('Respuesta inesperada de banners:', response)
          setBanners([])
        }
      } catch (error) {
        console.error('Error fetching banners:', error)
        setBanners([])
      } finally {
        setLoading(false)
      }
    }

    void fetchData()
  }, [])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    )
  }

  if (banners.length === 0) {
    return (
      <Box mt={6} textAlign="center">
        <Typography variant="h6">
          No hay publicaciones aprobadas por ahora.
        </Typography>
      </Box>
    )
  }

  return (
    <Box mt={6} px={{ xs: 2, sm: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        textAlign="center"
        fontWeight="bold"
      >
        Histórico de publicaciones
      </Typography>

      <Grid
        container
        spacing={3}
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
        }}
      >
        {banners.map((banner) => (
          <Box key={banner._id}>
            <Card
              elevation={3}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardMedia
                component="img"
                image={banner.imageUrl || '/placeholder-image.jpg'}
                alt="Imagen del banner"
                sx={{
                  aspectRatio: '16 / 9',
                  objectFit: 'cover',
                  width: '100%',
                  backgroundColor: '#f0f0f0',
                  borderBottom: '1px solid #ddd',
                }}
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = '/placeholder-image.jpg'
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  gutterBottom
                  noWrap
                >
                  {banner.description}
                </Typography>
                {banner.eventDate && (
                  <Typography variant="body2" color="text.secondary">
                    Fecha del evento:{' '}
                    {new Date(banner.eventDate).toLocaleDateString()}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mx: 1, mb: 1 }}
                >
                  Ver más
                </Button>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Grid>
    </Box>
  )
}

export default HistoricPublicView
