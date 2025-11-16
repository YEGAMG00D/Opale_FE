import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// ✅ Redux 관련 import 추가
import { Provider } from 'react-redux'
import store from './store'

import AppInitializer from "./AppInitializer";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ✅ Redux Provider로 App 감싸기 */}
    <Provider store={store}>
      <AppInitializer>
          <App />
        </AppInitializer>
    </Provider>
  </React.StrictMode>,
)
