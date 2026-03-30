import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PlanItem {
  date: string;
  time: string;
  name: string;
  image: string;
  characteristics: Record<string, string>;
}

export interface PlanData {
  title: string;
  location: string;
  countryFlag: string;
  items: PlanItem[];
}

export interface Plan {
  id: string;
  planData: PlanData;
}

interface PlansState {
  plans: Plan[];
}

// Fonction pour parser une date française
const parseFrenchDate = (dateStr: string): Date => {
  const months: { [key: string]: number } = {
    'janvier': 0, 'février': 1, 'mars': 2, 'avril': 3, 'mai': 4, 'juin': 5,
    'juillet': 6, 'août': 7, 'septembre': 8, 'octobre': 9, 'novembre': 10, 'décembre': 11
  };
  
  const parts = dateStr.split(' ');
  const day = parseInt(parts[0]);
  const month = months[parts[1].toLowerCase()];
  const year = parseInt(parts[2]);
  
  return new Date(year, month, day);
};

// Fonction pour trier les plans par date de départ
const sortPlansByDate = (plans: Plan[]): Plan[] => {
  return [...plans].sort((a, b) => {
    const dateA = parseFrenchDate(a.planData.items[0]?.date || '');
    const dateB = parseFrenchDate(b.planData.items[0]?.date || '');
    return dateA.getTime() - dateB.getTime();
  });
};

const initialState: PlansState = {
  plans: [],
};

const plansSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    addPlan: (state, action: PayloadAction<Plan>) => {
      state.plans.push(action.payload);
      state.plans = sortPlansByDate(state.plans);
    },
    updatePlan: (state, action: PayloadAction<Plan>) => {
      const index = state.plans.findIndex(plan => plan.id === action.payload.id);
      if (index !== -1) {
        state.plans[index] = action.payload;
        state.plans = sortPlansByDate(state.plans);
      }
    },
    deletePlan: (state, action: PayloadAction<string>) => {
      state.plans = state.plans.filter(plan => plan.id !== action.payload);
    },
    setPlans: (state, action: PayloadAction<Plan[]>) => {
      state.plans = sortPlansByDate(action.payload);
    },
  },
});

export const { addPlan, updatePlan, deletePlan, setPlans } = plansSlice.actions;
export default plansSlice.reducer;