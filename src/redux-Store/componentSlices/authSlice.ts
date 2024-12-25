import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
	isAuthenticated: boolean;
	token: string | null;
	currentUserEmail: string;
	currentUserName: string;
	currentUserId: string;
}

const initialState: AuthState = {
	isAuthenticated: false,
	token: localStorage.getItem('token'), // Load token from localStorage
	currentUserEmail: localStorage.getItem('currentUserEmail') || '',
	currentUserName: localStorage.getItem('currentUserName') || '',
	currentUserId: localStorage.getItem('currentUserId') || '',
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setIsAuthenticated(state, action: PayloadAction<boolean>) {
			state.isAuthenticated = action.payload;
			localStorage.setItem('isAuthenticated', JSON.stringify(action.payload));
		},
		setToken(state, action: PayloadAction<string>) {
			state.token = action.payload;
			localStorage.setItem('token', action.payload); // Cache token
		},
		setCurrentUserEmail(state, action: PayloadAction<string>) {
			state.currentUserEmail = action.payload;
			localStorage.setItem('currentUserEmail', action.payload); // Cache email
		},
		setCurrentUserName(state, action: PayloadAction<string>) {
			state.currentUserName = action.payload;
			localStorage.setItem('currentUserName', action.payload); // Cache name
		},
		setCurrentUserId(state, action: PayloadAction<string>) {
			state.currentUserId = action.payload;
			localStorage.setItem('currentUserId', action.payload); // Cache user ID
		},
		clearAuth(state) {
			// Clear all auth state and remove from localStorage
			state.isAuthenticated = false;
			state.token = null;
			state.currentUserEmail = '';
			state.currentUserName = '';
			state.currentUserId = '';
			localStorage.clear();
		},
	},
});

export const {
	setCurrentUserEmail,
	setCurrentUserName,
	setCurrentUserId,
	setToken,
	setIsAuthenticated,
	clearAuth,
} = authSlice.actions;
export default authSlice.reducer;
