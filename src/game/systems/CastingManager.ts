import { Skill } from '../logic/Skill';

export interface CastingSpell {
    skill: Skill;
    startTime: number;
    castTime: number;
    progress: number;
}

export class CastingManager {
    private castingSpells: Map<Skill, CastingSpell> = new Map();

    startCasting(skill: Skill, currentTime: number): boolean {
        if (!skill.canStartCasting() || skill.isCasting || this.castingSpells.has(skill)) {
            return false;
        }

        if (skill.startCasting()) {
            const castingSpell: CastingSpell = {
                skill,
                startTime: currentTime,
                castTime: skill.castTime,
                progress: 0
            };
            this.castingSpells.set(skill, castingSpell);
            return true;
        }
        return false;
    }

    updateCasting(deltaTime: number, currentTime: number): Skill[] {
        const completedSpells: Skill[] = [];

        for (const [skill, castingSpell] of this.castingSpells) {
            const elapsedTime = currentTime - castingSpell.startTime;
            castingSpell.progress = Math.min(elapsedTime / castingSpell.castTime, 1);
        }

        return completedSpells;
    }

    cancelCasting(skill: Skill): void {
        if (this.castingSpells.has(skill)) {
            skill.cancelCast();
            this.castingSpells.delete(skill);
        }
    }

    cancelAllCasting(): void {
        for (const [skill] of this.castingSpells) {
            skill.cancelCast();
        }
        this.castingSpells.clear();
    }

    cleanupCompletedSpells(completedSpells: Skill[]): void {
        for (const skill of completedSpells) {
            if (this.castingSpells.has(skill)) {
                this.castingSpells.delete(skill);
            }
        }
    }

    getCastingSpells(): CastingSpell[] {
        return Array.from(this.castingSpells.values());
    }

    isCasting(skill: Skill): boolean {
        return this.castingSpells.has(skill);
    }

    getCastingProgress(skill: Skill): number {
        const castingSpell = this.castingSpells.get(skill);
        return castingSpell ? castingSpell.progress : 0;
    }

    hasActiveCasts(): boolean {
        return this.castingSpells.size > 0;
    }

    getActiveCastCount(): number {
        return this.castingSpells.size;
    }

    reset(): void {
        this.cancelAllCasting();
    }

    completeCastingOnRelease(skill: Skill): boolean {
        const castingSpell = this.castingSpells.get(skill);
        if (!castingSpell) {
            return false;
        }

        if (castingSpell.progress >= 1) {
            const success = skill.completeCastOnRelease();
            if (success) {
                this.castingSpells.delete(skill);
            }
            return success;
        } else {
            this.cancelCasting(skill);
            return false;
        }
    }
} 