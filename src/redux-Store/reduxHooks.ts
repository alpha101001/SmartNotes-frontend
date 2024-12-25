import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, StoreDispatch } from './index';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => StoreDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
