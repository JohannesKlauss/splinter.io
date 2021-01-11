import React from 'react';
import MidiNote from "./MidiNote";
import {useRecoilValue} from "recoil";
import {pianoRollStore} from "../../../recoil/pianoRollStore";

interface Props {
  note: number;
}

const MidiNoteList: React.FC<Props> = ({note}) => {
  const midiNotesAtTrack = useRecoilValue(pianoRollStore.midiNotesAtTrack(note));

  return (
    <>
      {midiNotesAtTrack.map((note, i) => <MidiNote note={note} key={i}/>)}
    </>
  );
};

export default MidiNoteList;
