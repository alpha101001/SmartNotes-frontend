import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './componentSlices/authSlice';
import notesReducer from './componentSlices/notesSlice';
import { apiSlice } from './apiSlices/api';

const RESET_STATE_ACTION_TYPE = 'RESET_STATE';

// Root reducer with state reset support
const rootReducerWithReset = (rootReducer) => (state, action) => {
	if (action.type === RESET_STATE_ACTION_TYPE) {
		state = undefined; // Reset the state
	}
	return rootReducer(state, action);
};

// Combine reducers for Redux store
const combinedReducer = combineReducers({
	auth: authReducer,
	notes: notesReducer,
	[apiSlice.reducerPath]: apiSlice.reducer, // Add API slice reducer
});

const rootReducer = rootReducerWithReset(combinedReducer);

// Configure the Redux store
export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false, // Avoid issues with non-serializable values (e.g., promises)
		}).concat(apiSlice.middleware), // Add RTK Query middleware
});

// Reset state action creator
export const resetState = () => ({
	type: RESET_STATE_ACTION_TYPE,
});

// Infer types for use throughout the app
export type StoreDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
