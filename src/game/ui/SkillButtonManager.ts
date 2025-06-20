import { Scene } from 'phaser';
import { SkillButton } from '../graphics/SkillButton';
import { FightingGame } from '../logic/FightingGame';
import { GameConstants } from '../constants/GameConstants';
import { InputManager } from '../input/KeyboardInputManager';

export class SkillButtonManager {
    private scene: Scene;
    private gameLogic: FightingGame;
    private skillButtons: SkillButton[];
    private inputManager: InputManager;

    constructor(scene: Scene, gameLogic: FightingGame, inputManager: InputManager) {
        this.scene = scene;
        this.gameLogic = gameLogic;
        this.inputManager = inputManager;
        this.skillButtons = [];
    }

    createSkillButtons(): void {
        const skills = this.gameLogic.getSkills();
        const layout = GameConstants.UI.SKILL_BUTTON_LAYOUT;
        const screenWidth = 400;
        const screenHeight = 800;
        
        this.createLeftSideButtons(skills.slice(0, 3), layout, screenHeight);
        this.createRightSideButtons(skills.slice(3, 6), layout, screenWidth, screenHeight);
    }

    private createLeftSideButtons(skills: any[], layout: any, screenHeight: number): void {
        const leftCircleCenterX = layout.screenPadding;
        const leftCircleCenterY = screenHeight - layout.screenPadding;

        for (let i = 0; i < skills.length; i++) {
            const angle = layout.leftStartAngle + layout.skillSpacing * (i - 1);
            const x = leftCircleCenterX + Math.cos(angle) * layout.circleRadius;
            const y = leftCircleCenterY + Math.sin(angle) * layout.circleRadius;
            this.skillButtons.push(new SkillButton(this.scene, x, y, skills[i], this.inputManager, this.gameLogic));
        }
    }

    private createRightSideButtons(skills: any[], layout: any, screenWidth: number, screenHeight: number): void {
        const rightCircleCenterX = screenWidth - layout.screenPadding;
        const rightCircleCenterY = screenHeight - layout.screenPadding;

        for (let i = 0; i < skills.length; i++) {
            const angle = layout.rightStartAngle + layout.skillSpacing * (i - 1);
            const x = rightCircleCenterX + Math.cos(angle) * layout.circleRadius;
            const y = rightCircleCenterY + Math.sin(angle) * layout.circleRadius;
            this.skillButtons.push(new SkillButton(this.scene, x, y, skills[i], this.inputManager, this.gameLogic));
        }
    }

    update(): void {
        this.skillButtons.forEach(button => button.update());
    }

    destroy(): void {
        this.skillButtons.forEach(button => button.destroy());
        this.skillButtons = [];
    }
}