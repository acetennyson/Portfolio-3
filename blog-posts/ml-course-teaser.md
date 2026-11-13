# Machine Learning From the Ground Up

<CourseTeaser
  theme="ml"
  title="Machine learning, without the magic"
  hook="Most courses say import a library and press run. This one opens the box, so you know what happens in step two."
  pains="A tutorial tells you to install PyTorch, and a dataset appears from nowhere.|Nobody explains what the model is actually looking for.|You press run, numbers come out, and you cannot say why.|Derivatives, matrices and Greek letters arrive uninvited.|Use a slightly different library and you are lost again."
  steps="Seeing the idea:26:Distance, neighbours, and a line that fits itself|Letting it learn:36:A neural network and its training loop, written by hand|Trusting it:32:Does it work, frameworks, real sensor signals|Capstone:20:Ship a working recognizer"
>
  <LiveSignalDemo />
</CourseTeaser>

## You just did the first lesson

Press a button above, turn up the noise, then tick the scaling box. The computer is comparing a noisy list of numbers against three saved lists and picking the closest one. That is the whole idea behind the first three modules, and you have already watched scaling change the answer.

<Callout type="info">
Nothing was installed and no library was called. Every line of that demo is the kind of code you will write yourself in Module 1.
</Callout>

## The problem with learning ML online

Step one: install this library. Step two: call this function. Step three: it works! Congratulations, you are now a machine learning engineer. Please do not ask what happened in step two.

If you have searched for a way into machine learning, you have met this. The short courses, one to two hours each, hand you PyTorch or TensorFlow, a dataset appears out of nowhere, you press run, and numbers come out. That is great if you want to learn the tool. It is not machine learning from scratch.

What goes missing is everything underneath:

- What that dataset actually is, and what each number in it means.
- What the model is looking for.
- How the library does its work when you call it.

So the moment something breaks, or a tutorial uses a slightly different library, you are lost. You learned to operate the machine, not how it works.

## How this course works instead

<Principle number="1">
**Build first.** Each module opens with something running in your browser, before any new word appears. You watch it work, then learn what it is called.
</Principle>

<Principle number="2">
**No framework until Module 9.** Every idea is first written by hand, in loops you can read. When you finally meet scikit-learn and PyTorch, you will know what each call hides.
</Principle>

<Principle number="3">
**Math arrives only when a build needs it.** Each piece comes with a one-line reminder of what it is. No equation shows up uninvited.
</Principle>

<Principle number="4">
**Every module ends with a check-yourself task.** If you cannot do it without notes, repeat the build.
</Principle>

## The math, with the fear removed

Most machine learning jargon names something you already use in code.

| The scary word | Plain meaning | What you already know |
| --- | --- | --- |
| Vector | A list of numbers | An array like `[9000, 4500, 560]` |
| Feature | One number in that list | One form field, or one table column |
| Sample | One complete list | One row in a table, one button press |
| Label | The correct answer attached to a sample | The column holding the right answer |
| Loss | One number saying how wrong the model is | A squared distance |
| Gradient | The direction to nudge each setting to be less wrong | A derivative, from calculus |
| Overfitting | Memorizing the saved examples and failing on new ones | Passing your own tests while failing real users |

If a video or book loses you in the first ten minutes, it is aimed at a later module. Go back one module instead of pushing through.

## A taste of Lesson 1

Everything in the course starts with one idea: a measurement is a list of numbers, and the order of that list matters.

```js
const warming = [24, 24, 24.5, 25, 25.5, 26, 26.5, 27];
const cooling = [27, 26.5, 26, 25.5, 25, 24.5, 24, 24];
```

Same eight numbers. Same average, 25.3125. One is a room warming up and the other is a room cooling down. Only the order differs. Before a program can compare anything, the thing being compared has to be written as a list, and you have to know what each position means.

## The road

<CourseProgress
  phase1="Seeing the idea" modules1="1-3" hours1="26"
  phase2="Letting the program learn" modules2="4-7" hours2="36"
  phase3="Trusting it and using it" modules3="8-10" hours3="32"
  phase4="Capstone" modules4="Capstone" hours4="20"
/>

1. **Numbers as patterns.** Arrays, distance and scaling.
2. **Nearest neighbours.** Label new data by comparing it with saved examples, then measure how often you are right.
3. **Fitting a line.** Make a program improve itself by measuring its own error.
4. **Python and NumPy.** Rewrite your projects so you can read most tutorials.
5. **Yes or no.** Logistic regression, and turning a number into a probability.
6. **The neuron.** One neuron, and what it cannot do.
7. **Networks and backpropagation.** A small neural network and its training loop, line by line.
8. **Does it actually work?** Tell a model that learned from a model that memorized.
9. **Frameworks.** scikit-learn and PyTorch, now that you know what they hide.
10. **Signals and small devices.** Recognize patterns in real sensor data and run it on a board.

About 115 hours, roughly 19 weeks at 6 hours a week. A lot, yes. But it is one steady staircase, not a cliff.

## What you will build at the end

You finish with a working recognizer built from the nearest-neighbour matching you wrote in Module 2. Pick the version that suits you:

- A small device that learns a TV remote and recognizes its buttons with no laptop attached.
- A gesture recognizer that reads your phone's motion sensors.
- Something of your own, built on the same milestones.

Real signals, your results, no toy dataset someone else prepared.

## Who it is for

This course is written for developers who are comfortable building web or app software and met the math (distance, derivatives, matrices) without ever seeing it used. You need a browser and some curiosity. Nothing to install.

## Get told when it launches

Leave your email and you will hear when the course goes live, and when new modules and related lessons are added.

<EmailForm campaign="ml-course-complete" placeholder="Email me when the ML course launches" />
