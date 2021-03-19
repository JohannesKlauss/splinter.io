import * as Tone from 'tone';
import { ChannelMode, ChannelType } from '../../types/Channel';
import { AbstractChannel } from './AbstractChannel';
import { MASTER_CHANNEL } from '../const/ids';

export class MasterChannel extends AbstractChannel {
  protected inputNode = new Tone.Volume();
  protected outputNode = Tone.Destination;
  protected type: ChannelType = ChannelType.MASTER;

  private static instance: MasterChannel;

  private constructor(id: string) {
    super(id, ChannelMode.STEREO);

    this.updateChannelMode(ChannelMode.STEREO);
  }

  // We are omitting the solo node for the master channel, since solo activation on a different channel will mute the master channel.
  protected connectInternalNodes() {
    Tone.connectSeries(this.inputNode, this.volumeNode, this.muteNode, this.rmsNode, this.outputNode);
  }

  public static getInstance(): MasterChannel {
    if (!MasterChannel.instance) {
      MasterChannel.instance = new MasterChannel(MASTER_CHANNEL);
    }

    return MasterChannel.instance;
  }

  protected updateChannelMode(mode: ChannelMode): void {
    if (mode === ChannelMode.MONO) {
      throw new Error('Cannot change channelMode of Master Channel!');
    }

    super.updateChannelMode(mode);
  }
}