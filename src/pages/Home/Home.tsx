import React, { useEffect, useState } from 'react';
import CreateNote from '../../components/NoteManagement/CreateNote';
import { useGetNotesQuery } from '../../redux-Store/apiSlices/api';
import { Box, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import COLORS from '../../utils/Theme/colors';
import { useNavigate } from 'react-router-dom';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { FormValues } from '../../components/NoteManagement/NoteCard';
import DOMPurify from 'dompurify';
import { useAppDispatch } from '../../redux-Store/reduxHooks';
import { updateNote } from '../../redux-Store/componentSlices/notesSlice';
import useNotify from '../../utils/Helper/notify';
// import { Container } from './styles';

const Home: React.FC = () => {
	const navigate = useNavigate();
	const userId = localStorage.getItem('currentUserId');
	const { errorNotify } = useNotify();
	const [isNotified, setIsNotified] = useState(false);
	useEffect(() => {
		if (!userId) {
			errorNotify('Please login to continue');

			navigate('/login');
		}
	}, [userId]);

	const handleCreateNote = () => {
		navigate('/create-note');
	};
	const dispatch = useAppDispatch();
	const handleUpdateNote: SubmitHandler<FormValues> = (note) => {
		dispatch(
			updateNote({
				_id: note._id,
				title: note.title,
				content: note.content,
				isPinned: note.isPinned,
				file: note.files,
			})
		);

		navigate('/update-note');
	};
	const { handleSubmit, control, watch, setValue } = useForm<FormValues>({
		defaultValues: {
			title: '',
			content: '',
			isPinned: false,
			files: [],
		},
	});
	const { data: allUserNotes, isLoading } = useGetNotesQuery({});
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'row',
				gap: 2,
				alignItems: 'flex-start',
				// overflow: 'hidden',
			}}
		>
			{allUserNotes?.notes?.length === 0 ? (
				<CreateNote />
			) : (
				<Box>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							// maxWidth: '1000px', // Limit background width
							margin: '0 auto', // Center the content
							padding: '16px', // Add padding for spacing
							gap: 2,
						}}
					>
						<Box
							display="flex"
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							borderColor={COLORS.textColor}
						>
							<AddCircleOutlineIcon
								style={{
									fontSize: '80px',
									marginBottom: '8px',
									paddingBottom: '10px',
								}}
								sx={{
									color: COLORS.textColor,
									'&:hover': {
										color: COLORS.buttonColorHover,
									},
								}}
								onClick={handleCreateNote}
							/>
							<Box
								borderTop="1px solid #E0E0E0"
								// width="160px"
								alignItems="center"
								display="flex"
								justifyContent="center"
							>
								<Typography
									fontSize={16}
									gutterBottom
									color={COLORS.textColor}
									fontWeight={500}
									pt={1.5}
									sx={{
										textTransform: 'capitalize',
									}}
								>
									Create a new note
								</Typography>
							</Box>
						</Box>

						<Box
							sx={{
								display: 'grid',
								gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', // Dynamic columns
								gap: '20px', // Spacing between cards
								// maxWidth: '95vw', // Limit grid width
								margin: '0 auto', // Center the grid
								padding: '20px', // Outer padding
								backgroundColor: COLORS.backgroundColor, // Optional: add background color
								// minHeight: '80vh', // Optional: add min height
							}}
						>
							{allUserNotes?.notes?.map((note) => (
								<form
									onSubmit={(event) => {
										event.preventDefault(); // Prevent form submission from reloading the page
										handleUpdateNote(note);
									}}
								>
									<Box
										onClick={(event) => {
											// Trigger form submission programmatically
											event.currentTarget.closest('form')?.requestSubmit();
										}}
										sx={{
											display: 'flex',
											flexDirection: 'column',
											gap: 2,
											padding: '16px',
											border: `1px solid ${
												note.isPinned ? 'green' : COLORS.textColor
											}`,

											borderRadius: '8px',
											// minHeight: '150px',
											// backgroundColor: COLORS.cardBackgroundColor, // Optional: card background
											boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)', // Optional: add shadow
										}}
										key={note.id}
									>
										<Controller
											control={control}
											rules={{ required: true }}
											name="title"
											render={() => {
												return (
													<Typography
														variant="h6"
														color="yellow"
														sx={{
															wordWrap: 'break-word',
															// overflow: 'hidden',
															textOverflow: 'initial',
															fontWeight: 600,
															overflow: 'auto',
															maxHeight: '60px',
															minHeight: '60px',
															'&::-webkit-scrollbar': {
																width: '3px', // Width of the scrollbar
															},
															'&::-webkit-scrollbar-track': {
																backgroundColor:
																	COLORS.backgroundColor, // Track color
																borderRadius: '8px', // Rounded track
															},
															'&::-webkit-scrollbar-thumb': {
																backgroundColor: '#6b6b6b', // Thumb color
																borderRadius: '8px', // Rounded thumb
																border: `2px solid ${COLORS.textColor}`, // Optional border around thumb
																height: '100px', // Set thumb height and width
															},
															'&::-webkit-scrollbar-thumb:hover': {
																backgroundColor: COLORS.textColor, // Change color when hovered
															},
														}}
													>
														{note.title}
													</Typography>
												);
											}}
										/>
										<Controller
											control={control}
											rules={{ required: true }}
											name="content"
											render={({ field: { ...restField } }) => {
												const sanitizedContent = DOMPurify.sanitize(
													note.content
												);
												return (
													<Box
														{...restField}
														sx={{
															maxHeight: '200px',
															minHeight: '200px',
															overflow: 'auto',
															backgroundColor: COLORS.backgroundColor,
															color: COLORS.textColor,
															wordWrap: 'break-word',
															'&::-webkit-scrollbar': {
																width: '3px', // Width of the scrollbar
															},
															'&::-webkit-scrollbar-track': {
																backgroundColor:
																	COLORS.backgroundColor, // Track color
																borderRadius: '8px', // Rounded track
															},
															'&::-webkit-scrollbar-thumb': {
																backgroundColor: '#6b6b6b', // Thumb color
																borderRadius: '8px', // Rounded thumb
																border: `2px solid ${COLORS.textColor}`, // Optional border around thumb
																height: '100px', // Set thumb height and width
															},
															'&::-webkit-scrollbar-thumb:hover': {
																backgroundColor: COLORS.textColor, // Change color when hovered
															},
														}}
														dangerouslySetInnerHTML={{
															__html: sanitizedContent,
														}}
													/>
												);
											}}
										/>
									</Box>
								</form>
							))}
						</Box>
					</Box>
				</Box>
			)}
		</Box>
	);
};

export default Home;
