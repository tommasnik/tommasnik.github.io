import { Skill } from '../src/game/logic/Skill';

describe('Skill', () => {
    let skill;

    beforeEach(() => {
        skill = new Skill('TestSkill', 25, 1000, 'a', 'fireball');
    });

    test('should create skill with correct initial values', () => {
        expect(skill.name).toBe('TestSkill');
        expect(skill.damage).toBe(25);
        expect(skill.cooldown).toBe(1000);
        expect(skill.currentCooldown).toBe(0);
        expect(skill.keyBinding).toBe('a');
        expect(skill.animationType).toBe('fireball');
        expect(skill.skillType).toBe('offensive');
        expect(skill.targetType).toBe('single');
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
        const instantSkill = new Skill('Instant', 10, 0, 'b', 'lightning');
        expect(instantSkill.canUse()).toBe(true);
        expect(instantSkill.getCooldownPercentage()).toBe(0);
    });

    test('should have correct animation types', () => {
        const fireballSkill = new Skill('Fireball', 10, 1000, 'a', 'fireball');
        const lightningSkill = new Skill('Lightning', 15, 2000, 's', 'lightning');
        const iceSpikeSkill = new Skill('Ice Spike', 25, 5000, 'd', 'ice_spike');
        const shieldSkill = new Skill('Shield', 0, 4000, 'q', 'shield');
        const healSkill = new Skill('Heal', 0, 6000, 'w', 'heal');
        const meteorSkill = new Skill('Meteor', 35, 8000, 'f', 'meteor');
        
        expect(fireballSkill.animationType).toBe('fireball');
        expect(lightningSkill.animationType).toBe('lightning');
        expect(iceSpikeSkill.animationType).toBe('ice_spike');
        expect(shieldSkill.animationType).toBe('shield');
        expect(healSkill.animationType).toBe('heal');
        expect(meteorSkill.animationType).toBe('meteor');
    });

    test('should have correct skill types', () => {
        const offensiveSkill = new Skill('Fireball', 10, 1000, 'a', 'fireball', 'offensive');
        const defensiveSkill = new Skill('Shield', 0, 4000, 'q', 'shield', 'defensive');
        
        expect(offensiveSkill.skillType).toBe('offensive');
        expect(defensiveSkill.skillType).toBe('defensive');
    });

    test('should have correct target types', () => {
        const singleSkill = new Skill('Fireball', 10, 1000, 'a', 'fireball', 'offensive', 'single');
        const aoeSkill = new Skill('Meteor', 35, 8000, 'f', 'meteor', 'offensive', 'aoe');
        
        expect(singleSkill.targetType).toBe('single');
        expect(aoeSkill.targetType).toBe('aoe');
    });

    test('should have descriptions', () => {
        const skillWithDesc = new Skill('Fireball', 10, 1000, 'a', 'fireball', 'offensive', 'single', 'Launches a fiery projectile');
        expect(skillWithDesc.description).toBe('Launches a fiery projectile');
    });
}); 