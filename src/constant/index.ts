const NODE_ENV = process.env.NODE_ENV
export const SHHARE_BASE_URL =
    NODE_ENV === 'development' ? 'http://localhost:8888/#/share-article/' : 'http://note.purevivi.chat/#/share-article/'
