import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AnyObject } from 'yup/lib/types';
import { RootState } from '..';
import { Note } from './types';

export const apiSlice = createApi({
	reducerPath: 'api',
	tagTypes: ['Auth', 'NoteAuthInfo', 'Notes'],
	baseQuery: fetchBaseQuery({
		baseUrl: import.meta.env.VITE_API_URL,
		prepareHeaders: (headers, { getState }) => {
			const token = (getState() as RootState).auth.token;
			if (token) {
				headers.set('authorization', `Bearer ${token}`);
			}
			return headers;
		},
	}),
	endpoints: (builder) => ({
		// ==========================
		// Auth Endpoints
		// ==========================

		// Login user
		loginUser: builder.mutation({
			query: (credentials: AnyObject) => ({
				url: 'auth/login',
				method: 'POST',
				body: credentials,
			}),
			invalidatesTags: ['Auth'],
		}),

		// Register user
		registerUser: builder.mutation({
			query: (userDetails: AnyObject) => ({
				url: 'auth/register',
				method: 'POST',
				body: userDetails,
			}),
			invalidatesTags: ['Auth'],
		}),

		// Verify OTP
		verifyOTP: builder.mutation({
			query: (otpData: AnyObject) => ({
				url: 'auth/verify-otp',
				method: 'POST',
				body: otpData,
			}),
			invalidatesTags: ['Auth'],
		}),

		// Resend OTP
		resendOTP: builder.mutation({
			query: (email: string) => ({
				url: 'auth/resend-otp',
				method: 'POST',
				body: { email },
			}),
			invalidatesTags: ['Auth'],
		}),

		// Reset Password
		resetPassword: builder.mutation({
			query: (resetData: AnyObject) => ({
				url: 'auth/reset-password',
				method: 'POST',
				body: resetData,
			}),
			invalidatesTags: ['Auth'],
		}),

		// Forgot Password
		forgotPassword: builder.mutation({
			query: (email: string) => ({
				url: 'auth/forgot-password',
				method: 'POST',
				body: { email },
			}),
			invalidatesTags: ['Auth'],
		}),

		// ==========================
		// Notes Endpoints
		// ==========================

		// Get all notes
		getNotes: builder.query({
			query: () => `notes`,
			providesTags: ['Notes'],
		}),

		// Get note by ID
		getNoteById: builder.query({
			query: (noteId: string) => `notes/${noteId}`,
			providesTags: ['Notes'],
		}),

		// Create note
		createNote: builder.mutation({
			query: (noteData: Note) => ({
				url: 'notes',
				method: 'POST',
				body: noteData,
			}),
			invalidatesTags: ['Notes'],
		}),

		// Update note
		updateNote: builder.mutation({
			query: ({ noteId, ...patch }: { noteId: string }) => ({
				url: `notes/${noteId}`,
				method: 'PUT',
				body: patch,
			}),
			invalidatesTags: ['Notes'],
		}),

		// Delete note
		deleteNote: builder.mutation({
			query: (noteId: string) => ({
				url: `notes/${noteId}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Notes'],
		}),

		// For searching notes
		searchNotes: builder.query({
			query: ({ searchTerm, pinned }: { searchTerm: string; pinned?: boolean }) => {
				let url = `notes/search/query?query=${encodeURIComponent(searchTerm)}`;
				if (pinned !== undefined) {
					url += `&pinned=${pinned ? 'true' : 'false'}`;
				}
				return url;
			},
			providesTags: ['Notes'],
		}),

		// ==========================
		// Images Endpoints
		// ==========================

		// // Get images by note ID
		// getImagesByNote: builder.query({
		// 	// example usage: getImagesByNote({ noteId: 'xxx', fileType: 'image', page: 1, limit: 5 })
		// 	query: ({
		// 		noteId,
		// 		fileType,
		// 		page = 1,
		// 		limit = 5,
		// 	}: {
		// 		noteId: string;
		// 		fileType?: string;
		// 		page?: number;
		// 		limit?: number;
		// 	}) => {
		// 		let url = `images/${noteId}?page=${page}&limit=${limit}`;
		// 		if (fileType) {
		// 			url += `&fileType=${fileType}`;
		// 		}
		// 		return url;
		// 	},
		// 	providesTags: ['Images'],
		// }),

		// // Create image
		// createImage: builder.mutation({
		// 	query: (imageData: AnyObject) => ({
		// 		url: 'images',
		// 		method: 'POST',
		// 		body: imageData,
		// 	}),
		// 	invalidatesTags: ['Images'],
		// }),

		// // Update image
		// updateImage: builder.mutation({
		// 	query: ({ imageId, ...patch }: { imageId: string; [key: string]: unknown }) => ({
		// 		url: `images/${imageId}`,
		// 		method: 'PUT',
		// 		body: patch,
		// 	}),
		// 	invalidatesTags: ['Images'],
		// }),

		// // Delete image
		// deleteImage: builder.mutation({
		// 	query: (imageId: string) => ({
		// 		url: `images/${imageId}`,
		// 		method: 'DELETE',
		// 	}),
		// 	invalidatesTags: ['Images'],
		// }),
	}),
});

// ===========================
// Export Hooks
// ===========================

export const {
	// Auth
	useLoginUserMutation,
	useRegisterUserMutation,
	useVerifyOTPMutation,
	useResendOTPMutation,
	useResetPasswordMutation,
	useForgotPasswordMutation,

	// Notes
	useGetNotesQuery,
	useGetNoteByIdQuery,
	useCreateNoteMutation,
	useUpdateNoteMutation,
	useDeleteNoteMutation,
	useSearchNotesQuery,

	// Images
	// useGetImagesByNoteQuery,
	// useCreateImageMutation,
	// useUpdateImageMutation,
	// useDeleteImageMutation,
} = apiSlice;
