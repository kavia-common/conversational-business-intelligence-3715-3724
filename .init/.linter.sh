#!/bin/bash
cd /home/kavia/workspace/code-generation/conversational-business-intelligence-3715-3724/conversational_bi_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

