import { useIsHotkeyPressed } from "react-hotkeys-hook";
import {useRecoilCallback, useRecoilValue} from "recoil";
import {regionStore} from "../../../../recoil/regionStore";
import { Header } from "@tonejs/midi";
import {pianoRollStore} from "../../../../recoil/pianoRollStore";
import {MidiNote} from "../../../../types/Midi";
import * as Tone from 'tone';
import {createNewId} from "../../../../utils/createNewId";
import {MIDI_ID_PREFIX} from "../../../../const/ids";

export default function useDrawMidiNote(note: number) {
  const isPressed = useIsHotkeyPressed();
  const focusedMidiRegionId = useRecoilValue(pianoRollStore.focusedMidiRegionId);

  return useRecoilCallback(({set, snapshot}) => (noteOnAt: Tone.TicksClass, duration: Tone.TicksClass, velocity: number) => {
    const midiNotes = snapshot.getLoadable(regionStore.midiNotes(focusedMidiRegionId)).contents as MidiNote[];

    const header = new Header();
    header.setTempo(120);

    const newNote: MidiNote = {
      id: createNewId(MIDI_ID_PREFIX),
      ticks: noteOnAt.toTicks(),
      time: noteOnAt.toSeconds(),
      velocity,
      midi: note,
      noteOffVelocity: 0,
      durationTicks: duration.toTicks(),
      duration: duration.toSeconds(),
    };

    set(regionStore.midiNotes(focusedMidiRegionId), [...midiNotes, newNote]);
  }, [isPressed, note, focusedMidiRegionId]);
}