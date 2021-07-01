#!/bin/bash

git clone https://github.com/ethereum-optimism/optimism.git
cd optimism/ops

make up
./scripts/wait-for-sequencer.sh
