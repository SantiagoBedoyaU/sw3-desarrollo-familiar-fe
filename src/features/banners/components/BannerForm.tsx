import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { BannerCreate } from '../entities/Banner'
import { bannerService } from '../services/BannerService'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Paper,
} from '@mui/material'
import * as yup from 'yup'
import { useState } from 'react'

const schema: yup.ObjectSchema<BannerCreate> = yup.object().shape({
  imageUrl: yup
    .string()
    .url('Debe ser una URL válida')
    .required('La imagen es obligatoria'),
  eventDate: yup
    .date()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .min(new Date(), 'Debe ser una fecha futura')
    .optional(),
  description: yup.string().required('La descripción es obligatoria'),
  externalLink: yup.string().url('URL inválida').optional(),
})

const CreateBanner = () => {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BannerCreate>({
    resolver: yupResolver(schema),
  })

  const onSubmit: SubmitHandler<BannerCreate> = async (data) => {
    try {
      console.log('Enviando datos:', data)
      await bannerService.createBanner(data)
      setSuccess(true)
      setError(false)
      reset()
    } catch (err) {
      console.error('Error al crear publicación:', err)
      setSuccess(false)
      setError(true)
    }
  }

  return (
    <Box sx={{ backgroundColor: '#f0f8ff', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="sm" sx={{ mt: 2 }}>
        <Paper elevation={4} sx={{ p: 5, borderRadius: 4 }}>
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" fontWeight="bold" color="#1e4b7a">
              Crear publicación del banner
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Ingresa los detalles de la publicación. La imagen es obligatoria.
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="URL de la imagen *"
              variant="outlined"
              fullWidth
              {...register('imageUrl')}
              error={!!errors.imageUrl}
              helperText={errors.imageUrl?.message}
            />

            <TextField
              label="Fecha del evento"
              type="date"
              variant="outlined"
              fullWidth
              {...register('eventDate')}
              InputLabelProps={{ shrink: true }}
              error={!!errors.eventDate}
              helperText={errors.eventDate?.message}
            />

            <TextField
              label="Descripción *"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              {...register('description')}
              error={!!errors.description}
              helperText={errors.description?.message}
            />

            <TextField
              label="Enlace externo"
              variant="outlined"
              fullWidth
              {...register('externalLink')}
              error={!!errors.externalLink}
              helperText={errors.externalLink?.message}
            />

            {success && (
              <Alert severity="success">
                ¡Publicación creada correctamente!
              </Alert>
            )}
            {error && (
              <Alert severity="error">
                Hubo un error al enviar el formulario.
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 1,
                backgroundColor: '#5395c1',
                '&:hover': { backgroundColor: '#417aa4' },
                fontWeight: 'bold',
              }}
            >
              Subir publicación
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default CreateBanner
