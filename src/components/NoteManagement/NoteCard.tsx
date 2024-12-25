import { Box } from '@mui/system';
import React, { useRef, useState } from 'react';
import RichTextEditor from '../TextEditor/RichTextEditor';
import COLORS from '../../utils/Theme/colors';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { CircularProgress, Modal, TextField, Typography } from '@mui/material';
import { textFieldStyles } from '../../utils/Helper/textFieldStyles';
import { LoadingButton } from '@mui/lab';
import { UploadFilesRef } from '../FileUploader.tsx/UploadFile';
import UploadFiles from '../FileUploader.tsx/UploadFile';
import { MdOutlinePushPin, MdPushPin } from 'react-icons/md';
import { useCreateNoteMutation, useUpdateNoteMutation } from '../../redux-Store/apiSlices/api';
import { FileAttachment } from '../../redux-Store/apiSlices/types';
import { useAppDispatch, useAppSelector } from '../../redux-Store/reduxHooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearNoteData } from '../../redux-Store/componentSlices/notesSlice';

export interface FormValues {
	_id?: string;
	title: string;
	content: string;
	isPinned: boolean;
	files: FileAttachment[];
	pin?: boolean;
}
export const getQuillStyles = () => {
	return {
		'& .ql-toolbar .ql-picker-label, & .ql-toolbar .ql-picker-item, & .ql-toolbar button': {
			color: COLORS.textColor,
			'&:hover': {
				stroke: COLORS.textColor,
			},
		},
		'& .ql-toolbar .ql-stroke': {
			fill: 'none',
			stroke: COLORS.textColor,
			'&:hover': {
				stroke: COLORS.textColor,
			},
		},
		'& .ql-toolbar .ql-fill': {
			fill: COLORS.textColor,
			stroke: 'none',
		},
		'& .ql-toolbar .ql-picker': {
			color: COLORS.textColor,
		},
		'.ql-container.ql-snow': {
			fontSize: '18px',
			color: '#fff!important',
		},
		'.ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options': {
			borderColor: COLORS.textColor,
			backgroundColor: COLORS.secondaryBackgroundColor,
			color: COLORS.textColor,
		},
	};
};
const NoteCard: React.FC = () => {
	const [isFocused, setIsFocused] = useState(false);
	const [hasValue, setHasValue] = useState(false);
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(true);
	const location = useLocation();
	const screen = location.pathname === '/create-note' ? 'Create' : 'Update';

	const {
		_id: noteId,
		title: noteTitle,
		content: noteContent,
		isPinned: pinNote,
		file: noteFiles,
	} = useAppSelector((state) => state.notes);

	const dispatch = useAppDispatch();

	const { currentUserId } = useAppSelector((state) => state.auth);
	const uploadRef = useRef<UploadFilesRef>(null);
	const { handleSubmit, control, watch, setValue } = useForm<FormValues>({
		defaultValues: {
			title: screen === 'Create' ? '' : noteTitle,
			content: screen === 'Create' ? '' : noteContent,
			isPinned: screen === 'Create' ? false : pinNote,
			files: screen === 'Create' ? [] : noteFiles,
		},
	});

	const [createNote, { isLoading: isNoteCreationLoading }] = useCreateNoteMutation();
	const [updateNote, { isLoading: isNoteUpdateLoading }] = useUpdateNoteMutation();
	const isPinned = watch('isPinned');
	const handlePinNote = () => {
		setValue('isPinned', !isPinned);
	};
	const handleFocus = () => {
		setIsFocused(true);
	};
	const handleBlur = (e) => {
		setIsFocused(false);
		setHasValue(!!e.target.value); // Check if the field has a value
	};
	// Cloudinary Config
	const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${
		import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
	}/image/upload`;
	const cloudinaryPreset = 'NoteFiles123';
	const handleClose = () => {
		setIsOpen(false);
		dispatch(clearNoteData());
		navigate('/');
	};
	// On Save Note
	const onSubmit: SubmitHandler<FormValues> = async (data) => {
		// 1. Request the child to upload all selected files
		const uploadedResults = await uploadRef.current?.uploadAllFiles();

		// 2. Convert child results to your local shape
		//    e.g. { secureUrl, fileType, originalName } => { name, type, url }
		const newImages =
			uploadedResults?.map((fileData) => ({
				fileName: fileData.originalName,
				fileType: fileData.fileType,
				fileUrl: fileData.secureUrl,
			})) || [];
		const createPayload = {
			title: data.title,
			content: data.content,
			files: [...data.files, ...newImages],
			isPinned: data.isPinned,
			userId: currentUserId ? currentUserId : '',
		};
		try {
			if (screen === 'Create') {
				await createNote(createPayload).unwrap();
			} else {
				await updateNote({ noteId, ...createPayload }).unwrap();
			}
		} catch (error) {
			// errorNotify('Error', error.message);
			return;
		}

		navigate('/');
	};
	const title = watch('title');
	const description = watch('content');
	const pin = watch('isPinned');
	return (
		<Modal open={isOpen} onClose={handleClose} sx={{ minHeight: '100vh' }}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Box
					component="fieldset"
					border="1px solid  #4E4F56"
					borderRadius={'4px'}
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: {
							xs: '100%', // 100% of the viewport width on small screens
							sm: '90%', // 90% on medium screens
							md: '80%', // 80% on large screens
							lg: '70%', // 70% on extra-large screens
						},
						height: {
							xs: '100%', // 100% of the viewport width on small screens
							sm: '90%', // 90% on medium screens
							md: '80%', // 80% on large screens
							lg: '81%', // 70% on extra-large screens
						},
						// minHeight: '70vh',
						bgcolor: COLORS.secondaryBackgroundColor,
						boxShadow: 24,
						p: 4,
						borderRadius: 2, // Optional rounded corners
						outline: 'none', // Removes default outline
						overflow: 'auto',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							flexDirection: 'row',
							pb: 1,
						}}
					>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'flex-start',
								alignItems: 'flex-start',
							}}
						>
							<Typography variant="h4" color={COLORS.textColor}>
								Take a Note
							</Typography>
						</Box>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'flex-end',
								alignItems: 'flex-end',
								gap: '20px',
								maxHeight: '5vh',
								pb: 1,
							}}
						>
							<Controller
								control={control}
								rules={{ required: false }}
								name="isPinned"
								render={() => (
									<LoadingButton
										// fullWidth
										variant="contained"
										size="large"
										sx={{
											backgroundColor: isPinned
												? COLORS.backgroundColor
												: COLORS.buttonColor,
											fontSize: '24px',
											fontWeight: 'bold',
											paddingX: '40px',
											paddingY: '13px',
											borderRadius: '40px',
											color: COLORS.textColor,

											'&:hover': {
												backgroundColor: isPinned
													? COLORS.secondaryBackgroundColor
													: COLORS.buttonColorHover,
												color: isPinned
													? COLORS.buttonColor
													: COLORS.textHoverColor,
											},
											textTransform: 'capitalize',
										}}
										onClick={handlePinNote}
										loadingIndicator={
											<CircularProgress
												size={24} // Customize size
												sx={{ color: COLORS.textColor }} // Customize color
											/>
										}
									>
										{isPinned ? <MdPushPin /> : <MdOutlinePushPin />}
									</LoadingButton>
								)}
							/>
							<LoadingButton
								type="submit"
								loading={
									screen === 'Create'
										? isNoteCreationLoading
										: isNoteUpdateLoading
								}
								variant="contained"
								size="small"
								sx={{
									display: 'flex',
									backgroundColor: COLORS.buttonColor,
									fontSize: '24px',
									fontWeight: 'bold',
									paddingX: '30px',
									borderRadius: '40px',
									mt: 2,
									color: COLORS.textColor,
									'&:hover': {
										backgroundColor: COLORS.buttonColorHover,
										color: COLORS.textHoverColor,
									},
									textTransform: 'capitalize',
								}}
								loadingIndicator={
									<CircularProgress
										size={24} // Customize size
										sx={{ color: COLORS.textColor }} // Customize color
									/>
								}
							>
								{screen === 'Create' ? 'Save Note' : 'Update Note'}
							</LoadingButton>
						</Box>
					</Box>
					<Controller
						control={control}
						rules={{ required: false }}
						name="title"
						render={({ field: { onChange, ...restField } }) => (
							<Box id="snr-ai-mockServer-box-title" sx={{ mb: 2 }}>
								<TextField
									{...restField}
									onFocus={handleFocus}
									onBlur={handleBlur}
									onChange={(e) => {
										onChange(e.target.value);
									}}
									fullWidth
									// variant="standard"
									label="Title"
									InputLabelProps={{ style: { color: COLORS.textColor } }}
									sx={{
										...textFieldStyles(),
										border: ` ${isFocused || hasValue ? '' : COLORS.textColor}`, // Set border color conditionally
										'& .MuiOutlinedInput-root': {
											'& fieldset': {
												borderColor:
													isFocused || hasValue ? '' : COLORS.textColor,
											},
										},
									}}
								/>
							</Box>
						)}
					/>
					<Controller
						control={control}
						rules={{ required: true }}
						name="content"
						render={({ field: { onChange, ...restField } }) => (
							<Box
								id="snr-ai-mockServer-box-description"
								sx={{
									'&>div ': {
										padding: 0,
										border: 'none!important',
										'& .ql-toolbar': {
											background: 'none',
											border: `1px solid ${COLORS.textColor}!important`,
											borderRadius: '4px',
										},
										'& .ql-container': {
											border: `1px solid ${COLORS.textColor}!important`,
											background: 'none',
											padding: '32px 8px',
										},
										...getQuillStyles(),
									},
								}}
							>
								<RichTextEditor
									{...restField}
									height={'45vh'}
									onChange={(value) => {
										onChange(value);
									}}
								/>
							</Box>
						)}
					/>
					{/* Images (deferred upload) */}
					<Controller
						control={control}
						name="files"
						// rules={{
						// 	validate: (arr) =>
						// 		arr.length <= 3 || 'You can only upload up to 3 images',
						// }}
						render={() => (
							<Box sx={{ mt: 2 }}>
								<UploadFiles
									ref={uploadRef} // <-- attach the ref
									cloudinaryUploadUrl={cloudinaryUploadUrl}
									cloudinaryPreset={cloudinaryPreset}
									// We do NOT do immediate onFilesUploaded here,
									// because we're deferring upload until "Save Note"
								/>
							</Box>
						)}
					/>
				</Box>
			</form>
		</Modal>
	);
};

export default NoteCard;
