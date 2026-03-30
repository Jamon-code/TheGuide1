import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlanState {
  resetTrigger: boolean;
  currentPlanId: string | null;
}

const initialState: PlanState = {
  resetTrigger: false,
  currentPlanId: null,
};

const planSlice = createSlice({
  name: 'plan',
  initialState,
  reducers: {
    triggerReset: (state) => {
      state.resetTrigger = true;
    },
    consumeReset: (state) => {
      state.resetTrigger = false;
    },
    setCurrentPlanId: (state, action: PayloadAction<string | null>) => {
      state.currentPlanId = action.payload;
    },
  },
});

export const { triggerReset, consumeReset, setCurrentPlanId } = planSlice.actions;
export default planSlice.reducer;