import React from 'react';
import { GridList, styled } from '@material-ui/core';
import { useRecoilValue } from 'recoil/dist';
import { channelIds } from '../recoil/selectors/channel';
import UI_BASE_CHANNEL_EXPERIMENTAL from './UI_BASE_CHANNEL_EXPERIMENTAL';
import NewChannelFab from '../ui/molecules/Fabs/NewChannelFab';

const Container = styled(GridList)({
  flexWrap: 'nowrap',
  // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
  transform: 'translateZ(0)',
  overflowX: 'scroll',
});

const Flexer = styled('div')({
  display: 'flex',
  alignItems: 'flex-end',
});

function UI_CHANNEL_LIST_EXPERIMENTAL() {
  const channels = useRecoilValue(channelIds);

  return (
    <Flexer>
      <Container>
        {channels.map(id => <UI_BASE_CHANNEL_EXPERIMENTAL key={id} channelId={id}/>)}
      </Container>
      <NewChannelFab/>
    </Flexer>
  );
}

export default UI_CHANNEL_LIST_EXPERIMENTAL;
