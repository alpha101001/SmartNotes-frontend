import { Box, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import React from 'react';
import COLORS from '../../utils/Theme/colors';
import { useNavigate } from 'react-router-dom';

// import { Container } from './styles';

const CreateNote: React.FC = () => {
	const navigate = useNavigate();
	const handleCreateNote = () => {
		navigate('/create-note');
	};
	return (
		<>
			<Box
				display="flex"
				alignItems="center"
				flexDirection="column"
				justifyContent="center"
				height="100%"
				width="100%"
				sx={{
					// top: '50%',
					transform: 'translate(0%,90%)',
					// left: '50%',
				}}
			>
				<Typography
					variant="h4"
					gutterBottom
					color={COLORS.textColor}
					fontWeight={500}
					mb={5}
					sx={{
						textTransform: 'capitalize',
					}}
				>
					No Previous Note Found
				</Typography>
				<Box
					display="flex"
					flexDirection="column"
					border={`1px solid ${COLORS.textColor}`}
					borderRadius="8px"
					padding="30px"
					sx={{
						'&:hover': {
							backgroundColor: '',
							cursor: 'pointer',
						},
					}}
					onClick={handleCreateNote}
					// onClick={() => navigate(`${}`)}
				>
					<Box
						display="flex"
						flexDirection="column"
						alignItems="center"
						justifyContent="center"
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
							width="160px"
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
				</Box>
			</Box>

			{/* <Box>
				<Box className="add-scrollclass" pb={3}>
					<Box height={'80px'} sx={{ borderBottom: 1, borderColor: 'divider' }}>
						<Box>
							<Box>

							</Box>
						</Box>
					</Box>
				</Box>
			</Box> */}
		</>
	);
};

export default CreateNote;
