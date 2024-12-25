import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { MenuRounded } from '@mui/icons-material';
import {
	ButtonContainer,
	LogInButton,
	MobileIcon,
	MobileMenu,
	Nav,
	NavbarContainer,
	NavLogo,
} from './NavBarStyle';
import { Typography } from '@mui/material';
import COLORS from '../../utils/Theme/colors';
import { useAppDispatch, useAppSelector } from '../../redux-Store/reduxHooks';
import { clearAuth } from '../../redux-Store/componentSlices/authSlice';

const NavBar: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const handleLogInOut = () => {
		dispatch(clearAuth());
		navigate('/login');
	};
	const { currentUserName } = useAppSelector((state) => state.auth);
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth > 768) {
				setIsOpen(false);
			} else {
				setIsOpen(true);
			}
		};

		window.addEventListener('resize', handleResize);

		// Ensure the menu is closed initially on larger screens
		handleResize();

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);
	return (
		<>
			{currentUserName && (
				<Nav>
					<NavbarContainer>
						<NavLogo to="/">
							<b>Smart Notes</b>
						</NavLogo>
						<MobileIcon onClick={() => setIsOpen(!isOpen)}>
							<MenuRounded style={{ color: 'yellow' }} />
						</MobileIcon>
						{window.innerWidth > 768 && (
							<ButtonContainer sx={{ display: 'flex', gap: 2 }}>
								{currentUserName ? (
									<Typography color={COLORS.textColor}>
										{'User Name : ' + currentUserName}
									</Typography>
								) : (
									<LogInButton
										onClick={!currentUserName ? handleLogInOut : undefined}
									>
										{'Log In'}
									</LogInButton>
								)}
								{currentUserName && (
									<LogInButton onClick={handleLogInOut}>Log Out</LogInButton>
								)}
							</ButtonContainer>
						)}
						{isOpen && (
							<MobileMenu isOpen={isOpen}>
								<ButtonContainer
									sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}
								>
									<LogInButton
										onClick={!currentUserName ? handleLogInOut : undefined}
									>
										{currentUserName
											? 'User Name : ' + currentUserName
											: 'Log In'}
									</LogInButton>
									{currentUserName && (
										<LogInButton onClick={handleLogInOut}>Log Out</LogInButton>
									)}
								</ButtonContainer>
							</MobileMenu>
						)}
					</NavbarContainer>
				</Nav>
			)}
		</>
	);
};

export default NavBar;
