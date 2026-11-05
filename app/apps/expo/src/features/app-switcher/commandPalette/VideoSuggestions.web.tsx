import { Command } from 'cmdk'
import { useTranslation } from 'react-i18next'
import { FeatherIcon } from '~common/ui/Icon'
import { chercherVideos, useLangueVideos, type Video } from '~features/videos/catalogueVideos'
import { colorWithOpacity } from '~themes/colorValues'
import { useTheme } from '~themes/ThemeProvider'

/**
 * Empreinte · Les vidéos dans la recherche du haut : la page Vidéos n'a plus sa propre barre,
 * c'est ici qu'on les trouve (dans la langue choisie sur la page Vidéos).
 */
export default function VideoSuggestions({
  query,
  onSelect,
}: {
  query: string
  onSelect: (video: Video) => void
}) {
  const { t } = useTranslation()
  const theme = useTheme()
  const [langue] = useLangueVideos()
  const videos = chercherVideos(langue, query).slice(0, 6)
  if (!videos.length) return null
  return (
    <Command.Group heading={t('videos.title')}>
      {videos.map(video => (
        <Command.Item
          key={video.editionId}
          value={`video:${video.editionId}`}
          onSelect={() => onSelect(video)}
        >
          <span className="bs-command-item-label">
            <span
              className="bs-command-item-icon"
              aria-hidden="true"
              style={{ backgroundColor: colorWithOpacity(theme.colors.tertiary, 0.12) }}
            >
              <FeatherIcon name="play-circle" size={16} />
            </span>
            <span className="bs-command-item-text">{video.title}</span>
            <span className="bs-command-status">{video.reference || video.attributionLabel}</span>
          </span>
        </Command.Item>
      ))}
    </Command.Group>
  )
}
