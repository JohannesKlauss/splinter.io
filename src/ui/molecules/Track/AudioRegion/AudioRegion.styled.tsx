import { Paper, PaperProps, styled, Theme, Typography, TypographyProps } from '@material-ui/core';
import React, { HTMLAttributes } from 'react';

interface BaseContainerProps {
  isMuted: boolean;
  isMoving: boolean;
  isSelected: boolean;
  color: string;
  left: number;
}

export const BaseContainer = styled(
  ({ isMuted, isMoving, isSelected, color, left, ...other }: BaseContainerProps & Omit<PaperProps, keyof BaseContainerProps>) =>
    <Paper {...other} />,
)({
  margin: 0,
  height: '100%',
  willChange: 'transform',
  position: 'absolute',
  opacity: ({ isMuted }: BaseContainerProps) => isMuted ? 0.5 : 1,
  transform: ({ left }: BaseContainerProps) => `translateX(${left}px)`,
  border: ({isSelected, color}: BaseContainerProps) => isSelected ? '2px solid white' : `2px solid ${color}`,
  zIndex: ({isMoving, isSelected}: BaseContainerProps) => isMoving || isSelected ? 10 : 1,
  '&:focus': {
    outline: 'none',
  },
});

interface RegionFirstLoopProps {
  width: number;
  color: string;
}

// The "first loop" is the main region. Every dragged out loop is regarded as second loop and on.
export const RegionFirstLoop = styled(
  ({ width, color, ...other }: RegionFirstLoopProps & Omit<HTMLAttributes<HTMLDivElement>, keyof RegionFirstLoopProps>) =>
    <div {...other} />,
)({
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  width: ({ width }: RegionFirstLoopProps) => width,
  backgroundColor: ({ color }: RegionFirstLoopProps) => color,
  '&:focus': {
    outline: 'none',
  },
});

interface ManipulationsProps {
  isMoving: boolean;
}

export const Manipulations = styled(
  ({ isMoving, ...other }: ManipulationsProps & Omit<HTMLAttributes<HTMLDivElement>, keyof ManipulationsProps>) =>
    <div {...other} />,
)({
  height: '50%',
  width: '100%',
  position: 'absolute',
  cursor: ({isMoving}: ManipulationsProps) => isMoving ? 'grabbing' : 'grab',
  bottom: 0,
  left: 0,
});

interface RegionNameProps {
  color: string;
}

export const RegionName = styled(
  ({ color, ...other }: RegionNameProps & Omit<TypographyProps, keyof RegionNameProps>) =>
    <Typography {...other} />,
)<Theme, RegionNameProps>(({color}) => ({
  color,
  position: 'absolute',
  top: -4,
  left: 4,
  zIndex: 1,
  cursor: 'text',
}));