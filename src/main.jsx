import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// ✅ Redux 관련 import 추가
import { Provider } from 'react-redux'
import store from './store'

import AppInitializer from "./AppInitializer";

// dev preview에서만 StrictMode 끄기
const isNetlifyPreview = window.location.hostname.includes("dev--")

ReactDOM.createRoot(document.getElementById('root')).render(
  isNetlifyPreview ? (
    // StrictMode OFF (dev 배포)
    <Provider store={store}>
      <AppInitializer>
        <App />
      </AppInitializer>
    </Provider>
  ) : (
    // 로컬 + main 배포
    <React.StrictMode>
      <Provider store={store}>
        <AppInitializer>
          <App />
        </AppInitializer>
      </Provider>
    </React.StrictMode>
  )
)
