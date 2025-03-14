import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import { userReducer } from './slices/user'
import { walletReducer } from './slices/wallet'
import { userActivityStatusReducer } from './slices/userActivityStatus'
import storage from './customStorage'
import { logger } from './logger'

const userPersistConfig = {
  key: 'user',
  storage,
  version: 1.1,
  blacklist: ['fetched', 'updating', 'linking'],
}

const userActivityStatusPersistConfig = {
  key: 'userActivityStatus',
  storage,
  version: 1,
  blacklist: ['fetched', 'loading'],
}

const walletReducerConfig = {
  key: 'wallet',
  storage,
  version: 1,
}

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  userActivityStatus: persistReducer(userActivityStatusPersistConfig, userActivityStatusReducer),
  wallet: persistReducer(walletReducerConfig, walletReducer),
})

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }).concat(logger),
})

const persistor = persistStore(store)

export { store, persistor }

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
