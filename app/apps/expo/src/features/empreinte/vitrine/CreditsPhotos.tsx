import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Modal, ScrollView } from 'react-native'
import { LinkBox } from '~common/Link'
import { HStack } from '~common/ui/Box'
import Text from '~common/ui/Text'
import { auteursDesPhotos, PAGE_UNSPLASH, pageAuteur } from './photos'
import { Volet } from './Volet'

/**
 * Empreinte · Les crédits des photos des vitrines : une ligne discrète en bas de page qui
 * ouvre la liste des photographes, chacun avec un lien vers sa page Unsplash.
 */
export function CreditsPhotos() {
  const { t } = useTranslation()
  const [ouvert, setOuvert] = useState(false)
  return (
    <>
      <HStack className="items-center gap-[4px] flex-wrap">
        <Text className="text-grey text-[12px]">{t('vitrine.photosFrom')}</Text>
        <LinkBox onPress={() => Linking.openURL(PAGE_UNSPLASH)}>
          <Text className="text-grey text-[12px] underline">Unsplash</Text>
        </LinkBox>
        <Text className="text-grey text-[12px]">·</Text>
        <LinkBox onPress={() => setOuvert(true)}>
          <Text className="text-primary text-[12px] font-bold">{t('vitrine.photographers')}</Text>
        </LinkBox>
      </HStack>
      {ouvert ? (
        <Modal transparent visible animationType="fade" onRequestClose={() => setOuvert(false)}>
          <Volet titre={t('vitrine.photographers')} onFermer={() => setOuvert(false)}>
            <ScrollView>
              <HStack className="flex-wrap gap-[8px]">
                {auteursDesPhotos().map(photo => (
                  <LinkBox
                    key={photo.pseudo}
                    onPress={() => Linking.openURL(pageAuteur(photo))}
                    className="rounded-full px-[12px] h-[32px] justify-center bg-light-grey"
                  >
                    <Text className="text-[12px]">{photo.auteur}</Text>
                  </LinkBox>
                ))}
              </HStack>
            </ScrollView>
          </Volet>
        </Modal>
      ) : null}
    </>
  )
}
