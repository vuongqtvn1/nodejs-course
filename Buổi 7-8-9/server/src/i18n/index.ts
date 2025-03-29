// import { lstatSync, readdirSync } from 'fs'
// import i18next from 'i18next'
// import Backend from 'i18next-fs-backend'
// import middleware from 'i18next-http-middleware'
// import { join } from 'path'

// console.log(join(__dirname, '/locales'))

// i18next
//   .use(Backend)
//   .use(middleware.LanguageDetector)
//   .init({
//     fallbackLng: 'vi',
//     defaultNS: 'vi',
//     preload: readdirSync(join(__dirname, '/locales')).filter((fileName) => {
//       const joinedPath = join(join(__dirname, '/locales'), fileName)
//       const isDirectory = lstatSync(joinedPath).isDirectory()

//       console.log(isDirectory)
//       return isDirectory
//     }),
//     backend: {
//       loadPath: './locales/{{lng}}.json',
//     },
//   })

// export default i18next

import http from 'http'
import path from 'path'
import { I18n } from 'i18n'

export const i18nClient = new I18n({
  locales: ['en', 'vi'],
  defaultLocale: 'vi',
  directory: path.join(__dirname, 'locales'),
})
