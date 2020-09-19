import React, { useCallback, useEffect } from 'react';
import { Box, BoxProps, styled } from '@material-ui/core';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  arrangeWindowStore,
} from '../../../recoil/arrangeWindowStore';
import RulerPlayhead from './RulerPlayhead';
import useSnapCtrlPixelCalc from '../../../hooks/ui/useSnapCtrlPixelCalc';
import useMovable from '../../../hooks/ui/useMovable';
import { transportStore } from '../../../recoil/transportStore';
import usePixelToSeconds from '../../../hooks/ui/usePixelToSeconds';
import { isBetween } from '../../../utils/numbers';
import useBarAtPixel from '../../../hooks/ui/transportCursor/useBarAtPixel';

interface BaseContainerProps {
  windowWidth: number;
}

const BaseContainer = styled(
  ({ windowWidth, ...other }: BaseContainerProps & Omit<BoxProps, keyof BaseContainerProps>) => <Box {...other} />,
)({
  backgroundColor: 'transparent',
  width: ({ windowWidth }: BaseContainerProps) => windowWidth,
  position: 'absolute',
  bottom: 0,
  height: 20,
  zIndex: 2,
});

function RulerTransportCursor() {
  const pixelToSeconds = usePixelToSeconds();
  const setTransportQuarters = useSetRecoilState(transportStore.currentQuarter);
  const windowWidth = useRecoilValue(arrangeWindowStore.width);
  const [playheadPosition, setPlayheadPosition] = useRecoilState(arrangeWindowStore.playheadPosition);
  const calcSnappedPos = useSnapCtrlPixelCalc();
  const zoomedQuarterPixelWidth = useRecoilValue(arrangeWindowStore.zoomedQuarterPixelWidth);
  const viewportWidth = useRecoilValue(arrangeWindowStore.viewportWidth);
  const arrangeWindowRef = useRecoilValue(arrangeWindowStore.ref);
  const snapValue = useRecoilValue(arrangeWindowStore.snapValue);
  const barAtPixel = useBarAtPixel();
  const isSnapActive = useRecoilValue(arrangeWindowStore.isSnapActive);

  const onMouseInteraction = useCallback(e => {
    const position = calcSnappedPos(e.clientX - e.target.getBoundingClientRect().left);

    if (playheadPosition !== position) {
      if (snapValue === 4 && isSnapActive) { // If snap Value is at 1 bar we have to snap to the nearest bar.
        setPlayheadPosition(((barAtPixel(position)?.quarterInProject || 0)) * zoomedQuarterPixelWidth);
        setTransportQuarters(barAtPixel(position)?.quarterInProject || position / zoomedQuarterPixelWidth);
      } else if(!isSnapActive) {
        setPlayheadPosition(position);
        setTransportQuarters(position / zoomedQuarterPixelWidth);
      }
    }
  }, [setPlayheadPosition, calcSnappedPos, pixelToSeconds, setTransportQuarters, playheadPosition, zoomedQuarterPixelWidth, barAtPixel, snapValue, isSnapActive]);

  const onMovableTrigger = useMovable(onMouseInteraction, onMouseInteraction);

  const onMouseDown = useCallback((e) => {
    onMouseInteraction(e);
    onMovableTrigger();
  }, [onMouseInteraction, onMovableTrigger]);

  useEffect(() => {
    const scrollLeft = arrangeWindowRef?.current?.scrollLeft ?? 0;

    if (!isBetween(playheadPosition, [scrollLeft, scrollLeft + viewportWidth])) {
      arrangeWindowRef?.current?.scrollTo({
        left: Math.max(0, playheadPosition - 30)
      });
    }
  }, [playheadPosition, viewportWidth, arrangeWindowRef]);

  return (
    <BaseContainer windowWidth={windowWidth} onMouseDown={onMouseDown}>
      <RulerPlayhead/>
    </BaseContainer>
  );
}

export default RulerTransportCursor;
