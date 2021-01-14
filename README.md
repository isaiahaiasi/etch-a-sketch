# ETCH A SKETCH

This was honestly a lot easier than I thought, now I just need to add ***style***... Uh, and a UI.

A few quirks:
  - Currently, I'm removing the eventlistener when I don't want it. This means if you want to switch back and forth, you have to reload the page going from `recolorable` to `!recolorable`.
  - The way the darkener works at the moment, it subtracts proportionally. But something seems a little screwy, and even though the brightness seems to be reducing at an appropriate rate, when you run over a color, it immediately evens out the r g b channels to grey. Might have to rethink my math there...