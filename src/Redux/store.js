import {combineReducers, configureStore} from "@reduxjs/toolkit"
import userReducer from "./reducers/userReducer"
import productReducer from "./reducers/productReducer"
import orderReducer from "./reducers/orderReducer"
import accountReducer from "./reducers/accountReducer"
import cartUserReducer from "./reducers/cartUserReducer"
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['product']
}

const rootReducer = combineReducers({
    user: userReducer,
    product: productReducer,
    order: orderReducer,
    account: accountReducer,
    cartUser: cartUserReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export let persistor = persistStore(store)