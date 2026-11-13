# Roblox From the Ground Up

<CourseTeaser
  theme="gaming"
  title="Build the game. Understand every line."
  hook="Start from zero and finish with a published multiplayer arena. No copy-pasted scripts you cannot explain."
  pains="You paste a free model in, and now you own scripts you did not write.|The tutorial works until you try to change it.|Your game runs fine alone and falls apart with other players.|A cheater gives themselves a million coins in your first week.|Your interface looks like every other first-week project."
  steps="Get moving:32:Studio, Luau, events, and the client and server wall|Look and feel:44:Animation, enemy AI, your own art, a custom UI|Systems:24:Saving data, a shop, an economy, game feel|Ship it:14:Performance, security, monetization, publishing"
>
  <MiniArena />
</CourseTeaser>

## You just played the finished idea

Move your pointer, click to strike, grab the coins. That tiny arena is the shape of the game you will build: waves that get harder, enemies that chase you, a reward for surviving. In the course it grows up into a real multiplayer game with saved progress, a shop and your own art.

<Callout type="info">
Everything in that demo is made of ideas the course teaches in order: rounds and waves in Module 3, enemies in Module 6, and the rules that keep players honest in Module 4.
</Callout>

## The problem with learning Roblox online

Most Roblox tutorials show you how to make one thing work. Drop in a script, press play, it works. Then you try to change it, or add a second player, or save a score, and nothing you learned applies.

That leaves four common walls:

- **Scripts you cannot explain.** Free models and copied code work until they do not.
- **A game that only works alone.** Roblox runs on a server and on every player's device at once, and beginners are rarely told what that means.
- **Cheaters.** If the client is trusted, players can give themselves anything.
- **Lost progress.** Saving data looks like one line of code, and it is the line that loses players.

## How this course works instead

<Principle number="1">
**One game, start to finish.** Every module's build is a step in the same arena game, so you ship something instead of collecting disconnected exercises.
</Principle>

<Principle number="2">
**Build first.** Each module opens with something running in Studio before any new term appears.
</Principle>

<Principle number="3">
**The server is the boss.** From Module 4, nothing important is trusted from the player's device. This single idea separates a game that survives real players from one that does not.
</Principle>

<Principle number="4">
**Hand-built before generated.** You make interface by hand before you use any art tool, so you know what the tool is giving you.
</Principle>

<Principle number="5">
**Every module ends with a check-yourself task.** If you cannot do it without notes, repeat the build.
</Principle>

## What you will build

A co-op wave-survival arena. Players start in a lobby, are carried into an arena, fight escalating waves together, earn coins, buy upgrades between rounds, and keep their progress when they leave.

<TechStack>
  <TechItem name="Luau" />
  <TechItem name="Roblox Studio" />
  <TechItem name="RemoteEvents" />
  <TechItem name="DataStore" />
  <TechItem name="Animation" />
  <TechItem name="Pathfinding AI" />
  <TechItem name="TweenService" />
  <TechItem name="Custom UI" />
</TechStack>

## A taste of Lesson 1

You do not need to know how to code to start. The first module is about learning to read Studio, and the second teaches the scripting language from scratch, including the two habits that trip up almost every beginner.

```lua
local spawns = { "Lobby", "ArenaNorth", "ArenaSouth" }

print(spawns[1])   -- Lobby. Lists start at 1, not 0.
print(#spawns)     -- 3

local part = workspace:FindFirstChild("Baseplate")  -- methods use a colon
```

Lists count from 1. Methods are called with a colon. Both are covered in Module 2, with a straight face.

## The road

<CourseProgress
  phase1="Get Moving" modules1="1-4" hours1="32"
  phase2="Look and Feel" modules2="5-9" hours2="44"
  phase3="Systems" modules3="10-12" hours3="24"
  phase4="Ship It" modules4="13-14" hours4="14"
/>

1. **Studio and the arena.** Navigate Studio and block out the arena.
2. **Luau from scratch.** The scripting language, in small steps.
3. **Events and the game loop.** Coins, hazards and a full round system.
4. **Client and server.** Make them talk, and never trust the client.
5. **Characters and animation.** Rigs, keyframes, and damage that lands on the hit frame.
6. **Enemies and AI.** Line of sight, pathfinding, and escalating waves.
7. **Your own art.** Get 3D models into the game cleanly.
8. **Interface fundamentals.** UI that works on phones, consoles and PCs.
9. **Custom UI art.** A style that does not look default.
10. **Saving data.** Progress that is never lost or duplicated.
11. **Inventory and economy.** A shop, upgrades and a balanced economy.
12. **Game feel.** Effects, sound and camera that make hits land.
13. **Performance and security.** Run well and resist cheaters.
14. **Monetization and publishing.** Passes, products and a real launch.

About 134 hours with the capstone, roughly 22 weeks at 6 hours a week.

## How it ends

The capstone is a real launch. You fix everything a five-person playtest finds, finish your store page, release version 1.0 publicly, read the first week of data, and ship an update based on what players actually did.

You are done when a stranger can find your game, play a round, and finish it without your help, and their progress saves.

## Who it is for

Anyone who wants to make games on Roblox, with no 3D, game-development or Roblox experience needed. You need a free Roblox account, a Windows or Mac computer that runs Roblox Studio, and a mouse with a scroll wheel.

## Get told when it launches

Leave your email and you will hear when the course goes live, and when new modules and related lessons are added.

<EmailForm campaign="roblox-course-complete" placeholder="Email me when the Roblox course launches" />
