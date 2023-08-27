import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";
import panelsReducer from "./panelsSlice";
import layersReducer from './layersSlice';

const panelsPersistConfig = {
  key: "panels",
  storage,
};

const panelsPersistedReducer = persistReducer(panelsPersistConfig, panelsReducer);

const rootReducer = combineReducers({
  panels: panelsPersistedReducer,
  layers: layersReducer, 
})

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk],
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>
