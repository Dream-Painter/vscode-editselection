# Edit your selections
Select multiple things, run these commands via the Command Pallette and choose which selections to keep according to some pattern.

These commands allow you to select your multiple selections.

## Periodic pattern
This selection method allows you to choose which selections to keep in a periodic manner.

The command can be selected from the Command Pallette: `Periodic pattern select`. This command is only visible if the user has multiple selections. (which only works in a tab with a text editor)

The input asks for 1 or more numbers. The first number will be the period.

If only one number is given, the pattern will select the first of every 'period' selections.

If multiple numbers are given, like '6:1 2 4 ...', the pattern will select the 1st, 2nd and 4th from every 6 selections

\<gif>

## Direct pattern
This selection method allows you to choose which selections to keep directly.

The command can be selected from the Command Pallette: `Direct pattern select`. This command is only visible if the user has multiple selections. (which only works in a tab with a text editor)

The input asks for 1 or more numbers. 

Having input '2' will select the first selection, and then every 2nd.

Having input '1 2' will select the fist select, then the one after that, then the 2nd after that, then the one after that, then the 2nd after that, etc. 
(Basically select 2, skip 1, select 2, skip 1, etc.)

\<gif>
