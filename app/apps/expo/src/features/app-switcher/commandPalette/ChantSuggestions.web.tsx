import { Command } from 'cmdk'
import { useTranslation } from 'react-i18next'
import { FeatherIcon } from '~common/ui/Icon'
import { chercherChants, type FicheChant } from '~features/chants/chants'
import { colorWithOpacity } from '~themes/colorValues'
import { useTheme } from '~themes/ThemeProvider'

/** Empreinte · Les chants dans la recherche du haut (titre, auteur ou paroles). */
export default function ChantSuggestions({
  query,
  onSelect,
}: {
  query: string
  onSelect: (chant: FicheChant) => void
}) {
  const { t } = useTranslation()
  const theme = useTheme()
  const chants = chercherChants(query).slice(0, 6)
  if (!chants.length) return null
  return (
    <Command.Group heading={t('chants.title')}>
      {chants.map(chant => (
        <Command.Item key={chant.id} value={`chant:${chant.id}`} onSelect={() => onSelect(chant)}>
          <span className="bs-command-item-label">
            <span
              className="bs-command-item-icon"
              aria-hidden="true"
              style={{ backgroundColor: colorWithOpacity(theme.colors.tertiary, 0.12) }}
            >
              <FeatherIcon name="music" size={16} />
            </span>
            <span className="bs-command-item-text">{chant.titre}</span>
            <span className="bs-command-status">{chant.auteur.split(' · ')[0]}</span>
          </span>
        </Command.Item>
      ))}
    </Command.Group>
  )
}
