import React, { useState, useCallback, useImperativeHandle, forwardRef, Ref } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import {
	Modal,
	Box,
	Typography,
	Card,
	CardMedia,
	CardContent,
	IconButton,
	CircularProgress,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';
import COLORS from '../../utils/Theme/colors';
import LoadingButton from '../../utils/Helper/LoadingButton';
import { useAppSelector } from '../../redux-Store/reduxHooks';

// ----------------------------------------------
// Types
// ----------------------------------------------
interface IUploadedFile {
	secureUrl: string; // final Cloudinary URL after upload
	fileType: string; // 'image', 'video', 'pdf', etc.
	originalName: string; // e.g. 'myPhoto.png'
}

interface ILocalFile {
	file: File; // actual file object
	previewUrl: string; // local URL for preview
	fileType: string; // 'image', 'pdf', etc. (optional)
	originalName: string; // e.g. 'myPhoto.png'
}

export interface UploadFilesRef {
	/**
	 * Called by the parent to upload all selected files to Cloudinary
	 * Returns an array of IUploadedFile
	 */
	uploadAllFiles: () => Promise<IUploadedFile[]>;
}

interface UploadFilesProps {
	// Called AFTER files have been successfully uploaded
	// You can decide if you want to call this or if you'll just
	// get the result via the parent's ref call (both are valid).
	onFilesUploaded?: (files: IUploadedFile[]) => void;

	// Cloudinary info
	cloudinaryUploadUrl: string;
	cloudinaryPreset?: string;
}

/**
 * A reusable component for selecting files, previewing them, and
 * deferring upload until the parent calls `uploadAllFiles()`.
 */
const UploadFiles = forwardRef<UploadFilesRef, UploadFilesProps>(
	({ onFilesUploaded, cloudinaryUploadUrl, cloudinaryPreset }, ref) => {
		const { file: noteFiles } = useAppSelector((state) => state.notes);
		const newFilesArray = noteFiles.map((file) => ({
			file: new File([''], file.fileName), // Creating a mock File object (replace with actual file object if available)
			previewUrl: file.fileUrl, // Local URL for preview
			fileType: file.fileType, // 'image', 'pdf', etc.
			originalName: file.fileName, // Original file name
		}));
		// ----------------------------------------------
		// State
		// ----------------------------------------------
		// We store the selected files locally, with a local "previewUrl" for images.
		const [localFiles, setLocalFiles] = useState<ILocalFile[]>([...newFilesArray]);

		// For UI
		const [isModalOpen, setIsModalOpen] = useState(false);
		const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);
		const [loading, setLoading] = useState(false);

		// ----------------------------------------------
		// UI handlers
		// ----------------------------------------------
		const handleOpenModal = () => setIsModalOpen(true);
		const handleCloseModal = () => setIsModalOpen(false);
		const handleOpenMoreModal = () => setIsMoreModalOpen(true);
		const handleCloseMoreModal = () => setIsMoreModalOpen(false);

		// ----------------------------------------------
		// Dropzone
		// ----------------------------------------------
		const onDrop = useCallback((acceptedFiles: File[]) => {
			const mapped = acceptedFiles.map((file) => {
				const previewUrl = URL.createObjectURL(file);

				// Rough file type guess (optional)
				let fileType = 'other';
				if (file.type.startsWith('image')) fileType = 'image';
				if (file.type.startsWith('video')) fileType = 'video';
				if (file.type.includes('pdf')) fileType = 'pdf';
				if (file.type.includes('word')) fileType = 'doc';
				if (file.type.includes('sheet')) fileType = 'xls';

				return {
					file,
					previewUrl,
					fileType,
					originalName: file.name,
				};
			});

			setLocalFiles((prev) => [...prev, ...mapped]);
		}, []);

		const { getRootProps, getInputProps, isDragActive } = useDropzone({
			onDrop,
			multiple: true,
		});

		// ----------------------------------------------
		// Remove file (before upload)
		// ----------------------------------------------
		const handleRemoveFile = (index: number) => {
			const updated = [...localFiles];
			updated.splice(index, 1);
			setLocalFiles(updated);
		};

		// ----------------------------------------------
		// Main Upload logic (called via ref)
		// ----------------------------------------------
		const uploadAllFiles = async (): Promise<IUploadedFile[]> => {
			// This is called by the parent (ex: on Save Note)
			if (!localFiles.length) return []; // no files to upload
			setLoading(true);

			const results: IUploadedFile[] = [];
			try {
				for (const localFile of localFiles) {
					const formData = new FormData();
					formData.append('file', localFile.file);

					if (cloudinaryPreset) {
						formData.append('upload_preset', cloudinaryPreset);
					}

					const response = await axios.post(cloudinaryUploadUrl, formData);
					const secureUrl = response.data.secure_url;

					results.push({
						secureUrl,
						fileType: localFile.fileType,
						originalName: localFile.originalName,
					});
				}
			} catch (error) {
				console.error('Cloudinary upload error:', error);
			}

			setLoading(false);

			// If we want to clear localFiles after successful upload, we can do so:
			// setLocalFiles([]);

			// Optionally notify the parent
			if (onFilesUploaded) {
				onFilesUploaded(results);
			}

			return results;
		};

		// Use forwardRef to expose `uploadAllFiles` to the parent
		useImperativeHandle(ref, () => ({
			uploadAllFiles,
		}));

		// ----------------------------------------------
		// Render Previews
		// ----------------------------------------------
		const renderPreview = (fileData: ILocalFile, index: number) => {
			if (fileData.fileType === 'image') {
				return (
					<Card
						key={index}
						sx={{
							width: 80,
							height: 80,
							marginRight: '8px',
							position: 'relative',
							mt: 5,
							ml: index === 0 ? 5 : 1,
							'&:hover': {
								transform: index < 5 ? 'scale(1.5)' : 'scale(2)', // Scale up the card on hover
								zIndex: 5, // Bring the card to the front while
								translateY: '-50%', // Center the card vertically
							},
						}}
					>
						<IconButton
							size="small"
							sx={{
								position: 'absolute',
								top: -8.9,
								right: -5,
								zIndex: 2,
								mt: 0.5,
								borderRadius: '50%',
								borderColor: COLORS.buttonColor,
							}}
							onClick={() => handleRemoveFile(index)}
						>
							<CloseIcon
								fontSize="small"
								sx={{
									color: COLORS.textColor,
									backgroundColor: 'black',
									borderRadius: '50%',
								}}
							/>
						</IconButton>
						<CardMedia
							component="img"
							image={fileData.previewUrl}
							alt={fileData.originalName}
							sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
						/>
					</Card>
				);
			} else {
				const truncatedName =
					fileData.originalName.length > 10
						? fileData.originalName.substring(0, 10) + '...'
						: fileData.originalName;

				return (
					<Card
						key={index}
						sx={{
							width: 80,
							height: 80,
							marginRight: '8px',
							position: 'relative',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<IconButton
							size="small"
							sx={{ position: 'absolute', top: 0, right: 0, zIndex: 2 }}
							onClick={() => handleRemoveFile(index)}
						>
							<CloseIcon fontSize="small" />
						</IconButton>
						<CardContent>
							<Typography variant="body2" textAlign="center">
								{truncatedName}
							</Typography>
						</CardContent>
					</Card>
				);
			}
		};

		// Show first 5 inline, rest in "More" modal
		const previewFiles = localFiles.slice(0, 5);
		const remaining = localFiles.slice(5);

		// ----------------------------------------------
		// Component Return
		// ----------------------------------------------
		return (
			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				{/* Add Files Button */}
				<LoadingButton
					variant="contained"
					startIcon={<AddCircleIcon />}
					onClick={handleOpenModal}
					sx={{
						py: 1,
						mt: 9,
						mb: 3,
						backgroundColor: COLORS.buttonColor,
						fontSize: '24px',
						fontWeight: 'bold',
						paddingX: '40px',
						borderRadius: '40px',
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
					Add Files
				</LoadingButton>

				{/* Previews (up to 5) */}
				{previewFiles.map((fileData, index) => renderPreview(fileData, index))}

				{/* If more than 5, show "More" card */}
				{remaining.length > 0 && (
					<Card
						sx={{
							width: 80,
							height: 80,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							backgroundColor: COLORS.buttonColor,
							mt: 5,
							ml: 1,
						}}
						onClick={handleOpenMoreModal}
					>
						<MoreHorizIcon />
					</Card>
				)}

				{/* Dropzone Modal */}
				<Modal open={isModalOpen} onClose={handleCloseModal}>
					<Box
						sx={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							width: {
								xs: '80%', // 90% of the viewport width on small screens
								sm: '60%', // 70% on medium screens
								md: '40%', // 50% on large screens
								lg: '30%', // 40% on extra-large screens
							},
							height: {
								xs: 'auto', // Adjust height automatically for small screens
								md: 'auto', // Or set a percentage for medium/large screens
							},
							minHeight: '10vh',
							bgcolor: COLORS.secondaryBackgroundColor,
							boxShadow: 24,
							p: {
								xs: 2, // Smaller padding on small screens
								md: 4, // Larger padding on larger screens
							},
							borderRadius: 2,
							outline: 'none',
						}}
					>
						<Typography variant="h6" gutterBottom color={COLORS.textColor}>
							Select Files
						</Typography>
						<Box
							{...getRootProps()}
							color={COLORS.textColor}
							sx={{
								border: '2px dashed #ccc',
								borderRadius: '8px',
								p: 3,
								textAlign: 'center',
								cursor: 'pointer',
								backgroundColor: COLORS.secondaryBackgroundColor,
							}}
						>
							<input {...getInputProps()} />
							{isDragActive ? (
								<Typography variant="body2">Drop the files here ...</Typography>
							) : (
								<Typography variant="body2">
									Drag & drop files here, or click to select
								</Typography>
							)}
						</Box>

						{loading && (
							<Typography variant="body2" mt={1} color="primary">
								Uploading...
							</Typography>
						)}
					</Box>
				</Modal>

				{/* More Modal */}
				<Modal open={isMoreModalOpen} onClose={handleCloseMoreModal}>
					<Box
						color={COLORS.textColor}
						sx={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							width: {
								xs: '80%', // 80% of the viewport width on small screens
								sm: '60%', // 60% on medium screens
								md: '40%', // 50% on large screens
								lg: '30%', // 30% on extra-large screens
							},
							height: {
								xs: 'auto', // Adjust height automatically for small screens
								md: 'auto', // Or set a percentage for medium/large screens
							},
							maxHeight: '70vh',
							bgcolor: COLORS.secondaryBackgroundColor,
							boxShadow: 24,
							p: {
								xs: 2, // Smaller padding on small screens
								md: 4, // Larger padding on larger screens
							},
							borderRadius: 2,
							outline: 'none',
							overflowY: 'auto',
							'&::-webkit-scrollbar': {
								width: '10px', // Width of the scrollbar
							},
							'&::-webkit-scrollbar-track': {
								backgroundColor: COLORS.backgroundColor, // Track color
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
						<Typography variant="h6" gutterBottom>
							More Selected Files: ({remaining.length})
						</Typography>
						<Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
							{remaining.map((fileData, i) => renderPreview(fileData, i + 5))}
						</Box>
					</Box>
				</Modal>
			</Box>
		);
	}
);

export default UploadFiles;
