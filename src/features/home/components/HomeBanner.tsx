import { useEffect, useRef, useState } from 'react'
import { getVisibleBanners } from '../services/HomeBannerService'
import useAuthStore from '../../../app/stores/useAuthStore'
import Button from '../../../shared/components/common/Button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Banner {
  id: string
  imageUrl: string
  description: string
  externalLink?: string
}

interface SignInData {
  userRole: number
  // otros campos si los necesitas
}

const HomeBanner = () => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userRole, setUserRole] = useState<number | null>(null)
  const { isAuthenticated } = useAuthStore()
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await getVisibleBanners()
        setBanners(data)
      } catch (err) {
        console.error('Error cargando banners:', err)
      }
    }
    void fetchBanners()
  }, [])

  useEffect(() => {
    const signInString = localStorage.getItem('signIn')
    try {
      const signIn: SignInData | null = signInString
        ? (JSON.parse(signInString) as SignInData)
        : null
      setUserRole(signIn?.userRole ?? null)
    } catch (error) {
      console.error('Error al parsear el signIn:', error)
      setUserRole(null)
    }
  }, [])

  useEffect(() => {
    if (banners.length <= 1) return
    const interval = setInterval(() => {
      handleNext()
    }, 5000)
    return () => clearInterval(interval)
  }, [banners, currentIndex])

  const handleViewMore = (url?: string) => {
    if (url) window.open(url, '_blank')
  }

  const scrollToIndex = (index: number) => {
    if (!sliderRef.current) return
    const container = sliderRef.current
    const width = container.clientWidth
    container.scrollTo({ left: index * width, behavior: 'smooth' })
  }

  const handlePrev = () => {
    const newIndex = currentIndex === 0 ? banners.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
    scrollToIndex(newIndex)
  }

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % banners.length
    setCurrentIndex(newIndex)
    scrollToIndex(newIndex)
  }

  return (
    <section className="text-center py-6">
      <h2 className="text-2xl font-semibold mb-4">Novedades</h2>

      <div className="relative w-full max-w-3xl mx-auto overflow-hidden rounded-2xl border border-gray-300 shadow">
        {banners.length > 0 ? (
          <div
            className="flex transition-transform duration-500 overflow-x-hidden"
            ref={sliderRef}
          >
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="min-w-full p-6 flex flex-col items-center bg-white"
              >
                <img
                  src={banner.imageUrl}
                  alt="Banner"
                  className="max-h-64 object-contain mb-4 rounded-md shadow"
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = '/icon.jpg'
                  }}
                />
                <p className="mb-2 text-lg text-gray-700 font-medium">
                  {banner.description}
                </p>
                {banner.externalLink && (
                  <Button onClick={() => handleViewMore(banner.externalLink)}>
                    Ver más
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10">No hay publicaciones disponibles.</div>
        )}

        {banners.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white shadow p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white shadow p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      <div className="flex justify-center gap-4 mt-6 flex-wrap">
        {isAuthenticated && (
          <Button
            type="button"
            onClick={() => (window.location.href = '/banners/create')}
            className="bg-[#5395c1]"
          >
            Crear publicación
          </Button>
        )}
        <Button
          type="button"
          onClick={() =>
            (window.location.href =
              userRole === 1 || userRole === 2
                ? '/banners/history'
                : '/banners/history_public')
          }
          className="bg-[#5395c1]"
        >
          Ver histórico
        </Button>
      </div>
    </section>
  )
}

export default HomeBanner
