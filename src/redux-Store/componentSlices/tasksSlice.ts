import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Task {
	id: string;
	title: string;
	description: string;
	priority: string;
	dueDate: string;
	progress: number; // 0 to 100
}

interface TasksState {
	data: Task[];
}

const initialState: TasksState = {
	data: [],
};

export const tasksSlice = createSlice({
	name: 'tasks',
	initialState,
	reducers: {
		addTask(state, action: PayloadAction<Task>) {
			state.data.push(action.payload);
		},
		updateTask(state, action: PayloadAction<Task>) {
			const index = state.data.findIndex((t) => t.id === action.payload.id);
			if (index !== -1) {
				state.data[index] = action.payload;
			}
		},
		deleteTask(state, action: PayloadAction<string>) {
			state.data = state.data.filter((t) => t.id !== action.payload);
		},
	},
});

export const { addTask, updateTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;
