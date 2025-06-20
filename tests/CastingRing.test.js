import { CastingRing } from '../src/game/graphics/CastingRing';

describe('CastingRing', () => {
    let mockScene;
    let mockGraphics;
    let castingRing;

    beforeEach(() => {
        mockGraphics = {
            setDepth: jest.fn().mockReturnThis(),
            setVisible: jest.fn().mockReturnThis(),
            clear: jest.fn(),
            lineStyle: jest.fn(),
            beginPath: jest.fn(),
            arc: jest.fn(),
            strokePath: jest.fn(),
            destroy: jest.fn()
        };

        mockScene = {
            add: {
                graphics: jest.fn().mockReturnValue(mockGraphics)
            }
        };

        castingRing = new CastingRing(mockScene);
    });

    test('should create casting ring with correct initial state', () => {
        expect(mockScene.add.graphics).toHaveBeenCalled();
        expect(mockGraphics.setDepth).toHaveBeenCalledWith(10);
        expect(mockGraphics.setVisible).toHaveBeenCalledWith(false);
    });

    test('should start casting with correct parameters', () => {
        const x = 100;
        const y = 200;
        const animationType = 'fireball';

        castingRing.startCasting(animationType, x, y);

        expect(mockGraphics.setVisible).toHaveBeenCalledWith(true);
        expect(mockGraphics.x).toBe(x);
        expect(mockGraphics.y).toBe(y);
    });

    test('should update progress correctly', () => {
        const x = 100;
        const y = 200;
        const progress = 0.5;

        castingRing.startCasting('fireball', x, y);
        castingRing.updateProgress(progress, x, y);

        expect(mockGraphics.clear).toHaveBeenCalled();
        expect(mockGraphics.lineStyle).toHaveBeenCalled();
        expect(mockGraphics.beginPath).toHaveBeenCalled();
        expect(mockGraphics.arc).toHaveBeenCalled();
        expect(mockGraphics.strokePath).toHaveBeenCalled();
    });

    test('should stop casting correctly', () => {
        castingRing.startCasting('fireball', 100, 200);
        castingRing.stopCasting();

        expect(mockGraphics.setVisible).toHaveBeenCalledWith(false);
    });

    test('should not update when not visible', () => {
        const x = 100;
        const y = 200;
        const progress = 0.5;

        castingRing.updateProgress(progress, x, y);

        expect(mockGraphics.clear).not.toHaveBeenCalled();
    });

    test('should destroy graphics on destroy', () => {
        castingRing.destroy();

        expect(mockGraphics.destroy).toHaveBeenCalled();
    });
}); 