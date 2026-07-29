import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const rootElement = document.getElementById('root')!

document.body.classList.add('bydash-mfe__body')
rootElement.classList.add('bydash-mfe__root')

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
