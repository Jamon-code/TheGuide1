import { configureStore } from '@reduxjs/toolkit';
import planReducer from './planSlice';
import plansReducer from './plansSlice';
import servicesReducer from './servicesSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    plan: planReducer,
    plans: plansReducer,
    services: servicesReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;