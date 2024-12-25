import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link, useNavigate } from 'react-router-dom';
import { FormEvent, useState } from 'react';

// import { Auth } from 'aws-amplify';
import { LoadingButton } from '@mui/lab';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
	CircularProgress,
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
} from '@mui/material';

import COLORS from '../../utils/Theme/colors';
import { textFieldStyles } from '../../utils/Helper/textFieldStyles';
import { useRegisterUserMutation } from '../../redux-Store/apiSlices/api';

import { setCurrentUserEmail } from '../../redux-Store/componentSlices/authSlice';
import { useAppDispatch, useAppSelector } from '../../redux-Store/reduxHooks';
import useNotify from '../../utils/Helper/notify';
import { AnyObject } from 'yup/lib/types';

const SignUp: React.FC = () => {
	const [name, setName] = useState('');
	const [password, setPassword] = useState({
		value: '',
		show: false,
	});
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { successNotify, errorNotify } = useNotify();
	const [registerUser, { data: registerData, isLoading: isRegisterloading }] =
		useRegisterUserMutation();
	const { currentUserEmail } = useAppSelector((state) => state.auth);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			// Await the result of the API call
			await registerUser({
				name,
				email: currentUserEmail,
				password: password.value,
			}).unwrap(); // Use unwrap() to access the resolved data or throw an error if rejected

			// Notify success and navigate
			successNotify('Please check your email for a verification code');
		} catch (error) {
			// Handle the rejection
			if ((error as AnyObject).data?.message) {
				// Notify with the error message from the API response
				errorNotify((error as AnyObject).data.message);
				return;
			} else {
				errorNotify('Something went wrong');
				return;
			}
		}
		navigate('/verification');
	};
	return (
		<Box sx={{ backgroundColor: COLORS.backgroundColor, width: '100%', height: '100%' }}>
			<Container
				component="main"
				// maxWidth="xs"
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					position: 'absolute',
					top: '50%',
					transform: 'translate(-50%,-50%)',
					left: '50%',
				}}
			>
				<Box
					sx={{
						// marginTop: 15,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						backgroundColor: COLORS.secondaryBackgroundColor,
						borderRadius: '40px',

						boxShadow: `8px 8px 0px 2px ${COLORS.boxShadowColor}`,
					}}
					px={3}
					py={4}
				>
					<Box textAlign="center">
						{/* <PhantomLogo /> */}
						{/* <img src={logoIcon} alt="apiTestSuite" /> */}
						<Typography component="h2" variant="h5" mt={2} color={COLORS.textColor}>
							Welcome to Smart Notes
						</Typography>
					</Box>

					<Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									autoComplete="given-name"
									name="name"
									required
									fullWidth
									id="name"
									label="Name"
									autoFocus
									value={name}
									onChange={(e) => {
										setName(e.target.value);
									}}
									InputLabelProps={{ style: { color: COLORS.textColor } }}
									sx={textFieldStyles()}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
									type={'email'}
									// value={email}
									onChange={(e) => {
										dispatch(setCurrentUserEmail(e.target.value));
									}}
									InputLabelProps={{ style: { color: COLORS.textColor } }}
									sx={textFieldStyles()}
								/>
							</Grid>
							<Grid item xs={12}>
								<FormControl fullWidth>
									<InputLabel
										htmlFor="password"
										sx={{
											color: COLORS.textColor,
											'&.Mui-focused': {
												color: COLORS.textColor,
											},
										}}
									>
										Password
									</InputLabel>
									<OutlinedInput
										required
										fullWidth
										name="password"
										label="Password"
										type={password.show ? 'text' : 'password'}
										id="password"
										autoComplete="password"
										value={password.value}
										onChange={(e) => {
											setPassword({
												...password,
												value: e.target.value,
											});
										}}
										sx={textFieldStyles()}
										endAdornment={
											<InputAdornment position="end">
												<IconButton
													onClick={() =>
														setPassword({
															...password,
															show: !password.show,
														})
													}
													aria-label="toggle password visibility"
												>
													{password.show ? (
														<VisibilityOff
															sx={{ color: COLORS.buttonColor }}
														/>
													) : (
														<Visibility
															sx={{ color: COLORS.buttonColor }}
														/>
													)}
												</IconButton>
											</InputAdornment>
										}
									/>
								</FormControl>
							</Grid>
						</Grid>
						<LoadingButton
							type="submit"
							fullWidth
							loading={isRegisterloading}
							variant="contained"
							sx={{
								py: 1,
								mt: 2,
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
							Sign Up
						</LoadingButton>

						<Box textAlign="center">
							<Link
								to={'/login'}
								style={{ color: COLORS.textColor, textDecoration: 'none' }}
							>
								Already have an account?
							</Link>
						</Box>
					</Box>
				</Box>
			</Container>
		</Box>
	);
};

export default SignUp;
