import { Skill } from '../src/game/logic/Skill';

describe('Skill', () => {
    let skill;

    beforeEach(() => {
        skill = new Skill('TestSkill', 25, 1000, 'a');
    });

    test('should create skill with correct initial values', () => {
        expect(skill.name).toBe('TestSkill');
        expect(skill.damage).toBe(25);
        expect(skill.cooldown).toBe(1000);
        expect(skill.currentCooldown).toBe(0);
        expect(skill.keyBinding).toBe('a');
    });

    test('should be able to use skill when cooldown is zero', () => {
        expect(skill.canUse()).toBe(true);
        const result = skill.use();
        expect(result).toBe(true);
    });

    test('should not be able to use skill when on cooldown', () => {
        skill.use();
        expect(skill.canUse()).toBe(false);
        const result = skill.use();
        expect(result).toBe(false);
    });

    test('should set cooldown when skill is used', () => {
        skill.use();
        expect(skill.currentCooldown).toBe(1000);
    });

    test('should update cooldown over time', () => {
        skill.use();
        skill.update(500);
        expect(skill.currentCooldown).toBe(500);
    });

    test('should not go below zero cooldown', () => {
        skill.use();
        skill.update(1500);
        expect(skill.currentCooldown).toBe(0);
    });

    test('should calculate cooldown percentage correctly', () => {
        expect(skill.getCooldownPercentage()).toBe(0);
        
        skill.use();
        expect(skill.getCooldownPercentage()).toBe(1.0);
        
        skill.update(500);
        expect(skill.getCooldownPercentage()).toBe(0.5);
        
        skill.update(500);
        expect(skill.getCooldownPercentage()).toBe(0);
    });

    test('should handle zero cooldown skills', () => {
        const instantSkill = new Skill('Instant', 10, 0, 'b');
        expect(instantSkill.canUse()).toBe(true);
        expect(instantSkill.getCooldownPercentage()).toBe(0);
    });

    test('should have correct animation types', () => {
        const shootSkill = new Skill('Shoot', 10, 1000, 'a', 'shoot');
        const slashSkill = new Skill('Slash', 15, 2000, 's', 'slash');
        const spellcastSkill = new Skill('Spellcast', 25, 5000, 'd', 'spellcast');
        
        expect(shootSkill.animationType).toBe('shoot');
        expect(slashSkill.animationType).toBe('slash');
        expect(spellcastSkill.animationType).toBe('spellcast');
    });

    test('should default to slash animation type', () => {
        const defaultSkill = new Skill('Default', 10, 1000, 'a');
        expect(defaultSkill.animationType).toBe('slash');
    });
}); 