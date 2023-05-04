# Knob Input Example

Here is a [demo of a basic knob input](https://mhull.github.io/knob-input-example/).

This is a project I did in my spare time for fun, where I was interested in mimicking what it's like to play around with
the type of audio plugins one finds in Digital Audio Workspaces like ProTools, Logic, Ableton, etc.

In the browser, this translated for me into having what looks like a physical knob that the user can turn by dragging in a 
circular motion either clockwise or counter-clockwise. When the knob is turned, it emits an event that other DOM elements
can listen for. In this case, the knob's value is two-way bound to the value of the text input.

I used the underlying knob model in conjunction with other models like lights and switches in the
[Sweet Tooth Frequency Modulator](https://github.com/mhull/sweet-tooth-frequency-modulator).

As I was working on this, I was also playing around with the idea of componentized bits of HTML, SCSS, and JS like you see
in the single-file Vue.js components, but I wanted to have a more natural approach than relying on a JavaScript framework.
An example would be looking in the `src/components/KnobInput` directory where the component's pieces live in separate files. I'm not sure I came
up with a solution for components that makes things less complex instead of more complex, but regardless it was a good
learning experience to try and "create the component concept from scratch."    
