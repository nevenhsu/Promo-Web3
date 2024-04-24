import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import { userReducer } from './slices/user'
import storage from './customStorage'
import { logger } from './logger'

const userPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['_id'],
  version: 1,
}

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
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
