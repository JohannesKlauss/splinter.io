import React, { useRef } from 'react';
import { styled, Typography } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import useIsDragOnDocument from '../../../hooks/ui/useIsDragOnDocument';
import { useRecoilState, useRecoilValue } from 'recoil';
import { arrangeWindowStore } from '../../../recoil/arrangeWindowStore';
import useScrollPosition from '../../../hooks/ui/useScrollPosition';
import useOnDropTrack from '../../../hooks/ui/arrangeGrid/useOnDropTrack';
import { projectStore } from '../../../recoil/projectStore';
import InfoAction from '../../organisms/InfoAction';

const BaseContainer = styled('div')(({ theme }) => ({
  width: 'calc(100vw - 262px)',
  height: 70,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1,
  position: 'relative',
  willChange: 'transform',
  backgroundColor: theme.palette.background.paper,
  border: `1px dashed ${theme.palette.background.paper}`,
  userSelect: 'none',
  '&:focus': {
    outline: 'none',
  },
}));

function DropTrack() {
  const onDrop = useOnDropTrack();
  const isDragOnDocument = useIsDragOnDocument();
  const ref = useRef<HTMLDivElement>(null);
  const arrangeWindowRef = useRecoilValue(arrangeWindowStore.ref);

  useScrollPosition((pos) => {
    ref.current && ref.current.style.setProperty('transform', `translateX(${pos}px)`);
  }, [ref, arrangeWindowRef], arrangeWindowRef);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const [lastAnalyzedBpmFromImport, setLastAnalyzedBpmFromImport] = useRecoilState(projectStore.lastAnalyzedBpmFromImport);

  const isInfoActionOpen = lastAnalyzedBpmFromImport !== null;

  const text = `Your imported track has a tempo of ${lastAnalyzedBpmFromImport}bpm. Would you like to update your project?`;

  return (
    <>
      <BaseContainer {...getRootProps()} data-cy={'drop-track-zone'} ref={ref}>
        <input {...getInputProps()} data-cy={'drop-track-input'}/>
        <Typography variant="overline" color={isDragOnDocument ? 'primary' : 'initial'}
                    display="block">Drop audio here to add new track</Typography>
      </BaseContainer>

      <InfoAction severity={'info'} open={isInfoActionOpen} text={text}
                  onCancel={() => setLastAnalyzedBpmFromImport(null)}
                  onConfirm={() => {
                    // TODO: THIS WILL CURRENTLY NOT WORK. WE HAVE TO ADJUST THE TEMPO MAP, BUT WE DON'T KNOW WHAT THE LOGIC SHOULD BE YET.
                    //setCurrentTempo(lastAnalyzedBpmFromImport!);
                    setLastAnalyzedBpmFromImport(null);
                  }}
      />
    </>
  );
}

DropTrack.whyDidYouRender = false;

export default React.memo(DropTrack);
