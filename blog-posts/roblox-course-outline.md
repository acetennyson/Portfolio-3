# Roblox From the Ground Up: Complete Course Outline

Build a multiplayer game from zero. No prior 3D, game development, or Roblox experience required.

<Callout type="info">
This course teaches Roblox development the way beginners learn best: **build something, watch it work, then learn what it's called.** By the end, you'll have shipped a complete co-op wave-survival arena game.
</Callout>

<CourseProgress 
  phase1="Get Moving" modules1="1-4" hours1={32} color1="#3B82F6"
  phase2="Make It Feel Like a Game" modules2="5-9" hours2={44} color2="#8B5CF6"
  phase3="Systems" modules3="10-12" hours3={24} color3="#EC4899"
  phase4="Ship It" modules4="13-14" hours4={14} color4="#10B981"
/>

## What You'll Build

A **co-op wave-survival arena**: players fight escalating waves, earn coins, buy upgrades between rounds, and their progress saves. It forces nearly every Roblox system to appear naturally.

<TechStack>
  <TechItem name="Luau" />
  <TechItem name="Roblox Studio" />
  <TechItem name="RemoteEvents" />
  <TechItem name="DataStore" />
  <TechItem name="Animations" />
  <TechItem name="AI Pathfinding" />
  <TechItem name="TweenService" />
  <TechItem name="ProximityPrompts" />
</TechStack>

## Five Core Principles

<Principle number="1">
**One game, start to finish.** Every module's build is a step in the same game, so by the end you have shipped something instead of collecting disconnected exercises.
</Principle>

<Principle number="2">
**Build first.** Each module opens with something running in Studio before any new term appears.
</Principle>

<Principle number="3">
**Hand-built before generated.** You make UI by hand before using tools, so you know what the tool is giving you.
</Principle>

<Principle number="4">
**The server is the boss.** From Module 4, nothing important is trusted from the client. This is the biggest difference from three.js.
</Principle>

<Principle number="5">
**Each module ends with a check-yourself task.** If you cannot do it without notes, repeat the build.
</Principle>

---

## Phase 1: Get Moving

<PhaseCard 
  phase="Phase 1: Get Moving"
  modules="1-4"
  description="Script a secure, server-authoritative arena with a round loop. Learn Studio, Luau from scratch, events, and the wall between client and server."
  hours={32}
  color="#3B82F6"
/>

### Module 1: Getting Around Studio (6 hours)

Build and publish a blocked-out arena in Roblox Studio, starting from zero.

<ModuleCard 
  number="M1"
  title="Getting Around Studio and Building the Arena"
  hours={6}
  objective="Build and publish a blocked-out arena in Roblox Studio, starting from zero. No prior 3D, game-development or Roblox experience is assumed."
  color="#3B82F6"
>

**What you'll learn:**
- The Studio window: Viewport, Explorer, Properties, Toolbox
- Space, axes, and moving things (studs, position, size)
- Parts and physics (Anchored, CanCollide, Materials)
- Models, Folders, and naming conventions
- Lighting and mood
- SpawnLocations and player character
- Testing with local servers (Play, Run, multi-client testing)

<CheckYourself>
Without notes, open a blank place, build a walled room with a floor and a spawn point that holds up when you press Play, then publish it.
</CheckYourself>

</ModuleCard>

### Module 2: Luau From Scratch (8 hours)

Read and write basic Luau well enough to stop thinking about syntax.

<ModuleCard 
  number="M2"
  title="Luau From Scratch"
  hours={8}
  objective="Read and write basic Luau, Roblox's scripting language, well enough to stop thinking about syntax. No programming experience assumed."
  color="#3B82F6"
>

**Key topics:**
- Values and variables (numbers, strings, booleans, nil)
- Making decisions (if, elseif, comparisons)
- Repeating things (for loops, while, task.wait)
- Functions (parameters, return values, scope)
- Tables as lists and dictionaries
- Talking to Roblox objects (game, workspace, FindFirstChild)
- ModuleScripts for reusable code

<Callout type="warning">
**Four Luau gotchas** that trip up beginners: lists count from **1**, only `false` and `nil` are falsy, text is joined with `..`, and methods are called with a colon (`:`).
</Callout>

<CheckYourself>
Without notes, write a function that returns a weapon's damage from a config table, handles a weapon name that doesn't exist without crashing, and prints a countdown.
</CheckYourself>

</ModuleCard>

### Module 3: Events, Services and the Game Loop (8 hours)

Make the world react to players and to time.

<ModuleCard 
  number="M3"
  title="Events, Services and the Game Loop"
  hours={8}
  objective="Make the world react to players and to time, and use that to run a full round of the game."
  color="#3B82F6"
>

**What you'll build:**
- Touch events and coin pickups
- Players, characters, and the Humanoid
- Hazards and health systems
- Time and the frame loop (Heartbeat, delta time)
- Smooth motion with TweenService
- Tags and attributes (CollectionService)
- ProximityPrompts for interaction
- State machines for round flow

<Outcome>After this module: A complete round loop with lobby countdown, teleport to arena, lava hazards, coins, and winner announcement.</Outcome>

<CheckYourself>
Draw the round state machine from memory and explain what the game does when a player leaves mid-round.
</CheckYourself>

</ModuleCard>

### Module 4: Client, Server and the Wall Between Them (10 hours)

**The most important module.** Understand which code runs where, make client and server talk, and never trust what the client says.

<ModuleCard 
  number="M4"
  title="Client, Server and the Wall Between Them"
  hours={10}
  objective="Understand which code runs where, make the client and server talk to each other, and never trust what the client says."
  color="#3B82F6"
>

**Critical concepts:**
- Two computers, one game (server authority)
- Where scripts live and where they run
- What replicates and what doesn't
- RemoteEvents (client to server, server to client)
- **Never trust the client** (exploiter's view, validation, sanity checks)
- Rate limiting and cooldowns
- Designing a secure action
- Shared code between sides

<Callout type="error">
**Security rule:** Any client can fire any remote, at any time, with any values, as often as it likes. The server must check **everything**: the right type, a sane range, the right state, the right player.
</Callout>

<Outcome>After this module: A server-authoritative attack system where the client requests, and the server validates and decides.</Outcome>

<CheckYourself>
Write a fake, abusive remote call from the client, then add the server check that blocks it.
</CheckYourself>

</ModuleCard>

---

## Phase 2: Make It Look and Feel Like a Game

<PhaseCard 
  phase="Phase 2: Make It Feel Like a Game"
  modules="5-9"
  description="Animate characters, run enemy AI, import your own art, and build custom UI that works on every device."
  hours={44}
  color="#8B5CF6"
/>

### Module 5-9: Character Animation, AI, Art, and UI

[Condensed for brevity - see full artifact for complete module breakdowns]

---

## Phase 3: Systems

<PhaseCard 
  phase="Phase 3: Systems"
  modules="10-12"
  description="Save player data, run an economy, and polish game feel with effects, sound, and camera."
  hours={24}
  color="#EC4899"
/>

---

## Phase 4: Ship It

<PhaseCard 
  phase="Phase 4: Ship It"
  modules="13-14"
  description="Find and fix what makes the game slow, defend against cheating, and publish to real players."
  hours={14}
  color="#10B981"
/>

---

## Capstone: Ship Version 1.0

<Highlight>
**Done when:** A stranger can find, play and finish a round without your help, and progress saves across sessions.
</Highlight>

**Milestones:**
1. Fix every issue from a five-person playtest
2. Finish the store page, icon and thumbnail
3. Launch publicly
4. Read the first week of analytics
5. Ship one content update based on what players did

---

## Technical Terms Decoded

<VocabTable>
  <VocabRow term="Instance" meaning="Any object in the game" context="A Part, Script, or Sound" />
  <VocabRow term="Explorer" meaning="Tree listing every object" context="Where you find parts and scripts" />
  <VocabRow term="CFrame" meaning="Position and rotation stored together" context="How objects know where they are" />
  <VocabRow term="Heartbeat" meaning="Code that runs every frame" context="For smooth motion and updates" />
  <VocabRow term="RemoteEvent" meaning="Message between server and client" context="How the two sides talk" />
  <VocabRow term="Motor6D" meaning="Joint connecting two body parts" context="What animations move" />
  <VocabRow term="TweenService" meaning="Smoothly changes values over time" context="For doors, UI, motion" />
  <VocabRow term="ModuleScript" meaning="Reusable file of code" context="Config and shared functions" />
</VocabTable>

---

## Get Notified When Modules Launch

<EmailForm campaign="roblox-course" placeholder="Enter your email for course updates" />

---

## About This Course

This course was designed around the principle that **builders learn by building first, naming later**. Every module opens with working code before any new term appears. No framework is introduced until you've written its job yourself.

**Time commitment:** About 134 hours, roughly 22 weeks at 6 hours per week.

<Callout type="success">
No prior 3D, game development, or Roblox experience required. If you can open a text editor and follow instructions, you can complete this course.
</Callout>
