import { Scene } from 'phaser';
import { SkillButton } from '../graphics/SkillButton';
import { FightingGame } from '../logic/FightingGame';

export class SkillButtonManager {
    private scene: Scene;
    private gameLogic: FightingGame;
    private skillButtons: SkillButton[];

    constructor(scene: Scene, gameLogic: FightingGame) {
        this.scene = scene;
        this.gameLogic = gameLogic;
        this.skillButtons = [];
    }

    createSkillButtons(): void {
        const skills = this.gameLogic.getSkills();
        const circleRadius = 120;
        const screenPadding = 20;
        const screenWidth = 400;
        const screenHeight = 800;
        
        this.createLeftSideButtons(skills.slice(0, 3), circleRadius, screenPadding, screenHeight);
        this.createRightSideButtons(skills.slice(3, 6), circleRadius, screenPadding, screenWidth, screenHeight);
    }

    private createLeftSideButtons(skills: any[], circleRadius: number, screenPadding: number, screenHeight: number): void {
        const leftCircleCenterX = screenPadding;
        const leftCircleCenterY = screenHeight - screenPadding;
        const skillSpacing = Math.PI / 6;
        const startAngleLeft = -Math.PI / 4;

        for (let i = 0; i < skills.length; i++) {
            const angle = startAngleLeft + skillSpacing * (i - 1);
            const x = leftCircleCenterX + Math.cos(angle) * circleRadius;
            const y = leftCircleCenterY + Math.sin(angle) * circleRadius;
            this.skillButtons.push(new SkillButton(this.scene, x, y, skills[i], this.onSkillButtonClick.bind(this)));
        }
    }

    private createRightSideButtons(skills: any[], circleRadius: number, screenPadding: number, screenWidth: number, screenHeight: number): void {
        const rightCircleCenterX = screenWidth - screenPadding;
        const rightCircleCenterY = screenHeight - screenPadding;
        const skillSpacing = Math.PI / 6;
        const startAngleRight = - Math.PI / 2 - Math.PI / 4;

        for (let i = 0; i < skills.length; i++) {
            const angle = startAngleRight + skillSpacing * (i - 1);
            const x = rightCircleCenterX + Math.cos(angle) * circleRadius;
            const y = rightCircleCenterY + Math.sin(angle) * circleRadius;
            this.skillButtons.push(new SkillButton(this.scene, x, y, skills[i], this.onSkillButtonClick.bind(this)));
        }
    }

    private onSkillButtonClick(skill: any): void {
        const skillIndex = this.gameLogic.getSkills().indexOf(skill);
        if (skillIndex !== -1) {
            this.gameLogic.useSkill(skillIndex);
        }
    }

    update(): void {
        this.skillButtons = this.skillButtons.filter(button => {
            if (button && button.text && button.text.active) {
                button.update();
                return true;
            }
            return false;
        });
    }

    destroy(): void {
        this.skillButtons.forEach(button => button.destroy());
        this.skillButtons = [];
    }
}