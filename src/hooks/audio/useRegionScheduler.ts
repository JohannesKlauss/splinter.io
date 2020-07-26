import { useContext, useEffect } from 'react';
import { RegionContext } from '../../providers/RegionContext';
import useToneAudioNodes from '../tone/useToneAudioNodes';
import { useRecoilValue } from 'recoil/dist';
import { regionStore } from '../../recoil/regionStore';

export default function useRegionScheduler() {
  const { players } = useToneAudioNodes();
  const regionId = useContext(RegionContext);
  const { start, audioBuffer, isRecording, isMuted, trimEnd, trimStart } = useRecoilValue(regionStore.regionState(regionId));

  useEffect(() => {
    // When the region is being recorded or has an empty audio buffer we do not schedule anything.
    if (isRecording || audioBuffer === null) {
      return;
    }

    if (audioBuffer && !players.has(regionId)) {
      players.add(regionId, audioBuffer);
    }

    const player = players.player(regionId);
    const duration = player.buffer.duration ?? 0;

    players.player(regionId).set({mute: isMuted}).unsync().sync().start(start + trimStart + 0.001, trimStart, duration - trimEnd - trimStart);
  }, [start, audioBuffer, players, isRecording, isMuted, regionId, trimEnd, trimStart]);
}