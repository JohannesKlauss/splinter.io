import React, { useCallback } from 'react';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import { Box, IconButton, styled } from '@material-ui/core';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil/dist';
import { arrangeWindowStore } from '../../../recoil/arrangeWindowStore';
import useToneJsTransport from '../../../hooks/tone/useToneJsTransport';
import { transportStore } from '../../../recoil/transportStore';
import { useHotkeys } from 'react-hotkeys-hook';

const BaseContainer = styled(Box)({
  marginLeft: 20,
  marginRight: 20,
});

function PlayRecord() {
  const setPlayheadPosition = useSetRecoilState(arrangeWindowStore.playheadPosition);
  const [isRecording, setIsRecording] = useRecoilState(transportStore.isRecording);
  const [isPlaying, setIsPlaying] = useRecoilState(transportStore.isPlaying);
  const setTransportSeconds = useSetRecoilState(transportStore.seconds);
  const isCycleActive = useRecoilValue(transportStore.isCycleActive);
  const cycleStart = useRecoilValue(transportStore.cycleStart);
  const transport = useToneJsTransport();

  const onClickPlayPause = useCallback(() => {
    if (isRecording) {
      return;
    }

    if (isPlaying) {
      const pos = transport.seconds;
      transport.stop();

      setTransportSeconds(pos);
    } else {
      if (isCycleActive) {
        setTransportSeconds(cycleStart);
      }

      transport.start('+0.05');
    }

    setIsPlaying(currVal => !currVal);
  }, [setIsPlaying, transport, isPlaying, isRecording, setTransportSeconds, cycleStart, isCycleActive]);

  const onClickReset = useCallback(() => {
    setPlayheadPosition(1);
    setTransportSeconds(0);
  }, [setPlayheadPosition, setTransportSeconds]);

  const onClickRecord = useCallback(() => {
    if (isRecording) {
      setIsRecording(false);
      transport.stop();
    }
    else {
      setIsRecording(true);
      transport.start('+0.05');
    }
  }, [setIsRecording, isRecording, transport]);

  useHotkeys('space', () => onClickPlayPause(), [onClickPlayPause]);
  useHotkeys('r', onClickRecord, [onClickRecord]);
  useHotkeys('return', onClickReset, [onClickReset]);

  return (
    <BaseContainer>
      <IconButton color={'default'} component="span" onClick={onClickReset}>
        <SkipPreviousIcon/>
      </IconButton>
      <IconButton color={'primary'} component="span" onClick={onClickPlayPause}>
        {isPlaying ? <PauseIcon/> : <PlayArrowIcon/>}
      </IconButton>
      <IconButton color={'secondary'} component="span" onClick={onClickRecord}>
        {isRecording ? <StopIcon/> : <FiberManualRecordIcon/>}
      </IconButton>
    </BaseContainer>
  );
}

export default PlayRecord;
