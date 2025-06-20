import { Scene } from 'phaser';
import { FightingGame } from '../logic/FightingGame';

export class KeyboardInputManager {
    private scene: Scene;
    private gameLogic: FightingGame;
    private pressedKeys: Set<string> = new Set();
    private keyPressStartTimes: Map<string, number> = new Map();
    private minHoldTime: number = 100;

    constructor(scene: Scene, gameLogic: FightingGame) {
        this.scene = scene;
        this.gameLogic = gameLogic;
    }

    setupKeyboardInput(): void {
        this.scene.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            this.handleKeyDown(key);
        });

        this.scene.input.keyboard?.on('keyup', (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            this.handleKeyUp(key);
        });
    }

    private handleKeyDown(key: string): void {
        if (!this.pressedKeys.has(key)) {
            this.pressedKeys.add(key);
            this.keyPressStartTimes.set(key, Date.now());
        }
    }

    private handleKeyUp(key: string): void {
        if (this.pressedKeys.has(key)) {
            const pressStartTime = this.keyPressStartTimes.get(key);
            if (pressStartTime) {
                const holdTime = Date.now() - pressStartTime;
                if (holdTime >= this.minHoldTime) {
                    this.gameLogic.useSkillByKey(key);
                }
            }
            this.pressedKeys.delete(key);
            this.keyPressStartTimes.delete(key);
        }
    }

    destroy(): void {
        this.scene.input.keyboard?.off('keydown');
        this.scene.input.keyboard?.off('keyup');
        this.pressedKeys.clear();
        this.keyPressStartTimes.clear();
    }
} 