export const GameConstants = {
    // Skill System
    SKILLS: {
        CAST_TIME_MULTIPLIER: 0.1, // Cast time as fraction of cooldown (default: 1/10)
        MIN_CAST_TIME: 200, // Minimum cast time in milliseconds
        MAX_CAST_TIME: 2000, // Maximum cast time in milliseconds
        
        // Skill Definitions
        FIREBALL: {
            name: 'Fireball',
            damage: 15,
            cooldown: 2000,
            keyBinding: 'a',
            animationType: 'fireball' as const,
            skillType: 'offensive' as const,
            targetType: 'single' as const,
            description: 'Launches a fiery projectile at the enemy'
        },
        
        LIGHTNING: {
            name: 'Lightning',
            damage: 20,
            cooldown: 3500,
            keyBinding: 's',
            animationType: 'lightning' as const,
            skillType: 'offensive' as const,
            targetType: 'single' as const,
            description: 'Strikes the enemy with lightning from your staff'
        },
        
        ICE_SPIKE: {
            name: 'Ice Spike',
            damage: 12,
            cooldown: 1500,
            keyBinding: 'd',
            animationType: 'ice_spike' as const,
            skillType: 'offensive' as const,
            targetType: 'single' as const,
            description: 'Conjures a sharp ice spike to pierce the enemy'
        },
        
        METEOR: {
            name: 'Meteor',
            damage: 35,
            cooldown: 8000,
            keyBinding: 'f',
            animationType: 'meteor' as const,
            skillType: 'offensive' as const,
            targetType: 'aoe' as const,
            description: 'Summons a devastating meteor from the sky'
        },
        
        SHIELD: {
            name: 'Shield',
            damage: 0,
            cooldown: 4000,
            keyBinding: 'q',
            animationType: 'shield' as const,
            skillType: 'defensive' as const,
            targetType: 'single' as const,
            description: 'Creates a magical barrier to protect yourself'
        },
        
        HEAL: {
            name: 'Heal',
            damage: 0,
            cooldown: 6000,
            keyBinding: 'w',
            animationType: 'heal' as const,
            skillType: 'defensive' as const,
            targetType: 'single' as const,
            description: 'Restores your health with healing magic'
        }
    },

    // Fighter System
    FIGHTERS: {
        PLAYER: {
            name: 'Player',
            maxHealth: 100,
            x: 200,
            y: 600
        },
        
        OPPONENT: {
            name: 'Opponent',
            maxHealth: 100,
            x: 200,
            y: 200
        }
    },

    // UI Constants
    UI: {
        SKILL_BUTTON: {
            radius: 30,
            scaleOnPress: 0.9,
            pressAnimationDuration: 100,
            flashAnimationDuration: 300,
            progressRingThickness: 3,
            progressRingColor: 0x00ff00,
            progressRingOffset: 2
        },
        
        HEALTH_BAR: {
            width: 200,
            height: 20,
            playerColor: 0x00ff00,
            opponentColor: 0xff0000
        },
        
        SKILL_BUTTON_LAYOUT: {
            circleRadius: 120,
            screenPadding: 20,
            skillSpacing: Math.PI / 6,
            leftStartAngle: -Math.PI / 4,
            rightStartAngle: -Math.PI / 2 - Math.PI / 4
        }
    },

    // Animation Constants
    ANIMATIONS: {
        frameRate: 8,
        animationRepeat: 0
    },

    // Effect Constants
    EFFECTS: {
        projectileSpeed: 300,
        effectDuration: 1000
    },

    // Game State
    GAME_STATES: {
        FIGHTING: 'fighting',
        GAME_OVER: 'gameOver',
        MENU: 'menu'
    } as const
} as const;

export type GameState = typeof GameConstants.GAME_STATES[keyof typeof GameConstants.GAME_STATES]; 