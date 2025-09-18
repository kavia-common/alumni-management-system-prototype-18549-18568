#!/bin/bash
cd /home/kavia/workspace/code-generation/alumni-management-system-prototype-18549-18568/alumni_management_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

