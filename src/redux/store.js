import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import authReducer from './slices/authSlice'
import bookReducer from './slices/bookingSlice'

const authPersistConfig = {
  key: "user",
  storage
}

const bookPersistConfig = {
  key: "book",
  storage
}

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer)
const persistedBookReducer = persistReducer(bookPersistConfig, bookReducer)

const rootReducer = combineReducers({
  user: persistedAuthReducer,
  book: persistedBookReducer
})

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export const persistor = persistStore(store)
export default store