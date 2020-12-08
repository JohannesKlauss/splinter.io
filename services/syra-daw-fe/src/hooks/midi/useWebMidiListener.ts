import { useSetRecoilState } from "recoil";
import { keyboardMidiStore } from "../../recoil/keyboardMidiStore";
import { useEffect } from "react";
import WebMidi from "webmidi";
import useSelectLastMidiDevice from "./useSelectLastMidiDevice";

export default function useWebMidiListener() {
  const setMidiDevice = useSetRecoilState(keyboardMidiStore.selectedMidiDevice);
  const setIsMidiEnabled = useSetRecoilState(keyboardMidiStore.isMidiEnabled);
  const selectLastMidiDevice = useSelectLastMidiDevice();

  /*const showToast = useCallback((description: string) => {
    toast({
      title: "Updated MIDI I/O.",
      description,
      status: "info",
      duration: 9000,
      isClosable: true,
    });
  }, [toast]) ;*/

  useEffect(() => {
    WebMidi.enable(function(error) {
      if (error === undefined) {
        setIsMidiEnabled(true);
        selectLastMidiDevice();

        console.log(`Detected ${WebMidi.inputs.length} MIDI inputs and ${WebMidi.outputs.length} outputs.`);
        //showToast(`Detected ${WebMidi.inputs.length} MIDI inputs and ${WebMidi.outputs.length} outputs.`);

        WebMidi.addListener("connected", function(e) {
          console.log(`Detected ${WebMidi.inputs.length} MIDI inputs and ${WebMidi.outputs.length} outputs.`);
          //showToast(`Detected ${WebMidi.inputs.length} MIDI inputs and ${WebMidi.outputs.length} outputs.`);
        });

        WebMidi.addListener("disconnected", function(e) {
          console.log(`Detected ${WebMidi.inputs.length} MIDI inputs and ${WebMidi.outputs.length} outputs.`);
          //showToast(`Detected ${WebMidi.inputs.length} MIDI inputs and ${WebMidi.outputs.length} outputs.`);
        });
      } else {
        setIsMidiEnabled(false);

        console.log(`Could not enable Web MIDI.`);
        //showToast(`Could not enable Web MIDI.`);
      }
    });
  }, [setIsMidiEnabled, setMidiDevice]);
}