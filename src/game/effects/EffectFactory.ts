import { Scene } from 'phaser';
import { FireballEffect } from './FireballEffect';
import { LightningEffect } from './LightningEffect';
import { IceSpikeEffect } from './IceSpikeEffect';
import { MeteorEffect } from './MeteorEffect';
import { ShieldEffect } from './ShieldEffect';
import { HealEffect } from './HealEffect';
import { ProjectileEffect } from './ProjectileEffect';

export class EffectFactory {
    private scene: Scene;
    private effects: Map<string, ProjectileEffect | ShieldEffect | HealEffect>;

    constructor(scene: Scene) {
        this.scene = scene;
        this.effects = new Map();
        this.initializeEffects();
    }

    private initializeEffects(): void {
        this.effects.set('fireball', new FireballEffect(this.scene));
        this.effects.set('lightning', new LightningEffect(this.scene));
        this.effects.set('ice_spike', new IceSpikeEffect(this.scene));
        this.effects.set('meteor', new MeteorEffect(this.scene));
        this.effects.set('shield', new ShieldEffect(this.scene));
        this.effects.set('heal', new HealEffect(this.scene));
    }

    createEffect(effectType: string, startX: number, startY: number, targetX: number, targetY: number): void {
        const effect = this.effects.get(effectType);
        if (!effect) {
            console.warn(`Effect type '${effectType}' not found`);
            return;
        }

        if (effect instanceof ProjectileEffect) {
            effect.create(startX, startY, targetX, targetY);
        } else if (effect instanceof ShieldEffect || effect instanceof HealEffect) {
            effect.create(startX, startY);
        }
    }

    registerEffect(effectType: string, effect: ProjectileEffect | ShieldEffect | HealEffect): void {
        this.effects.set(effectType, effect);
    }
} 