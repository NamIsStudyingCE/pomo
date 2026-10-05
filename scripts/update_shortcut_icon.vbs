Set w = CreateObject("WScript.Shell")
p = w.SpecialFolders("Desktop") & "\Pomo.lnk"
If CreateObject("Scripting.FileSystemObject").FileExists(p) Then
    Set s = w.CreateShortcut(p)
    s.IconLocation = "D:\pomo\public\pomo.ico,0"
    s.Save
    WScript.Echo "Shortcut updated!"
Else
    WScript.Echo "Shortcut not found on Desktop"
End If
