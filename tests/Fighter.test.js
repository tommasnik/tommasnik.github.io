import { Fighter } from '../src/game/logic/Fighter.js';

describe('Fighter', () => {
    let fighter;

    beforeEach(() => {
        fighter = new Fighter('TestFighter', 100, 200, 300);
    });

    test('should create fighter with correct initial values', () => {
        expect(fighter.name).toBe('TestFighter');
        expect(fighter.maxHealth).toBe(100);
        expect(fighter.currentHealth).toBe(100);
        expect(fighter.x).toBe(200);
        expect(fighter.y).toBe(300);
        expect(fighter.isAlive).toBe(true);
    });

    test('should take damage correctly', () => {
        const result = fighter.takeDamage(30);
        
        expect(fighter.currentHealth).toBe(70);
        expect(fighter.isAlive).toBe(true);
        expect(result).toBe(true);
    });

    test('should die when health reaches zero', () => {
        const result = fighter.takeDamage(100);
        
        expect(fighter.currentHealth).toBe(0);
        expect(fighter.isAlive).toBe(false);
        expect(result).toBe(false);
    });

    test('should not go below zero health', () => {
        fighter.takeDamage(150);
        
        expect(fighter.currentHealth).toBe(0);
        expect(fighter.isAlive).toBe(false);
    });

    test('should heal correctly', () => {
        fighter.takeDamage(50);
        fighter.heal(20);
        
        expect(fighter.currentHealth).toBe(70);
    });

    test('should not heal above max health', () => {
        fighter.takeDamage(20);
        fighter.heal(30);
        
        expect(fighter.currentHealth).toBe(100);
    });

    test('should move to new position', () => {
        fighter.moveTo(400, 500);
        
        expect(fighter.x).toBe(400);
        expect(fighter.y).toBe(500);
    });

    test('should calculate health percentage correctly', () => {
        expect(fighter.getHealthPercentage()).toBe(1.0);
        
        fighter.takeDamage(50);
        expect(fighter.getHealthPercentage()).toBe(0.5);
        
        fighter.takeDamage(50);
        expect(fighter.getHealthPercentage()).toBe(0.0);
    });
}); 