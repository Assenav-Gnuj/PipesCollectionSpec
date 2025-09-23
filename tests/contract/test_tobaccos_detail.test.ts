import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

// Contract test for GET /api/tobaccos/[id] endpoint
describe('GET /api/tobaccos/[id] - Contract Test', () => {
  let testTobaccoId: string;

  beforeAll(async () => {
    // In a real scenario, we would set up test data
    testTobaccoId = 'test-tobacco-id';
  });

  afterAll(async () => {
    // Test cleanup
  });

  describe('Response Structure', () => {
    it('should return correct structure for single tobacco detail', async () => {
      // This test will fail until the endpoint is implemented
      const response = await fetch(`http://localhost:3000/api/tobaccos/${testTobaccoId}`);
      
      expect(response.status).toBe(200);
      
      const tobacco = await response.json();
      
      // Validate main tobacco properties
      expect(tobacco).toHaveProperty('id');
      expect(tobacco).toHaveProperty('name');
      expect(tobacco).toHaveProperty('brand');
      expect(tobacco).toHaveProperty('blend_type');
      expect(tobacco).toHaveProperty('contents');
      expect(tobacco).toHaveProperty('cut');
      expect(tobacco).toHaveProperty('strength');
      expect(tobacco).toHaveProperty('room_note');
      expect(tobacco).toHaveProperty('taste');
      expect(tobacco).toHaveProperty('observations');
      expect(tobacco).toHaveProperty('images');
      expect(tobacco).toHaveProperty('average_rating');
      expect(tobacco).toHaveProperty('rating_count');
      expect(tobacco).toHaveProperty('created_at');
      
      // Validate images array structure
      expect(Array.isArray(tobacco.images)).toBe(true);
      
      if (tobacco.images.length > 0) {
        const image = tobacco.images[0];
        expect(image).toHaveProperty('id');
        expect(image).toHaveProperty('filename');
        expect(image).toHaveProperty('alt_text');
        expect(image).toHaveProperty('is_featured');
        expect(image).toHaveProperty('sort_order');
      }
    });

    it('should return 404 for non-existent tobacco', async () => {
      const response = await fetch('http://localhost:3000/api/tobaccos/non-existent-id');
      expect(response.status).toBe(404);
      
      const error = await response.json();
      expect(error).toHaveProperty('error');
      expect(error).toHaveProperty('code');
      expect(error.code).toBe('TOBACCO_NOT_FOUND');
    });
  });

  describe('Data Types Validation', () => {
    it('should return correct data types for all fields', async () => {
      const response = await fetch(`http://localhost:3000/api/tobaccos/${testTobaccoId}`);
      expect(response.status).toBe(200);
      
      const tobacco = await response.json();
      
      // Validate string fields
      expect(typeof tobacco.id).toBe('string');
      expect(typeof tobacco.name).toBe('string');
      expect(typeof tobacco.brand).toBe('string');
      expect(typeof tobacco.blend_type).toBe('string');
      expect(typeof tobacco.contents).toBe('string');
      expect(typeof tobacco.cut).toBe('string');
      expect(typeof tobacco.created_at).toBe('string');
      
      // Validate numeric fields
      expect(typeof tobacco.strength).toBe('number');
      expect(typeof tobacco.room_note).toBe('number');
      expect(typeof tobacco.taste).toBe('number');
      expect(typeof tobacco.average_rating).toBe('number');
      expect(typeof tobacco.rating_count).toBe('number');
      
      // Validate constraints
      expect(tobacco.strength).toBeGreaterThanOrEqual(1);
      expect(tobacco.strength).toBeLessThanOrEqual(9);
      expect(tobacco.room_note).toBeGreaterThanOrEqual(1);
      expect(tobacco.room_note).toBeLessThanOrEqual(9);
      expect(tobacco.taste).toBeGreaterThanOrEqual(1);
      expect(tobacco.taste).toBeLessThanOrEqual(9);
      expect(tobacco.average_rating).toBeGreaterThanOrEqual(0);
      expect(tobacco.average_rating).toBeLessThanOrEqual(5);
    });
  });

  describe('Business Rules Validation', () => {
    it('should have exactly one featured image per tobacco', async () => {
      const response = await fetch(`http://localhost:3000/api/tobaccos/${testTobaccoId}`);
      const tobacco = await response.json();
      
      const featuredImages = tobacco.images.filter((img: any) => img.is_featured);
      expect(featuredImages.length).toBe(1);
    });

    it('should have maximum 5 images per tobacco', async () => {
      const response = await fetch(`http://localhost:3000/api/tobaccos/${testTobaccoId}`);
      const tobacco = await response.json();
      
      expect(tobacco.images.length).toBeLessThanOrEqual(5);
    });
  });
});