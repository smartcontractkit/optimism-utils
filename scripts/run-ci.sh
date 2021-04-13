#!/bin/bash

# build in 2 steps
function build_images() {
  docker-compose build --parallel -- builder l2geth l1_chain
  docker-compose build --parallel -- deployer dtl batch_submitter relayer
}

current_dir=$(dirname "$0")

git clone https://github.com/ethereum-optimism/optimism.git
cd optimism/ops
build_images
docker-compose up -d
../../${current_dir}/wait-for-sequencer.sh
