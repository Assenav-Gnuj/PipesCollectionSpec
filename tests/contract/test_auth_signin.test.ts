import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

// Contract test for POST /api/auth/signin endpoint
describe('POST /api/auth/signin - Contract Test', () => {
  beforeAll(async () => {
    // Test setup
  });

  afterAll(async () => {
    // Test cleanup
  });

  describe('Successful Authentication', () => {
    it('should return correct structure for valid credentials', async () => {
      const response = await fetch('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@cachimbosetabacos.com.br',
          password: 'validpassword123'
        })
      });
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      
      // Validate response structure
      expect(data).toHaveProperty('user');
      expect(data).toHaveProperty('session');
      
      // Validate user object
      expect(data.user).toHaveProperty('id');
      expect(data.user).toHaveProperty('email');
      expect(data.user).toHaveProperty('name');
      
      // Validate session object
      expect(data.session).toHaveProperty('token');
      expect(data.session).toHaveProperty('expires');
      
      // Validate data types
      expect(typeof data.user.id).toBe('string');
      expect(typeof data.user.email).toBe('string');
      expect(typeof data.user.name).toBe('string');
      expect(typeof data.session.token).toBe('string');
      expect(typeof data.session.expires).toBe('string');
      
      // Validate email format
      expect(data.user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      
      // Validate expires is a valid ISO date
      expect(new Date(data.session.expires).toISOString()).toBe(data.session.expires);
    });
  });

  describe('Authentication Errors', () => {
    it('should return 401 for invalid credentials', async () => {
      const response = await fetch('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'wrongpassword'
        })
      });
      
      expect(response.status).toBe(401);
      
      const error = await response.json();
      expect(error).toHaveProperty('error');
      expect(error).toHaveProperty('code');
      expect(error.code).toBe('AUTH_INVALID');
    });

    it('should return 400 for missing required fields', async () => {
      const response = await fetch('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@example.com'
          // missing password
        })
      });
      
      expect(response.status).toBe(400);
      
      const error = await response.json();
      expect(error).toHaveProperty('error');
      expect(error).toHaveProperty('code');
    });

    it('should return 400 for invalid email format', async () => {
      const response = await fetch('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'invalid-email',
          password: 'password123'
        })
      });
      
      expect(response.status).toBe(400);
      
      const error = await response.json();
      expect(error).toHaveProperty('error');
      expect(error).toHaveProperty('code');
    });
  });

  describe('Security Requirements', () => {
    it('should not return password or sensitive data', async () => {
      const response = await fetch('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@cachimbosetabacos.com.br',
          password: 'validpassword123'
        })
      });
      
      const data = await response.json();
      
      // Should not include password or password_hash
      expect(data.user).not.toHaveProperty('password');
      expect(data.user).not.toHaveProperty('password_hash');
      expect(data.user).not.toHaveProperty('passwordHash');
    });

    it('should respond within reasonable time', async () => {
      const startTime = Date.now();
      const response = await fetch('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@cachimbosetabacos.com.br',
          password: 'validpassword123'
        })
      });
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(3000); // Should respond within 3 seconds
    });
  });
});