import os
import os.path
from os import path
from shutil import copyfile

filenames_patch = [ # Add path to plugins_patch.txt, file must be in unicode (UTF-16LE)
    'Separator/plugins_patch.txt',
    'Auto Save/plugins_patch.txt',
    'Auto Battle/plugins_patch.txt',
    'Fade Out Fade In Speed/plugins_patch.txt',
    'Faster walking speed/plugins_patch.txt',
    'Hide Message Window Z/plugins_patch.txt',
    'Message Backlog/YEP/plugins_patch.txt',
    'Message Speed\TextSpeed (ZERO)/plugins_patch.txt',
    'Save Menu on button press/plugins_patch.txt',
    'SpeedUp/plugins_patch.txt',
    'StartUpFullScreen/plugins_patch.txt',
    'Stop Timer on Menu/plugins_patch.txt',
    'Hide Mouse Idle/plugins_patch.txt',
    'Enable Debug Switches Menu/plugins_patch.txt',
    'Pause/plugins_patch.txt',
    'Core Render Fix/plugins_patch.txt',
]

filenames = { # Add path to plugin file. Key: path, Value: filename
    'Separator': '--------------------.js',
    'Auto Save': 'FELSKI_AUTOSAVE.js',
    'Auto Battle': 'AutoBattle.js',
    'Fade Out Fade In Speed': 'ZERO_FadeOutFadeInSpeed.js',
    'Faster walking speed': 'ZERO_WalkingDashSpeedPlus.js',
    'Hide Message Window Z': 'ZERO_HideMessageWindowZ.js',
    'Message Backlog/YEP': 'YEP_X_MessageBacklog.js',
    'Message Speed\TextSpeed (ZERO)': 'ZERO_TextSpeed.js',
    'Save Menu on button press': 'ZERO_SaveMenuOnButtonPress.js',
    'SpeedUp': 'ZERO_Speedup.js',
    'StartUpFullScreen': 'StartUpFullScreen.js',
    'Stop Timer on Menu': 'ZERO_StopTimerOnMenu.js',
    'Hide Mouse Idle': 'N_HideIdleMouse.js',
    'Enable Debug Switches Menu': 'ZERO_enable_debug_menu.js',
    'Pause': 'Luna_GamePauseMV.js',
    'Core Render Fix': 'GraphicsRenderFix.js',
}

# Check if output folder exists, create it otherwise

if not os.path.exists('zOutput'):
    os.makedirs('zOutput')

# Copy plugin files
for fpath, fname in filenames.items():
    try:
        copyfile(fpath+'/'+fname, 'zOutput/'+fname)
        print('Copied file: ' + fname)
    except:
        print('Error copying file: ' + fpath + '/' + fname)

# Create ouput file will all plugin parameters

if path.exists('zOutput/zoutput.txt'): # Check if file exists, if exits erase it
    print('Erasing zoutput.txt file')
    output = open('zOutput/zoutput.txt', 'r+', encoding='utf-16-le')
    output.truncate(0)
else:
    print('Creating output.txt file')
    output = open("zOutput/zoutput.txt", "a", encoding='utf-16-le')

data = ""
    
for fname in filenames_patch:
    try:
        f = open(fname,'r', encoding='utf-16-le')
        data += f.read() + '\n'
        print('Writing data for: ' + fname)
    except: 
        print('Error with file: ' + fname)

data = data.replace("﻿", "") # Remove garbage
data = data[0:-2] # Remove last line break and ,

output.write(data)
output.close()
input("Press Enter to continue...")