import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { message } from 'antd'
import store from './store'
import './styles/bootstrap-layer.css'
import './styles/index.css'
import App from './App.jsx'

message.config({ top: 80, duration: 3 })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
