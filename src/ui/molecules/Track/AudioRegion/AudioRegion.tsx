import React, { useCallback, useContext, useState } from 'react';
import { BaseContainer, RegionFirstLoop } from './AudioRegion.styled';
import { RegionContext } from '../../../../providers/RegionContext';
import { regionStore } from '../../../../recoil/regionStore';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil/dist';
import useRegionColor from '../../../../hooks/ui/region/useRegionColor';
import TrimStartHandle from './Manipulations/TrimStartHandle';
import useAudioRegionManipulation from '../../../../hooks/ui/region/useAudioRegionManipulation';
import TrimEndHandle from './Manipulations/TrimEndHandle';
import useDeltaXTracker from '../../../../hooks/ui/region/useDeltaXTracker';
import usePixelToSeconds from '../../../../hooks/ui/usePixelToSeconds';
import WindowedWaveform from '../../Waveform/WindowedWaveform';
import { determineTextColor } from '../../../../utils/color';
import useRegionWidth from '../../../../hooks/ui/region/useRegionWidth';
import { arrangeWindowStore } from '../../../../recoil/arrangeWindowStore';
import { useHotkeys, useIsHotkeyPressed } from 'react-hotkeys-hook';
import useRegionSplinterRecordingSync from '../../../../hooks/ui/region/useRegionSplinterRecordingSync';
import useRegionScheduler from '../../../../hooks/audio/useRegionScheduler';
import ClonedAudioRegion from './ClonedAudioRegion';
import useDuplicateRegion from '../../../../hooks/recoil/region/useDuplicateRegion';

/**
 * The AudioRegion is built a bit complicated and unintuitive.
 *
 * The region is shown as a container with the channel color as background.
 * But the waveform is actually a canvas that scrolls with the arrange grid viewport and only shows that visible part
 * of the waveform to reduce the number of calculations and draw calls. So each region basically has a waveform
 * canvas that scrolls over the region like a magnifying glass and shows that respective part of that waveform.
 */
function AudioRegion() {
  const pixelToSeconds = usePixelToSeconds();
  const regionId = useContext(RegionContext);
  const [isMuted, setIsMuted] = useRecoilState(regionStore.isMuted(regionId));
  const buffer = useRecoilValue(regionStore.audioBuffer(regionId));
  const bufferId = useRecoilValue(regionStore.audioBufferPointer(regionId));
  const trimStart = useRecoilValue(regionStore.trimStart(regionId));
  const setStart = useSetRecoilState(regionStore.start(regionId));
  const color = useRegionColor(false);
  const completeWidth = useRegionWidth();
  const trackHeight = useRecoilValue(arrangeWindowStore.trackHeight);
  const isPressed = useIsHotkeyPressed();
  const [isMoving, setIsMoving] = useState(false);
  const duplicateRegion = useDuplicateRegion(regionId);

  const { left, width, paddingLeft, onChangeTrimStart, onChangeTrimEnd, onChangeMove, onMouseUp } = useAudioRegionManipulation();

  const onMoveEnd = useCallback((deltaX: number) => {
    setIsMoving(false);

    if (isPressed('alt')) {
      duplicateRegion();
    }

    onMouseUp();
    setStart(currVal => {
      let newVal = currVal + pixelToSeconds(deltaX);

      if (newVal + trimStart < 0) {
        newVal = -trimStart;
      }

      return newVal;
    });
  }, [setStart, onMouseUp, pixelToSeconds, trimStart, setIsMoving, duplicateRegion]);

  const deltaXTracker = useDeltaXTracker(onChangeMove, onMoveEnd);

  const onMoveStart = useCallback((e) => {
    deltaXTracker(e);
    setIsMoving(true);
  }, [deltaXTracker, setIsMoving]);

  const ref = useHotkeys('ctrl+m', () => setIsMuted(currVal => !currVal));

  useRegionSplinterRecordingSync();
  useRegionScheduler();

  const isDuplicating = isPressed('alt') && isMoving;

  return (
    <>
      {isDuplicating && <ClonedAudioRegion/>}
      <BaseContainer isMuted={isMuted} left={left} onMouseDown={onMoveStart} innerRef={ref}>
        <RegionFirstLoop width={width} color={color}>
          <WindowedWaveform paddingLeft={paddingLeft} completeWidth={completeWidth - 4} color={determineTextColor(color)}
                            smoothing={3} buffer={buffer} height={trackHeight} offset={left} bufferId={bufferId}/>
          <TrimStartHandle onChange={onChangeTrimStart} onMouseUp={onMouseUp}/>
          <TrimEndHandle onChange={onChangeTrimEnd} onMouseUp={onMouseUp}/>
        </RegionFirstLoop>
      </BaseContainer>
    </>
  );
}

AudioRegion.whyDidYouRender = true;

export default React.memo(AudioRegion);
