import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
import { useStoreValue } from 'zustand-x'
import { quizStore } from '../quizStore'

const LanguageToggleRaw = ({ hide }: { hide: boolean }) => {
  const language = useStoreValue(quizStore, 'language')
  const containerRef = useRef<HTMLDivElement>(null)
  const enRef = useRef<HTMLDivElement>(null)
  const deRef = useRef<HTMLDivElement>(null)
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 })

  const updateUnderline = useCallback(() => {
    const activeRef = language === 'en' ? enRef.current : deRef.current
    if (activeRef && containerRef.current) {
      setUnderlineStyle({
        left: activeRef.offsetLeft,
        width: activeRef.offsetWidth,
      })
    }
  }, [language])

  useEffect(() => {
    updateUnderline()
    window.addEventListener('resize', updateUnderline)
    return () => window.removeEventListener('resize', updateUnderline)
  }, [updateUnderline])

  const handleLanguageChange = useCallback(
    (newLang: 'en' | 'de') => {
      if (newLang !== language) {
        quizStore.set('toggleLanguage')
      }
    },
    [language],
  )

  if (hide) return null

  return (
    <Box
      ref={containerRef}
      className='language-toggle'
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1000,
        backgroundColor: 'transparent',
        display: 'flex',
        gap: 0,
      }}
    >
      <Box
        ref={enRef}
        onClick={() => handleLanguageChange('en')}
        sx={{
          cursor: 'pointer',
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'black',
          padding: '8px 12px',
          transition: 'opacity 0.2s',
          '&:hover': { opacity: 0.7 },
        }}
      >
        EN
      </Box>
      <Box
        ref={deRef}
        onClick={() => handleLanguageChange('de')}
        sx={{
          cursor: 'pointer',
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'black',
          padding: '8px 12px',
          transition: 'opacity 0.2s',
          '&:hover': { opacity: 0.7 },
        }}
      >
        DE
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          height: '2px',
          backgroundColor: 'black',
          transition: 'left 0.3s ease, width 0.3s ease',
          left: underlineStyle.left,
          width: underlineStyle.width,
        }}
      />
    </Box>
  )
}

export const LanguageToggle = memo(LanguageToggleRaw)
