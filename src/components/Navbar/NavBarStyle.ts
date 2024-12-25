import styled from 'styled-components';
import { Box } from '@mui/material';
import COLORS from '../../utils/Theme/colors';
import { BoxProps } from '@mui/system';
import { Link as LinkR } from 'react-router-dom';

export const Nav: React.ComponentType<BoxProps> = styled(Box)`
	background-color: ${COLORS.backgroundColor};
	height: 70px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 2rem;
	position: sticky;

	top: 0;
	z-index: 1000;
	color: yellow;
	&::after {
		content: '';
		display: block;
		width: 100%;
		height: 1px; /* Adjust the thickness of the bottom line */
		background-color: #02faf2; /* Set the bottom line color */
		position: absolute;
		bottom: 0;
		left: 0;
	}
`;
export const NavbarContainer = styled.div`
	width: 100%;
	max-width: 1200px;
	padding: 0 24px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 1.1rem;
`;
export const NavLogo = styled(LinkR)`
	width: 80%;
	padding: 0 6px;
	font-weight: 500;
	font-size: 32px;
	text-decoration: none;
	color: ${COLORS.textColor};
`;
export const NavItems = styled.ul`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 32px;
	padding: 0 6px;
	list-style: none;
	@media screen and (max-width: 768px) {
		display: none;
	}
`;
export const NavLink = styled.a<{ isOpen?: boolean }>`
	color: ${({ isOpen }) => (isOpen ? '#02faf2' : '#f5f7f7')};
	font-weight: 500;
	font-size: 18px;
	cursor: pointer;
	transition: all 0.2s ease-in-out;
	text-decoration: none;
	&:hover {
		color: ${({ isOpen }) => (isOpen ? '#f8fc05' : '#d705fc')};
		scale: 1.2;
	}
`;
export const ButtonContainer: React.ComponentType<BoxProps> = styled(Box)`
	width: 80%;
	height: 100%;
	display: flex;
	justify-content: end;
	align-items: center;
	padding: 0 6px;
	@media screen and (max-width: 768px) {
		display: none;
	}
`;
export const LogInButton = styled.a`
	border: 1px solid ${COLORS.textColor};
	color: ${COLORS.textColor};
	justify-content: center;
	display: flex;
	align-items: center;
	border-radius: 20px;
	cursor: pointer;
	padding: 10px 20px;
	font-size: 16px;
	font-weight: 500;
	transition: all 0.3s ease-in-out;
	text-decoration: none;
	&:hover {
		background: ${COLORS.buttonColorHover};
		color: ${COLORS.textHoverColor};
		scale: 1.1;
	}
`;
export const MobileIcon = styled.div`
	height: 100%;
	display: flex;
	align-items: center;
	color: ${({ theme }) => theme.text_primary};
	display: none;
	@media screen and (max-width: 768px) {
		display: block;
	}
`;
export const MobileMenu = styled.ul<{ isOpen: boolean }>`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 16px;
	padding: 12px 40px 24px 40px;
	list-style: none;
	background: ${COLORS.secondaryBackgroundColor};
	position: absolute;
	top: 50px; /* Positioned just below the red line */
	right: 0;
	transition: transform 2s cubic-bezier(0.68, -0.55, 0.27, 1.55), opacity 2s ease-in-out; /* Slower transition effect */
	transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-100%)')}; /* Slide down */
	border-radius: 0 0 20px 20px;
	box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
	opacity: ${({ isOpen }) => (isOpen ? '1' : '0')}; /* Fade in */
	z-index: ${({ isOpen }) => (isOpen ? '1000' : '-1')}; /* Hide when closed */
`;
