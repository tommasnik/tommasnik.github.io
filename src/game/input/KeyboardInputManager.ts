import { Scene } from 'phaser';
import { FightingGame } from '../logic/FightingGame';

export class KeyboardInputManager {
    private scene: Scene;
    private gameLogic: FightingGame;

    constructor(scene: Scene, gameLogic: FightingGame) {
        this.scene = scene;
        this.gameLogic = gameLogic;
    }

    setupKeyboardInput(): void {
        this.scene.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            this.gameLogic.useSkillByKey(key);
        });
    }

    destroy(): void {
        this.scene.input.keyboard?.off('keydown');
    }
} 