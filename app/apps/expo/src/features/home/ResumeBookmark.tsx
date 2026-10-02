import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { LinkBox } from '~common/Link'
import Box from '~common/ui/Box'
import { FeatherIcon, IonIcon } from '~common/ui/Icon'
import Text from '~common/ui/Text'
import books from '~assets/bible_versions/books-desc'
import { getBookmarkVerse } from '~features/bookmarks/bookmarkVerse'
import { Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { useOuvrirDansLaBible } from '~features/empreinte/ouvrirDansLaBible'
import { usePushRouteOnce } from '~navigation/usePushRouteOnce'
import { selectLatestAddedBookmark } from '~redux/selectors/bookmarks'

/** Resume the newest bookmark's current location, even after it has been moved. */
export default function ResumeBookmark({ card = false }: { card?: boolean }) {
  const { t } = useTranslation()
  const bookmark = useSelector(selectLatestAddedBookmark)
  const pushRoute = usePushRouteOnce()
  const router = useRouter()
  const ouvrirDansLaBible = useOuvrirDansLaBible()
  const verse = getBookmarkVerse(bookmark?.verse)
  const book = books.find(book => book.Numero === bookmark?.book)
  const reference = bookmark
    ? `${book ? t(book.Nom) : bookmark.book} ${bookmark.chapter}${verse ? `:${verse}` : ''}`
    : undefined

  // Empreinte : sur le web, la lecture reprend dans la Bible principale, en grand,
  // et non dans le panneau latéral réservé aux vérifications rapides.
  const reprendre = () => {
    if (Platform.OS === 'web') {
      if (!bookmark) return router.navigate('/')
      return ouvrirDansLaBible({
        book: bookmark.book,
        chapter: bookmark.chapter,
        verse,
        version: bookmark.version,
      })
    }
    pushRoute({
      pathname: '/bible-view',
      params: bookmark
        ? {
            contextDisplayMode: 'focused',
            book: String(bookmark.book),
            chapter: String(bookmark.chapter),
            ...(verse !== undefined && { verse: String(verse) }),
            ...(bookmark.version && { version: bookmark.version }),
          }
        : undefined,
    })
  }

  const action = (
    <LinkBox
      className={
        card
          ? 'flex-row items-center justify-center gap-[12px] bg-primary rounded-[12px] px-[18px] py-[13px]'
          : 'flex-row items-center gap-[12px] bg-primary rounded-[12px] px-[18px] py-[13px]'
      }
      accessibilityLabel={
        bookmark ? t('home.desktop.resumeBookmark', { reference }) : t('Lire la Bible')
      }
      onPress={reprendre}
    >
      <FeatherIcon name={bookmark ? 'bookmark' : 'book-open'} size={18} color="white" />
      <Box className="gap-[3px]">
        <Text className="text-[white] font-bold text-[13px]">
          {card ? t('Continuer') : bookmark ? t('home.desktop.resumeReading') : t('Lire la Bible')}
        </Text>
        {reference && !card && (
          <Text className="text-[white] text-[11px]">
            {reference}
            {bookmark?.version ? ` · ${bookmark.version}` : ''}
          </Text>
        )}
      </Box>
      <FeatherIcon name="arrow-right" size={17} color="white" />
    </LinkBox>
  )
  if (!card) return action
  return (
    <Box className="bg-reverse/60 border border-reverse/90 shadow-[0_8px_24px_rgba(17,17,19,0.06)] rounded-[24px] p-[16px] gap-[18px] shadow-[0_8px_24px_rgba(17,17,19,0.06)]">
      <Text className="font-bold text-[16px]">{t('home.desktop.resumeReading')}</Text>
      <LinkBox
        className="flex-row items-center gap-[16px]"
        accessibilityLabel={
          bookmark ? t('home.desktop.resumeBookmark', { reference }) : t('Lire la Bible')
        }
        onPress={reprendre}
      >
        <Box className="w-[44px] h-[44px] shrink-0 rounded-[12px] bg-light-grey items-center justify-center">
          <IonIcon
            name={bookmark ? 'bookmark' : 'book-outline'}
            size={22}
            color={bookmark?.color || 'primary'}
          />
        </Box>
        <Box className="flex-1 gap-[6px]">
          <Text className="text-[16px] font-bold">
            {reference ?? t('Lire la Bible')}
            {bookmark?.version ? ` · ${bookmark.version}` : ''}
          </Text>
          {bookmark?.name && (
            <Text className="text-grey text-[13px]" numberOfLines={1}>
              {bookmark.name}
            </Text>
          )}
          {!bookmark && (
            <Text className="text-grey text-[12px]">{t('home.dashboard.noBookmark')}</Text>
          )}
        </Box>
        <Box className="bg-light-primary rounded-full w-[28px] h-[28px] shrink-0 self-end items-center justify-center">
          <FeatherIcon name="chevron-right" size={17} color="primary" />
        </Box>
      </LinkBox>
    </Box>
  )
}
