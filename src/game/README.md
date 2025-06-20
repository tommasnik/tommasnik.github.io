# Game Architecture

This directory contains a modular, SOLID-compliant architecture for the fighting game.

## Architecture Overview

### Core Principles
- **Single Responsibility**: Each class has one clear purpose
- **Open/Closed**: Open for extension, closed for modification
- **Dependency Inversion**: High-level modules don't depend on low-level modules
- **Separation of Concerns**: Logic, graphics, and effects are separated

## Directory Structure

```
src/game/
├── animations/          # Animation management
├── effects/            # Skill effects and projectiles
├── graphics/           # Visual components
├── input/              # Input handling
├── logic/              # Game logic and state
├── scenes/             # Phaser scenes
├── systems/            # Complex systems that coordinate multiple components
├── ui/                 # User interface components
└── index.ts           # Central exports
```

## Adding New Skills

To add a new skill, follow these steps:

### 1. Add Skill Logic
In `src/game/logic/FightingGame.ts`, add the skill to the `createSkills()` method:

```typescript
new Skill('NewSkill', damage, cooldown, keyBinding, animationType, skillType, targetType, description)
```

### 2. Add Animation
In `src/game/animations/AnimationManager.ts`, add the animation:

```typescript
this.scene.anims.create({
    key: 'wizard_newskill',
    frames: this.scene.anims.generateFrameNumbers('wizard_spellcast', { start: 0, end: 6 }),
    frameRate: 8,
    repeat: 0
});
```

### 3. Create Effect
Create a new effect class in `src/game/effects/`:

```typescript
import { ProjectileEffect } from './ProjectileEffect';

export class NewSkillEffect extends ProjectileEffect {
    create(startX: number, startY: number, targetX: number, targetY: number): void {
        // Implement your effect here
    }
}
```

### 4. Register Effect
In `src/game/effects/EffectFactory.ts`, register your effect:

```typescript
this.effects.set('newskill', new NewSkillEffect(this.scene));
```

## Component Responsibilities

### Graphics Components
- **Fighter**: Manages fighter sprites and animations
- **HealthBar**: Displays and updates health bars
- **CastingRing**: Displays casting progress ring around the player during skill casting

### Effect System
- **ProjectileEffect**: Base class for projectile-based skills
- **EffectFactory**: Manages and creates all skill effects
- Individual effect classes for each skill type

### UI Components
- **BackButton**: Handles navigation back to main menu
- **SkillButtonManager**: Manages circular skill button layout
- **GameOverDisplay**: Shows win/lose messages

### Systems
- **AnimationManager**: Centralizes all animation creation
- **SkillAnimationSystem**: Coordinates skill animations and effects
- **KeyboardInputManager**: Handles keyboard input for skills

## Benefits of This Architecture

1. **Easy to Extend**: Adding new skills requires minimal changes to existing code
2. **Testable**: Each component can be tested in isolation
3. **Maintainable**: Clear separation of concerns makes debugging easier
4. **Reusable**: Components can be reused across different scenes
5. **Scalable**: New features can be added without affecting existing functionality

## Usage Example

```typescript
import { 
    FightingGame, 
    EffectFactory, 
    Fighter, 
    HealthBar,
    SkillAnimationSystem 
} from './game';

// Components are created and managed by the scene
const gameLogic = new FightingGame();
const effectFactory = new EffectFactory(scene);
const playerFighter = new Fighter(scene, x, y, texture, frame, name, idleAnim);
const skillSystem = new SkillAnimationSystem(scene, gameLogic, effectFactory, playerFighter, opponentFighter);
```

# Game Engine

This directory contains the core game engine components for the fighting game.

## Skill System

### Press-and-Hold Mechanics

Skills now use a press-and-hold system for both mouse/touch and keyboard controls:

- **Mouse/Touch**: Press and hold the skill button for at least 100ms, then release to activate the skill
- **Keyboard**: Press and hold the skill key for at least 100ms, then release to activate the skill

### Visual Feedback

When holding a skill button:
- The button scales down slightly (0.9x)
- The button color changes to a lighter gray
- A green progress ring appears around the button, filling up during the hold time
- The ring completes when the minimum hold time (100ms) is reached

### Skill Controls

- **A**: Fireball (15 damage, 2s cooldown)
- **S**: Lightning (20 damage, 3.5s cooldown)  
- **D**: Ice Spike (12 damage, 1.5s cooldown)
- **F**: Meteor (35 damage, 8s cooldown)
- **Q**: Shield (0 damage, 4s cooldown)
- **W**: Heal (0 damage, 6s cooldown)

## Architecture

- **FightingGame**: Core game logic and state management
- **Fighter**: Player and opponent entities with health and damage handling
- **Skill**: Individual skill definitions with cooldowns and effects
- **SkillButton**: UI component with press-and-hold mechanics
- **SkillButtonManager**: Manages all skill buttons and their layout
- **KeyboardInputManager**: Handles keyboard input with press-and-hold support
- **AnimationManager**: Manages skill animations and effects
- **Scenes**: Game state management (Menu, Fight, Game Over, etc.)

## Casting Ring System

The CastingRing component provides visual feedback during skill casting:

### Features
- **Progress Ring**: Shows casting progress as a circular arc around the player
- **Skill-Specific Colors**: Each skill type has its own color theme:
  - Fireball: Orange (0xff6600)
  - Lightning: Cyan (0x00ffff)
  - Ice Spike: Light Blue (0x00ccff)
  - Meteor: Red-Orange (0xff3300)
  - Shield: Blue (0x0066ff)
  - Heal: Green (0x00ff66)
- **Glow Effect**: Adds a subtle glow around the progress ring
- **Dynamic Alpha**: Ring becomes more opaque as casting progresses
- **Automatic Positioning**: Follows the player's position

### Configuration
The casting ring can be configured in `GameConstants.UI.CASTING_RING`:
- `radius`: Size of the casting ring (default: 50)
- `thickness`: Line thickness (default: 4)
- `glowOffset`: Distance of glow effect from main ring (default: 8)
- `glowAlphaMultiplier`: Opacity of glow effect (default: 0.3)
- `baseAlpha`: Base opacity of the ring (default: 0.8)
- `progressAlphaMultiplier`: Additional opacity as casting progresses (default: 0.2)

### Integration
The CastingRing is automatically managed by the FightScene:
- Starts when a skill begins casting
- Updates progress during casting
- Stops when casting is complete or cancelled
- Positioned around the player character 