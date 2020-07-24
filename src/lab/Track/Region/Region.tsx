import React, { useContext, useEffect, useMemo, useState } from 'react';
import { RegionContext } from '../../../providers/RegionContext';
import { useRecoilState, useRecoilValue } from 'recoil/dist';
import { regionStore } from '../../../recoil/regionStore';
import Waveform from '../../Waveform/Waveform';
import { Paper, PaperProps, styled } from '@material-ui/core';
import { ChannelContext } from '../../../providers/ChannelContext';
import { channelStore } from '../../../recoil/channelStore';
import { arrangeWindowStore } from '../../../recoil/arrangeWindowStore';
import MoveWrapper from './MoveWrapper';
import useRegionScheduler from '../../../hooks/audio/useRegionScheduler';
import { red } from '@material-ui/core/colors';
import { projectStore } from '../../../recoil/projectStore';
import { useHotkeys } from 'react-hotkeys-hook';
import useDeleteRegion from '../../../hooks/recoil/region/useDeleteRegion';

interface BaseContainerProps {
  color: string;
  isSelected: boolean;
  translateX: number;
}

const Wrapper = styled('div')({
  width: '100%',
  height: '100%',
  position: 'relative',
})

const BaseContainer = styled(
  ({ color, isSelected, translateX, ...other }: BaseContainerProps & Omit<PaperProps, keyof BaseContainerProps>) => <Paper {...other} />,
)({
  margin: 0,
  marginTop: 1,
  height: 68,
  willChange: 'transform',
  position: 'absolute',
  transform: ({ translateX }: BaseContainerProps) => `translateX(${translateX}px)`,
  backgroundColor: ({ color }: BaseContainerProps) => color,
  border: ({ isSelected, color }: BaseContainerProps) => `2px solid ${isSelected ? 'white' : color}`,
});

function Region() {
  const [isSelected, setIsSelected] = useState(false);
  const channelId = useContext(ChannelContext);
  const id = useContext(RegionContext);
  const audioBuffer = useRecoilValue(regionStore.audioBuffer(id));
  const start = useRecoilValue(regionStore.start(id));
  const isSplinterRecording = useRecoilValue(projectStore.isRecording);
  const [isRecording, setIsRecording] = useRecoilState(regionStore.isRecording(id));
  const channelColor = useRecoilValue(channelStore.color(channelId));
  const pixelPerSecond = useRecoilValue(arrangeWindowStore.pixelPerSecond);
  const ref = useHotkeys('backspace', useDeleteRegion(id));

  useRegionScheduler();

  useEffect(() => {
    if (!isSplinterRecording) {
      setIsRecording(false);
    }
  }, [isSplinterRecording, setIsRecording]);

  const regionWidth = useMemo(() => pixelPerSecond * (audioBuffer?.duration ?? 0), [audioBuffer, pixelPerSecond]);
  const translateX = useMemo(() => pixelPerSecond * start, [pixelPerSecond, start]);

  return (
    <BaseContainer translateX={translateX} isSelected={isSelected} color={isRecording ? red['500'] : channelColor} style={{ width: regionWidth }}
                   onClick={() => setIsSelected(currVal => !currVal)} innerRef={ref} tabIndex={0}>
      <Wrapper>
        <MoveWrapper isSelected={isSelected}/>
        {audioBuffer && <Waveform audioBuffer={audioBuffer.get()} height={68} width={regionWidth - 4}/>}
      </Wrapper>
    </BaseContainer>
  );
}

export default Region;
