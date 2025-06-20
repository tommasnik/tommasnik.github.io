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