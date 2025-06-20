# Game Constants - Designer Configuration

This file contains all the game design constants that can be easily tweaked by the game designer without diving into the code logic.

## Quick Start

To modify game balance, simply edit the values in `GameConstants.ts` and restart the game. No code changes required!

**Note**: The game automatically resets all cooldowns, cast times, and health when restarting scenes, so changes take effect immediately.

## Skill System

### Cast Time Configuration
- `CAST_TIME_MULTIPLIER`: Cast time as fraction of cooldown (default: 0.1 = 1/10 of cooldown)
- `MIN_CAST_TIME`: Minimum cast time in milliseconds (default: 200ms)
- `MAX_CAST_TIME`: Maximum cast time in milliseconds (default: 2000ms)

### Individual Skill Tuning
Each skill can be configured with:
- `name`: Display name
- `damage`: Damage dealt (0 for defensive skills)
- `cooldown`: Cooldown time in milliseconds
- `keyBinding`: Keyboard key to activate
- `animationType`: Visual effect type
- `skillType`: 'offensive' or 'defensive'
- `targetType`: 'single' or 'aoe'
- `description`: Tooltip text

### Example Skill Modifications
```typescript
FIREBALL: {
    name: 'Fireball',
    damage: 25,        // Increase damage
    cooldown: 1500,    // Reduce cooldown
    keyBinding: 'a',
    // ... other properties
}
```

## Fighter System

### Player Configuration
- `maxHealth`: Starting health points
- `x`, `y`: Starting position

### Opponent Configuration
- `maxHealth`: Starting health points  
- `x`, `y`: Starting position

## UI System

### Skill Button Appearance
- `radius`: Button size
- `scaleOnPress`: Scale factor when pressed
- `pressAnimationDuration`: Animation speed
- `flashAnimationDuration`: Flash effect duration
- `progressRingThickness`: Cast progress ring thickness
- `progressRingColor`: Cast progress ring color
- `progressRingOffset`: Distance from button edge

### Health Bar Configuration
- `width`: Health bar width
- `height`: Health bar height
- `playerColor`: Player health bar color
- `opponentColor`: Opponent health bar color

### Skill Button Layout
- `circleRadius`: Distance from screen edge
- `screenPadding`: Margin from screen borders
- `skillSpacing`: Angle between buttons
- `leftStartAngle`: Starting angle for left side
- `rightStartAngle`: Starting angle for right side

## Animation System

- `frameRate`: Animation playback speed
- `animationRepeat`: Number of times to repeat (0 = once)

## Effect System

- `projectileSpeed`: How fast projectiles travel
- `effectDuration`: How long effects last

## Game States

- `FIGHTING`: Active combat state
- `GAME_OVER`: Combat ended state
- `MENU`: Menu state

## Tips for Balancing

1. **Start with cooldowns**: Adjust skill cooldowns to control skill usage frequency
2. **Balance damage**: Ensure total damage output is reasonable for the game duration
3. **Cast times**: Use cast times to add strategic depth - longer casts for more powerful skills
4. **Health values**: Adjust fighter health to control combat duration
5. **Test incrementally**: Make small changes and test frequently

## Adding New Skills

1. Add skill definition to `SKILLS` section
2. Follow the existing pattern for consistency
3. Test the skill in-game
4. Adjust values as needed

## Performance Notes

- Keep cooldowns reasonable (1000ms+ recommended)
- Avoid extremely short cast times (< 100ms)
- Test on target devices for performance 