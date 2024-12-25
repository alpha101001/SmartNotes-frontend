import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FileAttachment } from '../apiSlices/types';

export interface Note {
	_id?: string;
	title: string;
	content: string; // markdown content
	file: FileAttachment[];
	isPinned: boolean;
	pin?: boolean;
}

const initialState: Note = {
	_id: '',
	title: '',
	content: '',
	file: [],
	isPinned: false,
	pin: false,
};

export const notesSlice = createSlice({
	name: 'notes',
	initialState,
	reducers: {
		updateNote: (state, action: PayloadAction<Note>) => {
			state._id = action.payload._id;
			state.title = action.payload.title;
			state.content = action.payload.content;
			state.file = action.payload.file;
			state.isPinned = action.payload.isPinned;
			state.pin = action.payload.pin;
		},
		clearNoteData: (state) => {
			state.title = '';
			state.content = '';
			state.file = [];
			state.isPinned = false;
			state.pin = false;
		},
	},
});

export const { updateNote, clearNoteData } = notesSlice.actions;
export default notesSlice.reducer;
