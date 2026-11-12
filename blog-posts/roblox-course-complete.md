# Roblox From the Ground Up

Build a multiplayer game from zero. No prior 3D, game development, or Roblox experience required.

This course teaches Roblox development the way beginners learn best: build something, watch it work, then learn what it's called. By the end, you'll have shipped a complete co-op wave-survival arena game.

<CourseProgress 
  phase1="Get Moving" modules1="1-4" hours1={32}
  phase2="Make It Feel Like a Game" modules2="5-9" hours2={44}
  phase3="Systems" modules3="10-12" hours3={24}
  phase4="Ship It" modules4="13-14" hours4={14}
/>

---

## What You'll Build

A co-op wave-survival arena: players fight escalating waves, earn coins, buy upgrades between rounds, and their progress saves. It forces nearly every Roblox system to appear naturally.

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

---

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
**The server is the boss.** From Module 4, nothing important is trusted from the client. This is the biggest difference from client-side frameworks.
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
/>

### Module 1: Getting Around Studio and Building the Arena

<ModuleCard 
  number="M1"
  title="Getting Around Studio and Building the Arena"
  hours={6}
  objective="Build and publish a blocked-out arena in Roblox Studio, starting from zero. No prior 3D, game-development or Roblox experience is assumed."
>

**10 units, 340 minutes total**

**What you'll learn:**
- The Studio window (Viewport, Explorer, Properties, Toolbox, Output)
- Everything in a game is an Instance with parents and children
- Space, axes, and moving things (X, Y, Z coordinates, studs)
- Parts and physics (Anchored, CanCollide, Material, Transparency)
- Models, Folders, naming conventions
- Lighting and mood (ClockTime, Atmosphere, Sky)
- SpawnLocations (neutral vs team spawns, respawn time)
- Testing with local servers (Play, Run, multi-client testing)
- Publishing and version history

**Game step:** The arena blockout — a lobby, an arena with walls and cover, spawn points in both, a dusk mood, published as a private experience.

<CheckYourself>
Without notes, open a blank place, build a walled room with a floor and a spawn point that holds up when you press Play, then publish it.
</CheckYourself>

</ModuleCard>

### Module 2: Luau From Scratch

<ModuleCard 
  number="M2"
  title="Luau From Scratch"
  hours={8}
  objective="Read and write basic Luau, Roblox's scripting language, well enough to stop thinking about syntax. No programming experience assumed."
>

**11 units, 460 minutes total**

**Key topics:**
- Your first script (print, comments, ServerScriptService)
- Values and variables (`local`, numbers, strings, booleans, `nil`)
- Making decisions (`if`, `elseif`, `else`, comparisons)
- Repeating things (`for` loops, `while`, `task.wait`)
- Functions (parameters, return values, scope)
- Tables as lists (counting from 1, `#`, `ipairs`)
- Tables as dictionaries (key-value pairs, `pairs`)
- Talking to Roblox objects (`game`, `workspace`, `FindFirstChild`)
- ModuleScripts for reusable code
- Error messages and debugging
- Type annotations and `--!strict`

**Four Luau gotchas:**
1. Lists count from **1**, not 0
2. Only `false` and `nil` are falsy (zero is true)
3. Text is joined with `..`, not `+`
4. Methods are called with `:`, not `.`

**Game step:** A GameConfig module holding round length, wave count, and weapon stats. A script that reads it, builds arena cover pieces from a position list, and counts down the lobby timer in Output.

<CheckYourself>
Without notes, write a function that returns a weapon's damage from a config table, handles a weapon name that doesn't exist without crashing, and prints a countdown.
</CheckYourself>

</ModuleCard>

### Module 3: Events, Services and the Game Loop

<ModuleCard 
  number="M3"
  title="Events, Services and the Game Loop"
  hours={8}
  objective="Make the world react to players and to time, and use that to run a full round of the game."
>

**11 units, 480 minutes total**

**What you'll build:**
- Events and `:Connect` (reacting instead of waiting)
- Touch events (`.Touched`, debounce, `GetPlayerFromCharacter`)
- Players and characters (PlayerAdded, CharacterAdded, Humanoid, `leaderstats`)
- Hazards and health (`TakeDamage`, damage over time)
- Time and the frame loop (`Heartbeat`, delta time, `task.spawn`)
- Smooth motion with TweenService
- Tags and attributes (CollectionService, `GetTagged`)
- ProximityPrompts for interaction
- State machines (lobby → intermission → round → results)
- Building the round system (minimum players, countdown, teleport, end conditions)
- Cleaning up (Disconnect, Debris service, avoiding leaks)

**Game step:** A complete round loop — lobby, countdown, teleport to the arena, lava hazard, tag-driven coins, winner announced in Output, everyone returned to lobby.

<CheckYourself>
Draw the round state machine from memory and explain what the game does when a player leaves mid-round.
</CheckYourself>

</ModuleCard>

### Module 4: Client, Server and the Wall Between Them

<ModuleCard 
  number="M4"
  title="Client, Server and the Wall Between Them"
  hours={10}
  objective="Understand which code runs where, make the client and server talk to each other, and never trust what the client says."
>

**12 units, 600 minutes total**

**The most important module.** This is the foundation of everything that makes a multiplayer game fair.

**Critical concepts:**
- Two computers, one game (server authority, replication)
- Where scripts live and where they run (Script, LocalScript, RunContext)
- Containers (ServerScriptService, ServerStorage, ReplicatedStorage, StarterPlayerScripts)
- What replicates and what doesn't
- The local player and client-only jobs (PlayerGui, camera, input)
- RemoteEvents client to server (`:FireServer`, `:OnServerEvent`)
- RemoteEvents server to client (`:FireClient`, `:FireAllClients`)
- RemoteFunctions and when not to use them
- **Never trust the client** (exploiter's view, validation, sanity checks)
- Rate limiting and cooldowns
- Designing a secure action (input → request → checks → server finds target → server applies damage → client shows feedback)
- Sharing code between sides (ModuleScripts in ReplicatedStorage)
- Debugging across client and server

**Security rule:** Any client can fire any remote, at any time, with any values, as often as it likes. The server must check **everything**.

**Game step:** A server-authoritative attack — the client says "I swung," and the server checks the request, decides what was hit, and applies the damage.

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
/>

### Module 5: Characters, Rigs and Animation

<ModuleCard 
  number="M5"
  title="Characters, Rigs and Animation"
  hours={10}
  objective="Understand how Roblox characters are built, make your own animations inside Studio, and connect them to gameplay."
>

**12 units, 600 minutes total**

**What you'll master:**
- Meet the character (Model, Humanoid, HumanoidRootPart, R15 vs R6)
- What a rig is (Motor6D joints, hierarchy, Part0 and Part1)
- How animation works (keyframes, poses, interpolation, looping, easing)
- The Animation Editor (timeline, tracks, publishing)
- Playing animations from a script (Animation object, Animator, AnimationTrack)
- Priorities, looping, and stopping (Core, Idle, Movement, Action priorities)
- Animation events and markers (`GetMarkerReachedSignal`)
- Making damage land on the hit frame
- Movement animations and the default Animate script
- A dodge roll and movement abilities
- Animations made outside Studio (optional)
- Animation housekeeping and performance

**Game step:** Attack and dodge animations on the player, with the attack's damage landing on the animation's hit frame.

<CheckYourself>
Explain why damage should trigger from an animation marker and not a timer, and name one thing that goes wrong with a timer.
</CheckYourself>

</ModuleCard>

### Module 6: Enemies and AI

<ModuleCard 
  number="M6"
  title="Enemies and AI"
  hours={10}
  objective="Build enemies that sense the player, decide what to do, and act, and spawn them in escalating waves."
>

**12 units, 600 minutes total**

**AI concepts:**
- What game AI really is (sense-decide-act cycle, simple rules)
- Building an enemy body (NPC from rig, template, `Clone`)
- Moving an enemy (`Humanoid:MoveTo`, `MoveToFinished`)
- Finding the nearest player (Vector3, magnitude, distance)
- Seeing with raycasts (`workspace:Raycast`, RaycastParams, line of sight)
- Pathfinding (PathfindingService, agent settings, waypoints, recomputing)
- Enemy state machines (idle, chase, attack, dead)
- Enemy attacks (range check, cooldown, telegraph, marker-based damage)
- Spawners and waves (scaling count and speed, caps)
- Enemy variety with data (config tables, types)
- Performance and cleanup (think rate, `SetNetworkOwner(nil)`)
- Debugging and tuning

**Game step:** Waves of enemies that scale in count and speed across rounds.

<CheckYourself>
Add a new enemy type with one new state and no changes to the spawner.
</CheckYourself>

</ModuleCard>

### Module 7: Bringing in Your Own Art

<ModuleCard 
  number="M7"
  title="Bringing in Your Own Art"
  hours={8}
  objective="Get your own 3D art into the game cleanly. Understand what a 3D model is, make or obtain simple props, import them, and make them work in play."
>

**12 units, 480 minutes total**

**Art pipeline:**
- What a 3D model is (mesh, vertices, triangles, textures, UV mapping)
- Building props inside Studio (Parts, Unions, solid modeling)
- Choosing a 3D tool (Blender as free option)
- Modeling a simple prop (low-poly, origin, scale)
- Exporting and importing (FBX, 3D Importer, MeshPart)
- Pivots, scale, and orientation problems
- Textures and materials (SurfaceAppearance maps, built-in materials)
- Triangle budgets and performance (Roblox's ~20k cap, reducing meshes)
- Collision and physics (CollisionFidelity options, CanCollide, CanQuery)
- Items in the player's hand (Tool object, Handle, grip settings)
- Asset management, moderation, and ownership
- Custom enemy art (MeshParts on rig, keeping animations working)

**Game step:** A custom enemy and a custom weapon, made or sourced by you, working in the game.

<CheckYourself>
Take a heavy mesh and get it under budget without wrecking its silhouette.
</CheckYourself>

</ModuleCard>

### Module 8: Interface Fundamentals

<ModuleCard 
  number="M8"
  title="Interface Fundamentals"
  hours={8}
  objective="Build on-screen interfaces that work on phones, tablets, consoles and PCs, and keep them updated with live game data."
>

**11 units, 480 minutes total**

**UI systems:**
- What UI is in Roblox (ScreenGui, StarterGui, PlayerGui)
- Position and size with UDim2 (scale + offset, AnchorPoint)
- Text and images (TextLabel, TextScaled, rich text, ImageLabel)
- Layouts that arrange themselves (UIListLayout, UIGridLayout, UIPadding)
- Constraints and scaling (UIAspectRatioConstraint, UISizeConstraint, UIScale)
- Styling (UICorner, UIStroke, UIGradient, palettes, contrast)
- Buttons and clicks (Activated event for mouse/touch/gamepad)
- Input from keyboard, touch, and gamepad (UserInputService, ContextActionService)
- Showing live game data (binding to Humanoid.Health, remotes, attributes)
- Animating UI (tweening size/position/transparency)
- Testing on every screen (device emulator, safe areas, IgnoreGuiInset)

**Game step:** A working HUD built by hand — health bar, wave counter, round timer.

<CheckYourself>
Resize the viewport from phone to ultrawide and keep the HUD correct.
</CheckYourself>

</ModuleCard>

### Module 9: ForgeGUI - UI That Doesn't Look Default

<ModuleCard 
  number="M9"
  title="ForgeGUI, UI That Doesn't Look Default"
  hours={8}
  objective="Use ForgeGUI to create a distinctive interface style and wire the art into the HUD, shop and inventory you built by hand."
>

**11 units, 480 minutes total**

**Making it yours:**
- Choosing and verifying your tools (licensing, credits, official site)
- Design basics for game interface (hierarchy, contrast, spacing)
- Prompting for interface pieces (panels, buttons, frames on transparent background)
- Cleaning and preparing images (transparent PNG, trimming, naming)
- Uploading and using images (Asset Manager, moderation)
- Nine-slice scaling (ScaleType.Slice, SliceCenter for crisp corners)
- Buttons with states (normal, hover, pressed looks)
- Icons and item slots (icon sets, rarity colors)
- Building shop and inventory screens
- Restyling the HUD with your art
- Thumbnails and store art

**Game step:** Restyle the HUD and build shop and inventory screens.

<CheckYourself>
Rebuild one screen with a different art style without touching the scripts.
</CheckYourself>

</ModuleCard>

---

## Phase 3: Systems

<PhaseCard 
  phase="Phase 3: Systems"
  modules="10-12"
  description="Save player data, run an economy, and polish game feel with effects, sound, and camera."
  hours={24}
/>

### Module 10: Saving Data

<ModuleCard 
  number="M10"
  title="Saving Data"
  hours={8}
  objective="Save and load player progress reliably, so nothing is lost and nothing is duplicated."
>

**11 units, 480 minutes total**

**Persistence:**
- Why saving is hard (server memory, failures, shutdowns)
- DataStore basics (`GetAsync`, `SetAsync`, keys, values, turning on API services)
- Errors and retries (`pcall`, backoff, rate limits, golden rule)
- Safe updates with `UpdateAsync` (transform function, read-modify-write)
- Session locking and why it exists (two servers, one player)
- Using a session-locking library (ProfileStore example)
- Designing the save format (schema, defaults, version number)
- Loading and applying data (waiting for data before gameplay)
- Saving at the right times (autosave, PlayerRemoving, BindToClose)
- Testing data safely (separate test store)
- Privacy and what not to store

**Game step:** Coins, upgrades, and stats persist between sessions.

<CheckYourself>
Add a new field to the save format without breaking existing players.
</CheckYourself>

</ModuleCard>

### Module 11: Inventory, Upgrades and Economy

<ModuleCard 
  number="M11"
  title="Inventory, Upgrades and Economy"
  hours={10}
  objective="Build a data-driven shop, inventory and upgrade system whose economy is fair, balanced and cheat-resistant."
>

**12 units, 600 minutes total**

**Economy design:**
- Data-driven design (item definitions vs ownership)
- Player state on the server (single source of truth, API functions)
- Inventory (storing IDs and counts, equipment slots)
- Equipping items (request, validation, applying stats)
- Currency and rewards (sources and sinks, balance)
- The purchase flow (client asks → server checks → deducts → grants → tells client)
- Upgrades and progression curves (levels, linear vs exponential scaling)
- Random drops and loot tables (weights, rarity tiers)
- Balancing (tuning numbers, comparing earn rates)
- Connecting the interface (binding to real data, refreshing)
- Saving the economy (adding to Module 10 format)
- Exploit-proofing (duplication, race conditions, audit logs)

**Game step:** A working shop — players spend coins between rounds on weapons and upgrades.

<CheckYourself>
Add a new weapon by editing only a data file.
</CheckYourself>

</ModuleCard>

### Module 12: Game Feel

<ModuleCard 
  number="M12"
  title="Game Feel"
  hours={6}
  objective="Make hits, pickups and round changes feel satisfying with effects, sound, camera and light."
>

**10 units, 360 minutes total**

**Polish:**
- What game feel is (feedback, "juice", subtle beats loud)
- Particles (ParticleEmitter, burst with `Emit`, hit sparks, dust)
- Beams, trails, and light (Trail, Beam, PointLight, SurfaceLight)
- Sound (Sound objects, SoundGroups, layering, pitch variation, licensing)
- Lighting and post-processing (ColorCorrection, Bloom, Blur, Atmosphere)
- Camera effects (shake, field of view changes, client-only)
- Hit-stop and impact (pause/slowdown, Highlight flash, knockback)
- Interface juice (BillboardGui floating damage numbers, tween counters)
- Transitions (round banners, fades)
- The polish pass and restraint (removing noise, consistency)

**Game step:** A polish pass on combat, pickups, and round transitions.

<CheckYourself>
Record a hit before and after, and name every change that improved it.
</CheckYourself>

</ModuleCard>

---

## Phase 4: Ship It

<PhaseCard 
  phase="Phase 4: Ship It"
  modules="13-14"
  description="Find and fix what makes the game slow, defend against cheating, and publish to real players."
  hours={14}
/>

### Module 13: Performance, Multiplayer and Security

<ModuleCard 
  number="M13"
  title="Performance, Multiplayer and Security"
  hours={8}
  objective="Find and fix what makes the game slow, understand how multiplayer behaves under latency, and defend against common cheating."
>

**11 units, 480 minutes total**

**Hardening:**
- Why performance matters (device range, phones, frame rate)
- Measuring with the right tools (Developer Console, MicroProfiler)
- Scripts that waste time (per-frame work, polling, throttling)
- Parts, meshes and rendering (CanCollide/CanQuery/CanTouch, shadows, transparency)
- StreamingEnabled (streaming radius, WaitForChild, persistent models)
- Memory and leaks (forgotten connections, undestroyed objects)
- Network and latency (ping, reducing bandwidth, prediction)
- Mobile and low-end devices (quality settings, emulator, touch controls)
- Common exploits and defenses (sanity checks, server-owned state, logging)
- Anti-abuse design (rate limits, bans, moderation)
- Multi-client testing and stress tests

**Game step:** Stress-test a full server and fix what breaks.

<CheckYourself>
Find and fix one performance problem and one exploit in your own game.
</CheckYourself>

</ModuleCard>

### Module 14: Monetization, Analytics and Publishing

<ModuleCard 
  number="M14"
  title="Monetization, Analytics and Publishing"
  hours={6}
  objective="Add fair monetization, read what players actually do, and publish the game to real players safely."
>

**10 units, 360 minutes total**

**Going live:**
- How creators earn on Roblox (purchases, subscriptions, engagement payouts)
- Game passes (one-time purchase, ownership check, granting benefits)
- Developer products (`ProcessReceipt` callback, granting items, idempotency)
- Pricing and ethics (fair pricing, avoiding pressure tactics, paid random rewards)
- Analytics (visits, retention, session length, revenue, custom events, funnels)
- Watching real players (playtesting, observation, friction points)
- Rules and safety (community standards, age guidelines, text filtering)
- The store page (title, icon, thumbnails, description)
- Release stages and rollback (private → friends → public, version restore)
- Publishing v0.9 (checklist, soft launch, feedback collection)

**Game step:** Add a game pass and a developer product, and publish v0.9 to friends.

<CheckYourself>
Explain why a product purchase must be granted on the server and retried safely.
</CheckYourself>

</ModuleCard>

---

## Capstone: Ship Version 1.0

**Done when:** A stranger can find, play and finish a round without your help, and progress saves across sessions.

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

This course was designed around the principle that builders learn by building first, naming later. Every module opens with working code before any new term appears. No framework is introduced until you've written its job yourself.

The game you build — a co-op wave-survival arena — was chosen because it forces nearly every Roblox system to appear naturally: rounds, combat, rigs, AI, UI, data saving, shops, and monetization.

**Time commitment:** About 134 hours, roughly 22 weeks at 6 hours per week.

No prior 3D, game development, or Roblox experience required. If you can open a text editor and follow instructions, you can complete this course.
