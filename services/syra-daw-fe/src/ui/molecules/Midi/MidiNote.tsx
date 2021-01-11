import {Note} from '@tonejs/midi/dist/Note';
import React, {useContext} from "react";
import useVelocityColors from "../../../hooks/midi/useVelocityColors";
import {useRecoilValue, useRecoilCallback} from "recoil";
import {gridStore} from "../../../recoil/gridStore";
import {ViewContext} from "../../../providers/ViewContext";
import ResizableBox from "../../atoms/ResizableBox";

interface Props {
  note: Note;
}

const MidiNote: React.FC<Props> = ({note}) => {
  const {view} = useContext(ViewContext);
  const velocityColor = useVelocityColors();
  const pixelPerSecond = useRecoilValue(gridStore.pixelPerSecond(view));

  const onPositionChanged = useRecoilCallback(({set, snapshot}) => (offset: number, width: number) => {
  }, []);

  return (
    <ResizableBox cursor={'default'} bg={velocityColor(note.velocity)} baseX={note.time * pixelPerSecond}
                  baseWidth={note.duration * pixelPerSecond} h={'14px'} border={'1px solid black'} onPositionChanged={onPositionChanged}>

    </ResizableBox>
  );
};

// @ts-ignore
MidiNote.whyDidYouRender = true;

export default MidiNote;
