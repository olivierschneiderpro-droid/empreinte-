import { useAtom } from 'jotai'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import { LinkBox } from '~common/Link'
import Box, { HStack } from '~common/ui/Box'
import { FeatherIcon } from '~common/ui/Icon'
import Text from '~common/ui/Text'
import { resolveFontFamily } from '~themes/styleValues'
import { useTheme } from '~themes/ThemeProvider'
import { progressionLivresAtom, titreChapitre, useChapitre, useLivre } from './livres'

function Bouton({
  icone,
  libelle,
  onPress,
  desactive,
}: {
  icone: React.ComponentProps<typeof FeatherIcon>['name']
  libelle: string
  onPress: () => void
  desactive?: boolean
}) {
  return (
    <LinkBox
      onPress={desactive ? undefined : onPress}
      accessibilityLabel={libelle}
      accessibilityState={{ disabled: desactive }}
      className="w-[38px] h-[38px] rounded-[12px] items-center justify-center bg-light-grey"
      style={{ opacity: desactive ? 0.35 : 1 }}
    >
      <FeatherIcon name={icone} size={18} />
    </LinkBox>
  )
}

/**
 * La lecture d'un livre, au format de la Bible : une barre (sommaire, précédent, suivant) et
 * le texte du chapitre dans la police de lecture. Sert sur la page du livre et à côté de la
 * Bible. La progression est retenue.
 */
export default function LectureLivre({ id, compact }: { id: string; compact?: boolean }) {
  const { t } = useTranslation()
  const theme = useTheme()
  const [progression, setProgression] = useAtom(progressionLivresAtom)
  const [sommaire, setSommaire] = useState(false)
  const livre = useLivre(id)
  const total = livre.data?.chapitres.length ?? 0
  const numero = Math.min(progression[id]?.chapitre ?? 0, Math.max(0, total - 1))
  const chapitre = useChapitre(id, numero)
  const aller = (n: number) => {
    setProgression({ ...progression, [id]: { chapitre: n } })
    setSommaire(false)
  }

  if (livre.isError) return <Text className="p-[22px] text-grey">{t('livres.unavailable')}</Text>
  if (!livre.data) return <Text className="p-[22px] text-grey">{t('livres.loading')}</Text>

  const titre = titreChapitre(livre.data.chapitres[numero]?.titre ?? '', numero, t('livres.part'))

  return (
    <Box className="flex-1">
      <HStack
        className={`items-center gap-[8px] py-[10px] border-b border-border ${compact ? 'px-[14px]' : ''}`}
      >
        <Bouton
          icone="list"
          libelle={t('livres.contents')}
          onPress={() => setSommaire(!sommaire)}
        />
        <Bouton
          icone="chevron-left"
          libelle={t('livres.previous')}
          onPress={() => aller(numero - 1)}
          desactive={numero === 0}
        />
        <Box className="flex-1">
          <Text className="font-bold text-[13px]" numberOfLines={1}>
            {titre}
          </Text>
          <Text className="text-grey text-[11px]">{`${numero + 1} / ${total}`}</Text>
        </Box>
        <Bouton
          icone="chevron-right"
          libelle={t('livres.next')}
          onPress={() => aller(numero + 1)}
          desactive={numero >= total - 1}
        />
      </HStack>

      {sommaire ? (
        <ScrollView contentContainerStyle={{ padding: compact ? 14 : 0, paddingTop: 12, gap: 4 }}>
          {livre.data.chapitres.map((item, n) => (
            <LinkBox
              key={n}
              onPress={() => aller(n)}
              accessibilityState={{ selected: n === numero }}
              className={`rounded-[12px] px-[12px] py-[10px] ${n === numero ? 'bg-light-grey' : ''}`}
            >
              <Text className={`text-[14px] ${n === numero ? 'font-bold' : ''}`}>
                {titreChapitre(item.titre, n, t('livres.part'))}
              </Text>
            </LinkBox>
          ))}
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={{
            padding: compact ? 22 : 0,
            paddingTop: 22,
            paddingBottom: 48,
            gap: 14,
            maxWidth: 760,
          }}
        >
          <Text
            className="text-[24px]"
            style={{ fontFamily: resolveFontFamily(theme.fontFamily.title) }}
          >
            {titre}
          </Text>
          {chapitre.isError ? (
            <Text className="text-grey">{t('livres.unavailable')}</Text>
          ) : !chapitre.data ? (
            <Text className="text-grey">…</Text>
          ) : (
            chapitre.data.paragraphes.map((paragraphe, n) => (
              <Text
                key={n}
                className="text-[17px] leading-[30px]"
                style={{ fontFamily: resolveFontFamily(theme.fontFamily.paragraph) }}
              >
                {paragraphe}
              </Text>
            ))
          )}
          {chapitre.data && numero < total - 1 ? (
            <LinkBox
              onPress={() => aller(numero + 1)}
              className="self-start flex-row items-center gap-[8px] rounded-full px-[16px] h-[40px] bg-light-grey mt-[10px]"
            >
              <Text className="font-bold text-[13px]">{t('livres.nextPart')}</Text>
              <FeatherIcon name="arrow-right" size={15} />
            </LinkBox>
          ) : null}
        </ScrollView>
      )}
    </Box>
  )
}
