const db = require('../models/usersModel');
const bcrypt = require('bcrypt');
const usersController = require('./usersController');

jest.mock('../models/usersModel', () => ({
  query: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('usersController.signUp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if email or password is missing', async () => {
    const req = { body: { email: '', password: '' } };
    const res = { locals: {} };
    const next = jest.fn();

    await usersController.signUp(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('Email and Password required!') }));
  });

  it('should throw an error if user already exists', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        activity: {},
        city: 'City',
        zipCode: '12345',
        gender: 'Male',
        phone: '1234567890',
      },
    };
    const res = { locals: {} };
    const next = jest.fn();

    db.query.mockResolvedValueOnce({ rows: [{ email: 'test@example.com' }] });

    await usersController.signUp(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining('Account for email already exists') }));
  });

  it('should create a new user successfully', async () => {
    const req = {
      body: {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'John',
        activity: { Golf: 'Intermediate' },
        city: 'City',
        zipCode: '12345',
        gender: 'Male',
        phone: '1234567890',
      },
    };
    const res = { locals: {} };
    const next = jest.fn();

    db.query.mockResolvedValueOnce({ rows: [] });
    bcrypt.hash.mockResolvedValueOnce('hashedPassword');
    db.query.mockResolvedValueOnce({});
    db.query.mockResolvedValueOnce({ rows: [{ user_id: 1 }] });

    await usersController.signUp(req, res, next);

    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(res.locals.success).toBe('Account successfully created for newuser@example.com');
    expect(next).toHaveBeenCalled();
  });
});

describe('usersController.verifyUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return error if user is not found', async () => {
    const req = { body: { email: 'notfound@example.com', password: 'wrongpassword' } };
    const res = {};
    const next = jest.fn();

    db.query.mockResolvedValueOnce({ rows: [] });

    await usersController.verifyUser(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ err: 'User not found' }));
  });

  it('should return error if password does not match', async () => {
    const req = { body: { email: 'test@example.com', password: 'wrongpassword' } };
    const res = {};
    const next = jest.fn();

    db.query.mockResolvedValueOnce({ rows: [{ password: 'hashedpassword' }] });
    bcrypt.compare.mockResolvedValueOnce(false);

    await usersController.verifyUser(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ err: 'Password does not match' }));
  });

  it('should proceed to next middleware if password matches', async () => {
    const req = { body: { email: 'test@example.com', password: 'correctpassword' } };
    const res = {};
    const next = jest.fn();

    db.query.mockResolvedValueOnce({ rows: [{ password: 'hashedpassword' }] });
    bcrypt.compare.mockResolvedValueOnce(true);

    await usersController.verifyUser(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});

describe('usersController.getUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return user data if user exists', async () => {
    const req = { body: { email: 'test@example.com' } };
    const res = { locals: {} };
    const next = jest.fn();

    db.query.mockResolvedValueOnce({ rows: [{ firstname: 'John', email: 'test@example.com' }] });

    await usersController.getUsers(req, res, next);

    expect(res.locals.data).toEqual({ rows: [{ firstname: 'John', email: 'test@example.com' }] });
    expect(next).toHaveBeenCalled();
  });

  it('should return error if no users are found', async () => {
    const req = { body: { email: 'notfound@example.com' } };
    const res = {};
    const next = jest.fn();

    db.query.mockResolvedValueOnce({ rows: [] });

    await usersController.getUsers(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      log: 'user not found in getUsersFunction',
      status: 404,
      message: 'user not found',
    }));
  });
});

describe('usersController.deleteUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a user successfully', async () => {
    const req = { body: { email: 'test@example.com' } };
    const res = { locals: {} };
    const next = jest.fn();

    db.query.mockResolvedValueOnce({});

    await usersController.deleteUser(req, res, next);

    expect(res.locals.deleted).toBeDefined();
    expect(next).toHaveBeenCalled();
  });

  it('should handle database errors during user deletion', async () => {
    const req = { body: { email: 'test@example.com' } };
    const res = {};
    const next = jest.fn();

    db.query.mockRejectedValueOnce(new Error('Database error'));

    await usersController.deleteUser(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining('Database error') }));
  });
});

describe('usersController.getFilteredUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return filtered users based on activity, skill level, and gender', async () => {
    const req = {
      query: {
        activityName: 'Golf',
        skillLevel: 'Intermediate',
        gender: 'Male',
      },
    };
    const res = { locals: {} };
    const next = jest.fn();

    db.query.mockResolvedValueOnce({
      rows: [
        { firstname: 'John', activityname: 'Golf', skilllevel: 'Intermediate', gender: 'Male' },
      ],
    });

    await usersController.getFilteredUsers(req, res, next);

    expect(res.locals.data).toEqual([
      { firstname: 'John', activityname: 'Golf', skilllevel: 'Intermediate', gender: 'Male' },
    ]);
    expect(next).toHaveBeenCalled();
  });

  it('should handle errors if the query fails', async () => {
    const req = {
      query: {
        activityName: 'Golf',
        skillLevel: 'Intermediate',
        gender: 'Male',
      },
    };
    const res = { locals: {} };
    const next = jest.fn();

    db.query.mockRejectedValueOnce(new Error('Database error'));

    await usersController.getFilteredUsers(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining('Database error') }));
  });
});
