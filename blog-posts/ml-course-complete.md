# ML From the Ground Up

Learn machine learning the way builders learn best: run something, watch it work, then learn what it's called.

This course teaches machine learning in the order a builder learns best. Written for someone fluent in web/app development who met the math in university but never saw it used. Every module builds on the one before it, starting from lists of numbers and the distance between them.

<CourseProgress 
  phase1="Seeing the Idea" modules1="1-3" hours1={26}
  phase2="Letting the Program Learn" modules2="4-7" hours2={36}
  phase3="Trusting It and Using It" modules3="8-10" hours3={32}
/>

---

## Prerequisites

You need fluency in web/app development, basic CS math exposure (distance, derivatives, matrices), and comfort with async/await. You don't need prior ML experience, framework knowledge, or anything beyond what you learned in school.

<TechStack>
  <TechItem name="JavaScript" />
  <TechItem name="Python" />
  <TechItem name="NumPy" />
  <TechItem name="scikit-learn" />
  <TechItem name="PyTorch" />
  <TechItem name="Google Colab" />
  <TechItem name="Canvas API" />
  <TechItem name="ESP32/Arduino" />
</TechStack>

---

## Four Core Principles

<Principle number="1">
**Build first.** Each module opens with something that runs in the browser or in a few lines of code, before any new term appears.
</Principle>

<Principle number="2">
**No framework until Module 9.** Every idea is first written by hand in loops you can read.
</Principle>

<Principle number="3">
**Math arrives only when a build needs it**, with a one-line reminder of what it is.
</Principle>

<Principle number="4">
**Each module ends with a check-yourself task.** If you cannot do it without notes, repeat the build.
</Principle>

---

## Vocabulary Decoded

Most ML jargon names something you already use in code.

<VocabTable>
  <VocabRow term="Vector" meaning="A list of numbers" context="[9000, 4500, 560]" />
  <VocabRow term="Feature" meaning="One number in that list" context="One form field, one column" />
  <VocabRow term="Sample" meaning="One complete list" context="One row, one button press" />
  <VocabRow term="Label" meaning="The correct answer" context="The 'Volume Up' column" />
  <VocabRow term="Model" meaning="Function with adjustable numbers" context="Function reading config file" />
  <VocabRow term="Parameters" meaning="The adjustable numbers" context="Config values the program changes" />
  <VocabRow term="Training" meaning="Adjusting until outputs match labels" context="Loop: run, measure, adjust, repeat" />
  <VocabRow term="Loss" meaning="How wrong the model is" context="Lower is better" />
  <VocabRow term="Gradient" meaning="Direction to nudge each parameter" context="A derivative from calculus" />
  <VocabRow term="Learning rate" meaning="How big each nudge is" context="Step size in the loop" />
  <VocabRow term="Inference" meaning="Using the trained model" context="Calling the finished function" />
  <VocabRow term="Overfitting" meaning="Memorizing examples, failing on new ones" context="Passing your tests, failing users" />
</VocabTable>

---

## Phase 1: Seeing the Idea

<PhaseCard 
  phase="Phase 1: Seeing the Idea"
  modules="1-3"
  description="Classify signals by distance and make a program improve itself by measuring its own error. Everything runs in the browser in JavaScript — nothing to install."
  hours={26}
/>

### Module 1: Numbers as Patterns

<ModuleCard 
  number="M1"
  title="Numbers as Patterns"
  hours={6}
  objective="Explain a vector as an array and compute how far apart two of them are."
>

**Core concepts:**
- Data as arrays
- A signal as a list of timings
- A sample as one row, a feature as one column
- Why images, sound and text all end up as arrays
- Distance (Euclidean distance step by step)
- Manhattan distance and when it behaves better
- Cosine similarity: compare the angle instead of the length
- Scaling (why a feature measured in thousands drowns out one measured in tens)
- Min-max scaling and standardizing to mean 0 and spread 1

**Build:** In the browser, compare a noisy list of numbers with a few saved lists and show the distances. Then add a scaling switch and find a case where scaling changes which saved list is closest.

<CheckYourself>
Without looking, write distance() and explain why the differences are squared.
</CheckYourself>

</ModuleCard>

### Module 2: Learning From Examples with Nearest Neighbours

<ModuleCard 
  number="M2"
  title="Learning From Examples with Nearest Neighbours"
  hours={10}
  objective="Build a classifier that labels new data by comparing it with saved, labeled examples, and measure how often it's right."
>

**Classification fundamentals:**
- Labels and classes
- 1-nearest neighbour: copy the label of the single closest example
- k-nearest neighbours, where k neighbours vote
- Measuring success (accuracy)
- Train and test split: never test on examples you saved
- Confusion matrix: which classes get mixed up
- Choosing k (small k is jumpy, large k is blurry)
- Why a rejection limit is needed for buttons you never saved

**Build:** A drawing pad on a canvas. Draw digits on a small grid, save them as labeled examples, then classify new drawings with k-NN.

<Outcome>After this module: Your first working classifier, built from scratch in the browser.</Outcome>

<CheckYourself>
Split your examples 80/20 and report accuracy and a confusion matrix for k = 1, 3 and 5.
</CheckYourself>

</ModuleCard>

### Module 3: Learning by Adjusting, Fitting a Line

<ModuleCard 
  number="M3"
  title="Learning by Adjusting, Fitting a Line"
  hours={10}
  objective="Make a program improve itself by repeatedly measuring its error and nudging its numbers."
>

**The breakthrough concept:**
- A model with adjustable numbers: y = w × x + b
- What w and b each do
- Parameters versus inputs
- Loss: error for one point, then mean squared error for all points
- Why squared (for the same reason as in distance)
- Gradient descent: the slope of the loss, a derivative in plain terms
- The update rule: new w = old w minus learning rate × slope
- A learning rate that's too big diverges, too small crawls
- Reading a loss curve (falling, flat, exploding)

**Build:** Click points on a canvas and watch a line move toward them step by step, with the loss number and loss curve updating live. About 40 lines of JavaScript.

<CheckYourself>
For a dataset of 3 points, work out the two gradients by hand and match what your code calculates.
</CheckYourself>

</ModuleCard>

---

## Phase 2: Letting the Program Learn

<PhaseCard 
  phase="Phase 2: Letting the Program Learn"
  modules="4-7"
  description="Write a small neural network and its training loop yourself. After this phase, Karpathy's micrograd video will read as familiar code."
  hours={36}
/>

### Module 4: From JavaScript to Python and NumPy

<ModuleCard 
  number="M4"
  title="From JavaScript to Python and NumPy"
  hours={8}
  objective="Rewrite your earlier projects in Python so you can read the code in most ML tutorials."
>

**Python for JavaScript developers:**
- What trips people up: indentation, lists versus arrays, dicts versus objects, list comprehensions, classes with self
- Running code with no setup in Google Colab or a Jupyter notebook
- NumPy: arrays, shape and indexing
- Vectorized operations: one expression replaces a loop
- Dot product and matrix multiply, and where they hide inside your distance and line-fit code
- matplotlib for points, lines and loss curves

<CodeCompare 
  title="Distance Calculation"
  beforeLabel="JavaScript (loops)"
  before="let sum = 0;
for (let i = 0; i < a.length; i++) {
  const diff = a[i] - b[i];
  sum += diff * diff;
}
return Math.sqrt(sum);"
  afterLabel="NumPy (vectorized)"
  after="return np.sqrt(((a - b) ** 2).sum())"
/>

**Build:** Port k-NN and the line fit to Python twice — once with loops, once with NumPy — and confirm both print the same numbers.

<CheckYourself>
Explain np.sqrt(((a - b) ** 2).sum()) to someone who only knows JavaScript.
</CheckYourself>

</ModuleCard>

### Module 5: Yes or No, Logistic Regression

<ModuleCard 
  number="M5"
  title="Yes or No, Logistic Regression"
  hours={8}
  objective="Turn a number into a probability and train a model that answers yes or no."
>

**Binary classification:**
- From a line to a decision
- A weighted sum of many features: w1 × x1 + w2 × x2 + b
- Sigmoid, which squashes any number into the range 0 to 1
- Threshold and decision boundary
- Loss for yes-or-no answers (why squared error fits this job poorly)
- Cross-entropy in plain terms: confident wrong answers are punished hard
- Training it: the same gradient descent loop as Module 3 with a new loss
- Many features, and why the scaling from Module 1 matters now

**Build:** Classify two clouds of points on a canvas and watch the boundary line move as it trains. Then repeat on a small real dataset (pass or fail from study hours and sleep hours).

<CheckYourself>
Predict by hand what sigmoid gives for -2, 0 and 2, and say what each result means.
</CheckYourself>

</ModuleCard>

### Module 6: The Neuron

<ModuleCard 
  number="M6"
  title="The Neuron"
  hours={6}
  objective="Build a single artificial neuron and show that it's Module 5's model under a new name."
>

**Neuron anatomy:**
- Inputs, weights, bias, weighted sum, activation
- The same formula you wrote in Module 5
- Activation functions: sigmoid, tanh and ReLU, and what each does to a number
- Why a non-linear step is needed at all
- What one neuron cannot do: AND and OR work, XOR cannot be separated by a single line

**Build:** A neuron playground with sliders for weights and bias. Make it compute AND and OR, then try XOR and watch it fail.

<CheckYourself>
Choose weights by hand so one neuron computes AND, then change them so it computes OR.
</CheckYourself>

</ModuleCard>

### Module 7: Networks and Backpropagation

<ModuleCard 
  number="M7"
  title="Networks and Backpropagation"
  hours={14}
  objective="Train a small neural network from scratch and explain every line of its training loop."
>

**The complete picture:**
- Layers: many neurons side by side, layers stacked
- The forward pass as repeated multiply, add, activate
- Shapes: what goes into and comes out of each layer
- Backpropagation: the chain rule from calculus, one function inside another
- Working backward from the loss to every weight, by hand on a two-neuron example
- Why it's efficient: partial results are reused
- The training loop: batches and epochs
- Starting weights, and why not all zeros
- Watching loss and accuracy together
- Solving XOR, then digits

**Build:** A two-layer network in plain JavaScript or Python that solves XOR, then reads digits drawn on your Module 2 canvas. Compare its accuracy with k-NN.

<Outcome>After this module: You've written backpropagation from scratch. Karpathy's micrograd video now makes complete sense.</Outcome>

<CheckYourself>
Watch Karpathy's micrograd video now. The Neuron, Layer and MLP classes should look like Modules 6 and 7 written as code.
</CheckYourself>

</ModuleCard>

---

## Phase 3: Trusting It and Using It

<PhaseCard 
  phase="Phase 3: Trusting It and Using It"
  modules="8-10"
  description="Tell a model that learned from a model that memorized. Use frameworks with confidence. Recognize patterns in sensor data on a small device."
  hours={32}
/>

### Module 8: Does It Actually Work?

<ModuleCard 
  number="M8"
  title="Does It Actually Work?"
  hours={8}
  objective="Tell a model that learned from a model that memorized."
>

**The reality check:**
- Three sets of data: train, validation and test, and what each is for
- Data leakage: the test answers sneaking into training
- Overfitting and underfitting
- Loss curves that pull apart
- A model that is too simple versus one that is too flexible
- Fixes: more data, a simpler model, early stopping
- Regularization in plain words: penalize large weights
- Better scores than accuracy: precision and recall, which are false matches versus missed matches
- When accuracy lies, such as when one class is rare

**Build:** Make your Module 7 network overfit on purpose with a tiny dataset, then fix it using validation loss and early stopping.

<CheckYourself>
Shown a pair of training and validation loss curves, say whether the model is overfitting and what you would change.
</CheckYourself>

</ModuleCard>

### Module 9: Frameworks, Now That You Know What They Hide

<ModuleCard 
  number="M9"
  title="Frameworks, Now That You Know What They Hide"
  hours={10}
  objective="Use scikit-learn and one deep learning framework with confidence, because you know what each call does underneath."
>

**Finally, the tools:**
- scikit-learn: the fit, predict, score pattern and train_test_split
- k-NN and logistic regression in a few lines each
- Decision trees and random forests, a new kind of model
- PyTorch or TensorFlow (pick one):
  - Tensors are NumPy arrays that can track gradients
  - A layer, a loss and an optimizer map to Modules 6, 3 and 7
  - The same training loop in about ten lines
  - PyTorch is more common in tutorials. TensorFlow leads to TensorFlow Lite, used in Module 10
- Reading other people's code: take a tutorial notebook and label each part with the module it came from

**Build:** Rebuild your digit classifier three ways (your own code, scikit-learn, and the framework) and compare accuracy and lines of code.

<Outcome>After this module: You can read any ML tutorial with confidence because you know what's happening underneath.</Outcome>

<CheckYourself>
Open a TensorFlow beginner tutorial and annotate every line with the idea it implements.
</CheckYourself>

</ModuleCard>

### Module 10: Signals and Small Devices

<ModuleCard 
  number="M10"
  title="Signals and Small Devices"
  hours={14}
  objective="Recognize patterns in real sensor data and run the recognizer on a small device."
>

**Real-world ML:**
- Time-series data: sampling (readings at fixed intervals)
- Windows: cutting a stream into fixed-length arrays
- Noise and smoothing with a moving average
- Features from signals: simple ones (minimum, maximum, mean, variance, zero crossings)
- The frequency view: the Fourier transform in plain words, with the spectrum as a vector
- Recognizing signals: k-NN or a small network on windows
- Rejecting "none of the above" with a limit
- Running on a device: model size and memory limits
- TensorFlow Lite for Microcontrollers in overview, or plain distance matching written in C++ for tiny cases
- A board with an accelerometer or an IR receiver, such as an ESP32

**Build:** Record three gestures with your phone's motion sensors or a small board, then recognize them with the k-NN code from Module 2.

<CheckYourself>
Explain why you window and scale a signal before matching it.
</CheckYourself>

</ModuleCard>

---

## Capstone: IR Remote Learner

**Done when:** Build a device that learns a real remote control and recognizes its buttons without a laptop, using nearest-neighbour matching from Module 2.

**Parts needed:**
- ESP32 or Arduino board
- VS1838B IR receiver module (or similar)
- Both are inexpensive (~$10 total)

**Milestones:**

1. Capture raw pulse timings from a real remote and print them on the serial monitor
2. Store five presses for each of at least three buttons
3. Recognize a new press with k-NN and a rejection limit. Get it working in the browser first, then move it to the board
4. Test on presses you didn't store. Report accuracy, the confusion matrix and the false-match rate
5. Add a learning mode: press a button five times to teach the device a new name
6. Optional: act on a match, such as switching an LED or a relay

**Success criteria:**
- At least 95% of held-out presses are recognized correctly
- A button you never taught is rejected in at least 9 of 10 tries
- It runs on the board with no computer attached

Alternative: Swap in a gesture recognizer built on your phone's motion sensors. The milestones are the same.

---

## Course Structure Summary

**Phase 1 (26 hours) — Seeing the Idea**
- Numbers as patterns
- k-nearest neighbours
- Fitting a line with gradient descent
- Language: JavaScript (browser)
- Outcome: Classify by distance, make programs self-improve

**Phase 2 (36 hours) — Letting the Program Learn**
- Python and NumPy
- Logistic regression
- Neurons and networks
- Backpropagation from scratch
- Language: Python (Colab/Jupyter)
- Outcome: Write neural networks by hand

**Phase 3 (32 hours) — Trusting It and Using It**
- Overfitting detection
- Frameworks (scikit-learn, PyTorch/TensorFlow)
- Sensor signals and devices
- Language: Python + C++ (for device)
- Outcome: Use frameworks confidently, deploy to hardware

**Capstone (20 hours) — IR Remote Learner**
- Real hardware project
- k-NN on embedded device
- No computer required after deploy
- Hardware: ESP32 + IR receiver

---

## Resource Map

Use one main resource per module and keep the second for when you get stuck.

<VocabTable>
  <VocabRow term="Module 1" meaning="3Blue1Brown: Essence of Linear Algebra (ch 1)" context="Joel Grus: Data Science from Scratch" />
  <VocabRow term="Module 2" meaning="StatQuest: k-nearest neighbors" context="ml5.js KNN classifier example" />
  <VocabRow term="Module 3" meaning="StatQuest: Gradient Descent, Step-by-Step" context="3Blue1Brown: Neural Networks (ch 2)" />
  <VocabRow term="Module 4" meaning="Google Colab + NumPy Absolute Beginners" context="Data Science from Scratch (Python chapters)" />
  <VocabRow term="Module 5" meaning="StatQuest: Logistic Regression" context="Andrew Ng: ML Specialization" />
  <VocabRow term="Module 6" meaning="Tariq Rashid: Make Your Own Neural Network" context="3Blue1Brown: Neural Networks (ch 1)" />
  <VocabRow term="Module 7" meaning="3Blue1Brown: NN (ch 3-4) + Karpathy's micrograd" context="The Coding Train: NN series (JavaScript)" />
  <VocabRow term="Module 8" meaning="StatQuest: bias/variance, cross validation" context="Andrew Ng: advice for applying ML" />
  <VocabRow term="Module 9" meaning="scikit-learn + PyTorch Getting Started" context="fast.ai: Practical Deep Learning" />
  <VocabRow term="Module 10" meaning="3Blue1Brown: Fourier Transform + TinyML book" context="Edge Impulse tutorials" />
</VocabTable>

Leave for later: Karpathy's full Zero to Hero series until after Module 7. fast.ai until Module 9. Both assume ground this course covers first.

---

## What Makes This Course Different

**Build before naming.** Most ML courses start with "here's what a neural network is" and show math before code. This course starts with "click these points, watch the line move" and introduces terms only after you've seen them work.

**No framework until you've written its job.** You don't use PyTorch until you've written gradient descent, backpropagation, and a training loop yourself. When you finally see `optimizer.step()`, you know exactly what it's doing.

**Math when you need it.** Distance appears when you're comparing patterns. Derivatives appear when you're adjusting weights. Each piece of math arrives with a one-line reminder and a concrete use case.

---

## Time Commitment

**Total:** About 115 hours (including capstone)  
**Pace:** Roughly 19 weeks at 6 hours per week  
**Prerequisites:** Fluent in web/app development, basic CS math exposure

---

## Get Notified When Modules Launch

<EmailForm campaign="ml-course" placeholder="Enter your email for course updates" />

---

## Who This Course Is For

This course is for you if you can write JavaScript or Python, you've seen derivatives and matrices in school, you want to understand ML from first principles, tutorials lose you in the first ten minutes, and you prefer building to watching lectures.

This course is NOT for you if you already understand backpropagation, you're looking for quick PyTorch recipes, you need production deployment patterns, you want to train large language models, or math explanations make you uncomfortable.

---

## About the Pedagogy

This course follows the principle that builders learn by building first, naming later. Every module opens with working code before any technical term appears.

The math — distance, derivatives, gradients — is reintroduced when a build needs it, with one-line reminders of what it does. If you passed linear algebra and calculus in university but never used them, this course shows you where they appear in working code.

**Time commitment:** About 115 hours total, including the hardware capstone project.

If you're fluent in web/app development and comfortable with basic CS math, you can complete this course. No prior ML experience required.
