import express from 'express';
import type { Request, Response } from 'express';
import { body, validationResult, param } from 'express-validator';
import * as UserHandler from '../controllers/users.controller';
import fs from 'fs';
import bcrypt from 'bcrypt';
import * as AuthUserHandler from '../controllers/auth.controller';
import { createUserValidator, getUsersValidator, parseUserParams } from '../validators';

export const usersRouter = express.Router();

const BASE_URL = process.env.BASE_URL as string;


/**
 GET: all USERS
 */
usersRouter.get(
    '/',
    getUsersValidator,
    async (request: Request, response: Response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({errors: errors.array()});
        }
        const params = request.query;
        try {
            const data = await UserHandler.getAllUsersHandler(params);
            return response.status(200).json(data);
        } catch (error: any) {
            return response.status(500).json(error.message);
        }
    }
);


/**
 GET: List of all USERS
 */
usersRouter.get('/list_all_users', async (request: Request, response: Response) => {
    try {
        const users = await UserHandler.getListAllUsersHandler();
        return response.status(200).json(users);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});


/**
 GET: A single USER by ID
 */
usersRouter.get('/:id',
    param('id').isInt().withMessage('ID must be an integer'),
    async (request: Request, response: Response) => {
        const id: number = parseInt(request.params.id, 10);
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({errors: errors.array()});
        }
        try {
            const user = await UserHandler.getUserHandler(id);
            if (user) {
                return response.status(200).json(user);
            }
            return response.status(404).json('User could not be found');
        } catch (error: any) {
            return response.status(500).json(error.message);
        }
    }
);


/**
 * POST: Create User
 */
usersRouter.post(
    '/',
    parseUserParams,
    createUserValidator,
    async (req: Request, res: Response) => {
        try {
            const user = req.body.user_params;
            const existingUser = await AuthUserHandler.findUserByEmail(user.email);
            if (existingUser) {
                return res.status(409).json({ message: 'Email already in use' });
            }

            const hashPassword = bcrypt.hashSync(user.password, 7);
            let filename = '';

            if (req.file?.filename) {
                filename = `${BASE_URL}/src/uploads/${req.file?.filename}`;
            } else {
                filename = '';
            }

            user.password = hashPassword;
            user.avatar = filename;

            const data = await UserHandler.createUserHandler(user);
            return res.status(201).json({
                data,
                message: 'User created successfully'
            });
        } catch (error: any) {
            // Delete the uploaded file if an error occurs
            if (req.file?.filename) {
                const avatarPath = `src/uploads/${req.file.filename}`;
                fs.stat(avatarPath, (err, stats) => {
                    if (err) {
                        console.error('Error checking avatar file:', err);
                    } else {
                        fs.unlink(avatarPath, (err) => {
                            if (err) console.error('Error deleting avatar file:', err);
                            else console.log('Avatar file deleted successfully');
                        });
                    }
                });
            }
            return res.status(500).json(error.message);
        }
    }
);


/**
 PUT: Updating USER
 */
usersRouter.put(
    '/:id',
    // body("firstName").isString(),
    // body("lastName").isString(),
    // body("email").isString(),
    async (request: Request, response: Response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({errors: errors.array()});
        }
        const id: number = parseInt(request.params.id, 10);
        try {
            const user = JSON.parse(request.body.user_params);
            const imageOrUrl = JSON.parse(request.body.imageOrUrl);
            const previousImageUrl = JSON.parse(request.body.previousImageUrl);

            let pathRemoveImage = '';
            if (previousImageUrl !== null) {
                pathRemoveImage = previousImageUrl.replace(`${BASE_URL}/`, '');
            } else {
                pathRemoveImage = '';
            }

            /** Adding, replacing and deleting photos in the database and folder (uploads) */
            let fileUrl = '';
            if (!request.file?.filename) {
                console.log('updating a user without a image and deleting a image')
                if (imageOrUrl) {
                    fileUrl = previousImageUrl;
                    console.log('update a image path in base')
                } else {
                    fileUrl = '';
                    console.log('deleting a image path in base')
                    fs.stat(pathRemoveImage, (err, stats) => {
                        console.log('search for a deleted file in a folder (uploads)', stats);
                        if (err) {
                            return console.error(err);
                        }
                        fs.unlink(pathRemoveImage, err => {
                            if (err) return console.log(err);
                            console.log('file deleted successfully');
                        });
                    });
                }
            } else {
                console.log('deleting a image path in base')
                fs.stat(pathRemoveImage, (err, stats) => {
                    console.log('search for a deleted file in a folder (uploads)', stats);
                    if (err) {
                        return console.error(err);
                    }
                    fs.unlink(pathRemoveImage, err => {
                        if (err) return console.log(err);
                        console.log('file deleted successfully');
                    });
                });

                console.log('first image upload or replacement')
                fileUrl = `${BASE_URL}/src/uploads/${request.file?.filename}`;
            }

            user.avatar = fileUrl;

            const updatedUser = await UserHandler.updateUserHandler(user, id);
            return response.status(200).json({
                data: updatedUser,
                message: `User updated`
            });
        } catch (error: any) {
            return response.status(500).json(error.message);
        }
    }
);


/**
 PUT: Updating Password USER
 */
usersRouter.put(
    '/update_password/:id',
    // body("firstName").isString(),
    // body("lastName").isString(),
    // body("email").isString(),
    async (request: Request, response: Response) => {
        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return response.status(400).json({errors: errors.array()});
        }
        const id: number = parseInt(request.params.id, 10);
        try {
            const hashPassword = bcrypt.hashSync(request.body.password, 7);
            const newUserPassword: any = {password: hashPassword};
            const date = await UserHandler.updateUserPasswordHandler(newUserPassword, id);
            return response.status(200).json({
                data: date,
                message: `User password updated`
            });
        } catch (error: any) {
            return response.status(500).json(error.message);
        }
    }
);


/**
 * DELETE: Delete a USER based on the ID
 */
usersRouter.delete('/:id', async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        const previousAvatarUrl = String(request.query.avatar);
        const pathRemovePicture = previousAvatarUrl.replace(`${BASE_URL}/`, '');

        const result = await UserHandler.deleteUserHandler(id);

        if (!result.success) {
            return response.status(409).json({ message: result.message });
        }

        // Delete the user's avatar if the user was successfully deleted
        if (pathRemovePicture) {
            fs.stat(pathRemovePicture, (err, stats) => {
                if (!err && stats) {
                    fs.unlink(pathRemovePicture, err => {
                        if (err) console.error('Error deleting avatar:', err);
                        else console.log('Avatar file deleted successfully');
                    });
                }
            });
        }

        return response.status(200).json({
            message: result.message,
        });
    } catch (error: any) {
        return response.status(500).json({ message: error.message });
    }
});
