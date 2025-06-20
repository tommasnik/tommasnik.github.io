import { Scene } from 'phaser';
import { FightingGame } from '../logic/FightingGame';
import { Skill } from '../logic/Skill';

export class InputManager {
    private scene: Scene;
    private gameLogic: FightingGame;
    private pressedKeys: Set<string> = new Set();
    private keyPressStartTimes: Map<string, number> = new Map();
    private skillKeyBindings: Map<string, Skill> = new Map();

    constructor(scene: Scene, gameLogic: FightingGame) {
        this.scene = scene;
        this.gameLogic = gameLogic;
        this.initializeSkillKeyBindings();
    }

    private initializeSkillKeyBindings(): void {
        const skills = this.gameLogic.getSkills();
        skills.forEach(skill => {
            this.skillKeyBindings.set(skill.keyBinding.toLowerCase(), skill);
        });
    }

    setupInput(): void {
        this.setupKeyboardInput();
    }

    private setupKeyboardInput(): void {
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
            
            const skill = this.skillKeyBindings.get(key);
            if (skill && skill.canStartCasting()) {
                const skillIndex = this.gameLogic.getSkills().indexOf(skill);
                this.gameLogic.startCastingSkill(skillIndex);
            }
        }
    }

    private handleKeyUp(key: string): void {
        if (this.pressedKeys.has(key)) {
            const skill = this.skillKeyBindings.get(key);
            if (skill && this.gameLogic.isCasting(skill)) {
                const pressStartTime = this.keyPressStartTimes.get(key);
                if (pressStartTime) {
                    const holdTime = Date.now() - pressStartTime;
                    const skillIndex = this.gameLogic.getSkills().indexOf(skill);
                    if (holdTime >= skill.castTime) {
                        this.gameLogic.useSkill(skillIndex);
                    } else {
                        this.gameLogic.cancelSkillCast(skillIndex);
                    }
                }
            }
            this.pressedKeys.delete(key);
            this.keyPressStartTimes.delete(key);
        }
    }

    handleMouseSkillStart(skill: Skill): void {
        if (skill.canStartCasting()) {
            const skillIndex = this.gameLogic.getSkills().indexOf(skill);
            this.gameLogic.startCastingSkill(skillIndex);
        }
    }

    handleMouseSkillComplete(skill: Skill): void {
        if (this.gameLogic.isCasting(skill)) {
            const skillIndex = this.gameLogic.getSkills().indexOf(skill);
            this.gameLogic.useSkill(skillIndex);
        }
    }

    handleMouseSkillCancel(): void {
        this.gameLogic.cancelCurrentCast();
    }

    destroy(): void {
        this.scene.input.keyboard?.off('keydown');
        this.scene.input.keyboard?.off('keyup');
        this.pressedKeys.clear();
        this.keyPressStartTimes.clear();
        this.skillKeyBindings.clear();
    }
} 