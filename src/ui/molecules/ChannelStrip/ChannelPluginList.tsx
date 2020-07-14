import React, { useCallback, useContext } from 'react';
import { Button, List, ListItem } from '@material-ui/core';
import { ChannelContext } from '../../../providers/ChannelContext';
import { useRecoilState } from 'recoil/dist';
import ChannelPlugin from './ChannelPlugin';
import { channelStore } from '../../../recoil/channelStore';
const uniqid = require('uniqid');

function ChannelPluginList() {
  const channelId = useContext(ChannelContext);
  const [soulPluginIds, setSoulPluginIds] = useRecoilState(channelStore.pluginIds(channelId));

  const onClick = useCallback(() => {
    setSoulPluginIds(currVal => [...currVal, uniqid(`${channelId}-plugin-`)]);
  }, [setSoulPluginIds, channelId]);

  return (
    <List>
      {soulPluginIds.map((id) => (
        <ChannelPlugin key={id} id={id}/>
      ))}
      <ListItem>
        <Button onClick={onClick}>Add Plugin</Button>
      </ListItem>
    </List>
  );
}

export default ChannelPluginList;
