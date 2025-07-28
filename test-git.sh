#!/bin/bash
# Test script to bypass shell initialization issues

echo "Testing git commands..."
echo "Current directory:"
/bin/pwd

echo -e "\nGit status:"
/usr/bin/git status

echo -e "\nGit log (last 10 commits):"
/usr/bin/git log --oneline -10

echo -e "\nGit diff stat:"
/usr/bin/git diff --stat