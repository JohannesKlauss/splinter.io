import React from 'react';
import { Box, Container, styled } from '@material-ui/core';
import { splinterTheme } from '../../../theme';
import RulerSettings from '../Ruler/Settings/RulerSettings';
import ArrangeGrid from './ArrangeGrid';
import VerticalChannelList from '../Channels/VerticalChannels/VerticalChannelList';
import TransportView from '../Transport/TransportView';
import useListenForExternalMidiIn from '../../../hooks/midi/useListenForExternalMidiIn';
import useUpdateMidiStore from '../../../hooks/midi/useUpdateMidiStore';
import { ARRANGE_GRID_CHANNEL_LIST_GAP } from '../../../const/ui';

const BaseContainer = styled(Container)(({theme}) => ({
  width: '100%',
  maxHeight: '45vh',
  padding: '5px 0',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
}));

const Flexer = styled('div')({
  display: 'flex',
  maxHeight: 350,
  overflow: 'auto',
});

const RightPane = styled(Box)(({theme}) => ({
  width: '100%',
  overflowX: 'auto',
  height: '100%',
  paddingLeft: ARRANGE_GRID_CHANNEL_LIST_GAP,
  background: theme.palette.background.default,
}));

function ArrangeWindow() {
  useListenForExternalMidiIn(useUpdateMidiStore());

  return (
    <BaseContainer maxWidth={'xl'}>
      <TransportView/>
      <RulerSettings/>
      <Flexer>
        <VerticalChannelList/>
        <RightPane>
          <ArrangeGrid/>
        </RightPane>
      </Flexer>
    </BaseContainer>
  );
}

export default React.memo(ArrangeWindow);
