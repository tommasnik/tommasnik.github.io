import { Scene } from 'phaser';

export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload(): void {
        this.load.image('background', 'assets/bg.png');
    }

    create(): void {
        this.scene.start('Preloader');
    }
} 