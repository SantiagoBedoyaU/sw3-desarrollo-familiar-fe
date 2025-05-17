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
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { bannerService } from '../services/BannerService'
import { Banner } from '../entities/Banner'

const HistoricAdminView = () => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const fetchData = async (): Promise<void> => {
    setLoading(true)
    try {
      const response = await bannerService.getAllAuthenticated()
      setBanners(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error('Error fetching banners:', error)
      setBanners([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchData()
  }, [])

  const handleApprove = async (id: string): Promise<void> => {
    try {
      await bannerService.approveBanner(id)
      await fetchData()
    } catch (error) {
      console.error('Error approving banner:', error)
    }
  }

  const handleReject = async (): Promise<void> => {
    if (!selectedId) return
    try {
      await bannerService.deleteBanner(selectedId)
      setOpenDialog(false)
      await fetchData()
    } catch (error) {
      console.error('Error deleting banner:', error)
    }
  }

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
        <Typography variant="h6">No hay publicaciones disponibles.</Typography>
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
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
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

              <CardActions
                sx={{ flexDirection: 'column', gap: 1, px: 2, pb: 2 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ maxWidth: 200 }}
                  onClick={() => {
                    if (banner.externalLink)
                      window.open(banner.externalLink, '_blank')
                  }}
                >
                  Ver más
                </Button>

                {banner.approved ? (
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    sx={{ maxWidth: 200 }}
                    onClick={() => {
                      setSelectedId(banner._id)
                      setOpenDialog(true)
                    }}
                  >
                    Eliminar
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      sx={{ maxWidth: 200 }}
                      onClick={() => void handleApprove(banner._id)}
                    >
                      Aprobar
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      fullWidth
                      sx={{ maxWidth: 200 }}
                      onClick={() => {
                        setSelectedId(banner._id)
                        setOpenDialog(true)
                      }}
                    >
                      Rechazar
                    </Button>
                  </>
                )}
              </CardActions>
            </Card>
          </Box>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          ¿Estás seguro que deseas rechazar esta publicación?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={() => void handleReject()} color="error">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default HistoricAdminView
