# Watcher
Deliverables Tracker Automation

![Example of correctly installed script.](https://github.com/rafeautie/watcher/blob/master/CorrectInstallationExample.png)

## Usage

- **Time-based trigger:** If enabled, the script will run daily, sometime between **12am** and **1am.**

- **Manual trigger:** 2 options
    - **Mark all late deliverables:** will audit the entire spreadsheet. 
    - **Mark late deliverables on this sheet:** will audit the sheet that you are currently viewing.
    
> The script will skip the **Deadlines**, **Student+Apps**, and **Names + Emails** sheets.

## Installation

1. Open the spreadsheet you would like to install this script on.
1. Click **Tools** in the menu.
1. Click **Script editor** in the dropdown menu.
    > You should be brought to a new page with an empty Google script that looks like the image below. ![Example of new Google scripts project.](https://github.com/rafeautie/watcher/blob/master/GoogleScriptsNewProjectExample.png)

1. Copy the contents of [`watcher.gs`](https://github.com/rafeautie/watcher/blob/master/watcher.gs) (from this repo) into the newly created Google script.
1. **Save the file.** (CMD + S)
1. Wait a second for the **Watcher** button to appear next to the **Help** button.


## Enabling the Timer Trigger.

1. If installed correctly, you should see a new item in the toolbar at the top of your spreadsheet. (See image below)
    > ![Example of correctly installed script.](https://github.com/rafeautie/watcher/blob/master/CorrectInstallationExample.png)
1. Click **Watcher**.
1. Hover over **Time Trigger Settings** to reveal a dropdown menu.
1. Click **Enable time trigger**.

The script will audit the spread sheet daily sometime between **12am** and **1am.**\
*Google does not allow finer control of time triggers.*
