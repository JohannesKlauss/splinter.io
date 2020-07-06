import { useRecoilValue } from 'recoil/dist';
import { channelState } from '../../recoil/selectors/channel';
import useSoulInstrument from '../soul/useSoulInstrument';
import useSoulPatch from '../soul/useSoulPatch';
import useTonePatcher from '../tone/useTonePatcher';

export default function useChannelPatcher(id: string) {
  const {instrument, plugins} = useRecoilValue(channelState(id));

  const [soulInstrumentNode, soulInstrument, onNote] = useSoulInstrument(instrument);
  const [soulPluginNode, soulPlugin] = useSoulPatch(plugins[0]);

  useTonePatcher([soulPluginNode], soulInstrumentNode);

  return {
    soulInstrument,
    instrumentPort: soulInstrumentNode?.port,
    onNote,
    soulPlugin,
    pluginPort: soulPluginNode?.port,
  }
}