# SKETCH-A-SKETCH
My take on the "Etch-A-Sketch" project from [The Odin Project](https://www.theodinproject.com/courses/foundations/lessons/etch-a-sketch-project).

I wanted to expand this project a little beyond the original scope by letting the user select their prefered opacity, and have the pixels blend as expected between their selected color and the color that the pixel already had. In order to do this, I separated my concerns into two sets of functions (maintained by two callbacks):
- **Draw Mode Functions**: These generate a new color, based partially or entirely on the custom color selector sliders.
- **Blend Mode Functions**: Which take as arguments the pixel's old color and the new color, and use those to determine what the final color should be.
## Draw Modes
### <u>Custom</u>
Use the color from the custom color picker at the bottom.
### <u>Random</u>
Generate a completely random color per-pixel, while respecting the alpha of custom color.
```
For each color channel [r, g, b]:
  choose a random number between 0 and 255.
```
### <u>Shades</u>
Generate a random shade of the custom color, trying to adhere as close as possible to the hue of the custom color.
```
for each color channel [r, g, b]:
  new ch = old ch * capped random / old color sum
```
"Old color sum" is the sum of [r, g, b]. This is used to preserve the channel's ratio to the overall color.
The random number is capped to prevent channels from peaking (going over 255), which is necessary to keep the distribution of random colors within the valid colorspace. Basically, find the highest number "random" can be, that won't push ch in the above formula above 255. It is found by:
```
cap = 255 * old color sum / highest channel value
```
This was actually one of the first draw modes I added, but the original implementation used HSL rather than RGB, and after doing a little research I decided it would be better to implement a version in RGB space rather than figure out how to fully convert back and forth.
## Blend Modes
### <u>Replace</u>
Ignores the old color and just return the new color, even if the new color has an alpha <1.
### <u>Mix</u>
This was my naive take on an alpha-blending algorithm.
```
for each color channel [r, g, b]:
  final channel = interpolate between old ch and new ch, by new col's alpha.
```
To interpolate, I used a very basic lerp (linear interpolation) function:
```javascript
function lerp(a, b, t) { return a + (b - a) * t; }
```
And to get the alpha, I just added old alpha and new alpha.
### <u>Alpha Blend</u>
The "Mix" option on the live page is not actually the above mix function, but this Alpha Blend function. My naive version worked, but the result wasn't quite what a user would expect if they were drawing in a modern image editor. To try to improve my approach, I implemented the Painter's Algorithm found on [the Wikipedia page for Alpha Blending](https://en.wikipedia.org/wiki/Alpha_compositing#Description).

With the naive approach, transparent colors over other transparent colors sometimes mixed to be too dark, which could look odd. Other than that issue, however, the final results are extremely similar, so I wasn't too far off originally!
### <u>Multiply</u>
This is a classic blend mode, and one that's relatively easy to implement, so I wanted to take the opportunity to include it in this project.

It works as the name implies: multiply the old color and the new color. So if you have 50% red and 10% red, the final result is 5% red. In order to respect the user's desired alpha, I then take that multiplied result and lerp it with the old color by the alpha of the new color.
```
for each color channel [r, g, b]:
  "full-strength" multiplied channel = old ch * new ch / 255;
  final channel = lerp(old ch, full strength ch, new alpha)
```
The result is a rich darkening effect that looks very nice. As with my naive "mix" function, it's not perfectly accurate to modern expectations due to the simplified way that I'm handling the alphas. But it's a functional approximation.
## Other Features
### Fill
In order to generate "noisy" fills while using the randomized draw modes, getColor() is called for every pixel.
### Reset
Resets the grid so every pixel is `rba(0,0,0,0)`. 
I wanted to do an animated effect here, but I couldn't find a way to animate every pixel without causing massive lag, even at relatively low (~25) grid sizes. (This is the same reason I implemented and then removed an animating background.)
### Grid Size
The button and prompt have been replaced with a range slider (2, 64) that automatically calls generateGrid when its "change" event is called. I put a relatively low cap of 64 on the grid size, both for performance and stylistic reasons.
# Reflection
While working on this project, I tried to limit myself to what has been covered so far in The Odin Project up to this point. The JavaScript is really simple, and I don't yet have great organizational strategies, so working through the code is a bit of a bear.

I'm also still struggling with CSS. Responsiveness wasn't a high priority for me with this project, because the nature of the "hover" input pretty much necessitates a mouse, which limits the variety of target devices. ...Which is just as well, because I don't have a good enough grasp on CSS to implement a responsive design. I've been struggling to find good resources for learning the underlying positioning logic for CSS. At the moment, just feels like a mess of a million different conflicting properties, but I'm hoping it will become more comfortable with it as I have time to digest it. This is another reason why I'm taking such an expansive approach to these early projects, because I want to have *lots* of practice with CSS before we start diving into CSS libraries like Bootstrap and extensions like SASS. 