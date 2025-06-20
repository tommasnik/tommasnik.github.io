import { InputManager } from '../src/game/input/KeyboardInputManager.js';
import { FightingGame } from '../src/game/logic/FightingGame.js';

describe('InputManager', () => {
    let inputManager;
    let gameLogic;
    let mockScene;

    beforeEach(() => {
        gameLogic = new FightingGame();
        mockScene = {
            input: {
                keyboard: {
                    on: jest.fn(),
                    off: jest.fn()
                }
            }
        };
        inputManager = new InputManager(mockScene, gameLogic);
    });

    test('should initialize skill key bindings correctly', () => {
        const skills = gameLogic.getSkills();
        expect(skills.length).toBeGreaterThan(0);
        
        skills.forEach(skill => {
            expect(skill.keyBinding).toBeDefined();
        });
    });

    test('should handle mouse skill start correctly', () => {
        const skill = gameLogic.getSkills()[0];
        const initialCastingState = skill.isCasting;
        
        inputManager.handleMouseSkillStart(skill);
        
        expect(skill.isCasting).toBe(!initialCastingState);
    });

    test('should handle mouse skill complete correctly', () => {
        const skill = gameLogic.getSkills()[0];
        const skillIndex = gameLogic.getSkills().indexOf(skill);
        gameLogic.startCastingSkill(skillIndex);
        const completeCastingSpy = jest.spyOn(gameLogic, 'completeCastingOnRelease');

        // Simulate casting progress is complete
        gameLogic.castingManager.getCastingSpells()[0].progress = 1;

        inputManager.handleMouseSkillComplete(skill);

        expect(completeCastingSpy).toHaveBeenCalledWith(skillIndex);
    });

    test('should handle mouse skill cancel correctly', () => {
        const skill = gameLogic.getSkills()[0];
        skill.startCasting();
        
        const cancelCastSpy = jest.spyOn(gameLogic, 'cancelCurrentCast');
        
        inputManager.handleMouseSkillCancel();
        
        expect(cancelCastSpy).toHaveBeenCalled();
    });

    test('should setup keyboard input handlers', () => {
        inputManager.setupInput();
        
        expect(mockScene.input.keyboard.on).toHaveBeenCalledWith('keydown', expect.any(Function));
        expect(mockScene.input.keyboard.on).toHaveBeenCalledWith('keyup', expect.any(Function));
    });

    test('should clean up resources on destroy', () => {
        inputManager.setupInput();
        inputManager.destroy();
        
        expect(mockScene.input.keyboard.off).toHaveBeenCalledWith('keydown');
        expect(mockScene.input.keyboard.off).toHaveBeenCalledWith('keyup');
    });
}); 