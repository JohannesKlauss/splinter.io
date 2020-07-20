import React, { useEffect, useRef } from 'react';
import { styled } from '@material-ui/core';
import Konva from 'konva';
import { amber, red, teal } from '@material-ui/core/colors';
import { mapDbToUiMeterVal } from '../../../utils/levelMeterMapping';
import useToneAudioNodes from '../../../hooks/tone/useToneAudioNodes';

const uniqid = require('uniqid');

const LevelMeter = styled('div')({
  width: '100%',
  height: 160,
  marginTop: 20,
  overflow: 'hidden',
  position: 'relative',
});

const METER_WIDTH = 24;

function LevelMeterVertical() {
  const containerId = useRef(uniqid('konva-container-'));
  const canvas = useRef<HTMLDivElement>(null);
  const {rmsMeter} = useToneAudioNodes();

  useEffect(() => {
    // TODO: WRITE THIS IS A CLEANER WAY, THIS IS JUST HACKED IN HERE AS A Poc.
    if (canvas.current) {
      const stage = new Konva.Stage({
        container: containerId.current,
        width: METER_WIDTH,
        height: 160,
      });

      const layer = new Konva.Layer();

      const rms = new Konva.Rect({
        x: 0,
        y: 0,
        width: METER_WIDTH,
        height: 0,
        fill: teal['A200'],
        offsetY: -100,
      });

      layer.add(rms);
      stage.add(layer);

      const anim = new Konva.Animation(() => {
        const val = rmsMeter.getValue() as number

        let rmsHeight = mapDbToUiMeterVal(rmsMeter.getValue() as number);

        if (isNaN(rmsHeight)) {
          rmsHeight = 0;
        }

        rms.height(rmsHeight);
        rms.offsetY(-160 + rmsHeight);
        rms.fill(val >= -4 ? (val >= -1 ? red['A200'] : amber['A200']) : teal['A200']);
      }, layer);

      anim.start();
    }
  }, [canvas, containerId, rmsMeter]);

  return (
    <LevelMeter id={containerId.current} ref={canvas}/>
  );
}

export default React.memo(LevelMeterVertical);
