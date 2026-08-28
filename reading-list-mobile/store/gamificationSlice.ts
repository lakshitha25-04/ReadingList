import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type GamificationState = { streak: number; lastFinishedDate?: string; totalFinished: number; earnedBadges: string[] };
const yesterday = (date: string) => { const d = new Date(`${date}T00:00:00`); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10); };
const gamificationSlice = createSlice({ name: 'gamification', initialState: { streak: 2, totalFinished: 0, earnedBadges: [] } as GamificationState, reducers: {
  recordFinished: (state, action: PayloadAction<string>) => {
    const today = action.payload;
    if (state.lastFinishedDate !== today) { state.streak = state.lastFinishedDate === yesterday(today) ? state.streak + 1 : 1; state.lastFinishedDate = today; }
    state.totalFinished += 1;
    if (state.totalFinished >= 3 && !state.earnedBadges.includes('bookworm')) state.earnedBadges.push('bookworm');
    if (state.streak >= 3 && !state.earnedBadges.includes('on-fire')) state.earnedBadges.push('on-fire');
  },
  hydrateGamification: (_state, action: PayloadAction<GamificationState>) => action.payload,
} });
export const { recordFinished, hydrateGamification } = gamificationSlice.actions;
export default gamificationSlice.reducer;
