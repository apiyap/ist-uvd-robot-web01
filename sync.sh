#!/bin/bash
set -e
rsync -azP build istuvcrobot@192.168.10.228:~/public_web/ist-uvd-robot
rsync -azP app istuvcrobot@192.168.10.228:~/public_web/ist-uvd-robot