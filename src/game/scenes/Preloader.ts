import { Scene } from 'phaser';
import { AnimationManager } from '../animations/AnimationManager';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init (): void
    {
        this.add.image(200, 400, 'background').setAlpha(0.5).setScale(0.55);

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload (): void
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');

        const skillIcons = ['fireball', 'lightning', 'ice_spike', 'meteor', 'shield', 'heal'];
        skillIcons.forEach(icon => {
            this.load.image(icon, `icons/${icon}.png`);
        });

        const orcAnimations = [
            'backslash', 'climb', 'combat_idle', 'emote', 'halfslash', 'hurt', 'idle', 'jump', 'run', 'shoot', 'sit', 'slash', 'spellcast', 'thrust', 'walk'
        ];
        const zombieAnimations = [
            'backslash', 'climb', 'combat_idle', 'emote', 'halfslash', 'hurt', 'idle', 'jump', 'run', 'shoot', 'sit', 'slash', 'spellcast', 'thrust', 'walk'
        ];
        const wizardAnimations = [
            'backslash', 'climb', 'combat_idle', 'emote', 'halfslash', 'hurt', 'idle', 'jump', 'run', 'shoot', 'sit', 'slash', 'spellcast', 'thrust', 'walk'
        ];
        orcAnimations.forEach(anim => {
            this.load.spritesheet(
                `orc_${anim}`,
                `sprites/orc/standard/${anim}.png`,
                { frameWidth: 64, frameHeight: 64 }
            );
        });
        zombieAnimations.forEach(anim => {
            this.load.spritesheet(
                `zombie_${anim}`,
                `sprites/zombie/standard/${anim}.png`,
                { frameWidth: 64, frameHeight: 64 }
            );
        });
        wizardAnimations.forEach(anim => {
            this.load.spritesheet(
                `wizard_${anim}`,
                `sprites/wizard/standard/${anim}.png`,
                { frameWidth: 64, frameHeight: 64 }
            );
        });
    }

    create (): void
    {
        const animationManager = new AnimationManager(this);
        animationManager.createFighterAnimations();

        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
