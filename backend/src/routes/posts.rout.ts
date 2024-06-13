import express from 'express';
import type { Request, Response } from 'express';
import * as PostHandler from '../controllers/posts.controller';
import { param } from 'express-validator';
import * as fs from 'fs';
import * as UserHandler from '../controllers/users.controller';
import { PostsQueryParamsModel } from '../models';
import {
    handleErrorsValidator,
    getPostsValidator,
    parsePostCreateParams, createPostValidator,
    parsePostUpdateParams, updatePostValidator
} from '../validators';

export const postsRouter = express.Router();

const BASE_URL = process.env.BASE_URL as string;

/**
 GET: A single POST by ID
 */
postsRouter.get(
    '/:id',
    param('id').isInt().withMessage('ID must be an integer'),
    handleErrorsValidator,
    async (req: Request, res: Response) => {
        const id: number = parseInt(req.params.id, 10);
        try {
            const post = await PostHandler.getSinglePostHandler(id);
            if (post) {
                return res.status(200).json(post);
            }
            return res.status(404).json('Post could not be found');
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
);


/**
 GET: List of all POSTS
 */
postsRouter.get(
    '/',
    getPostsValidator,
    handleErrorsValidator,
    async (req: Request, res: Response) => {
        try {
            if (!req.query.pageIndex || !req.query.pageSize || !req.query.authors || !req.query.categories || !req.query.published) {
                return res.status(400).json('pageIndex and pageSize are required');
            }
            const params: PostsQueryParamsModel = {
                pageIndex: Number(req.query.pageIndex),
                pageSize: Number(req.query.pageSize),
                authors: String(req.query.authors),
                categories: String(req.query.categories),
                published: String(req.query.published)
            };

            const data = await PostHandler.getAllPostsHandler(params);
            return res.status(200).json(data);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
);


/**
 POST: Create a Post
 */
postsRouter.post(
    '/',
    parsePostCreateParams,
    createPostValidator,
    handleErrorsValidator,
    async (req: Request, res: Response) => {
        try {
            const post = req.body.post_params;
            const existingUser = await UserHandler.findUserById(post.userId);

            if (!existingUser) {
                return res.status(401).json({ message: `No such user exists` });
            }

            let filename = '';
            if (req.file?.filename) {
                filename = `${BASE_URL}/src/uploads/${req.file?.filename}`;
            }
            post.picture = filename;

            const data = await PostHandler.createPostHandler(post);
            return res.status(201).json({
                data,
                message: `Post created successfully`
            });
        } catch (error: any) {
            if (req.file?.filename) {
                const path = `src/uploads/${req.file.filename}`;
                fs.unlink(path, (err) => {
                    if (err) console.error(`Error deleting file: ${err.message}`);
                });
            }
            return res.status(500).json({ message: error.message });
        }
    }
);


/**
 PUT: Update POST
 */
postsRouter.put(
    '/:id',
    parsePostUpdateParams,
    updatePostValidator,
    handleErrorsValidator,
    async (req: Request, res: Response) => {
        const id: number = parseInt(req.params.id, 10);
        try {
            const post = req.body.post_params;
            const pictureOrUrl = req.body.pictureOrUrl;
            const previousPictureUrl = req.body.previousPictureUrl;

            let pathRemovePicture = '';
            if (previousPictureUrl !== null) {
                pathRemovePicture = previousPictureUrl.replace(`${BASE_URL}/`, '');
            } else {
                pathRemovePicture = '';
            }

            /** adding, replacing and deleting photos in the database and folder (uploads) */
            let fileUrl = '';
            if (!req.file?.filename) {
                console.log('updating a post without a picture and deleting a picture');
                if (pictureOrUrl) {
                    fileUrl = previousPictureUrl;
                    console.log('update a picture path in base');
                } else {
                    fileUrl = '';
                    console.log('deleting a picture path in base');
                    fs.stat(pathRemovePicture, (err, stats) => {
                        console.log('search for a deleted file in a folder (uploads)', stats);
                        if (err) {
                            return console.error(err);
                        }
                        fs.unlink(pathRemovePicture, err => {
                            if (err) return console.log(err);
                            console.log('file deleted successfully');
                        });
                    });
                }
            } else {
                console.log('deleting a picture path in base');
                fs.stat(pathRemovePicture, (err, stats) => {
                    console.log('search for a deleted file in a folder (uploads)', stats);
                    if (err) {
                        return console.error(err);
                    }
                    fs.unlink(pathRemovePicture, err => {
                        if (err) return console.log(err);
                        console.log('file deleted successfully');
                    });
                });

                console.log('first image upload or replacement');
                fileUrl = `${BASE_URL}/src/uploads/${req.file?.filename}`;
            }

            post.picture = fileUrl;
            const data = await PostHandler.updatePostHandler(post, id);
            return res.status(201).json({
                data,
                message: `Post updated successfully`
            });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
);

/**
 * DELETE: Delete a POST based on the ID
 */
postsRouter.delete(
    '/:id',
    param('id').isInt().withMessage('ID must be an integer'),
    handleErrorsValidator,
    async (req: Request, res: Response) => {
        const id: number = parseInt(req.params.id, 10);
        try {
            const previousPictureUrl = String(req.query.picture);
            const pathRemovePicture = previousPictureUrl.replace(`${BASE_URL}/`, '');

            await PostHandler.deletePostHandler(id);

            /** Deleting photos in the folder (uploads) only after the post is successfully deleted */
            fs.stat(pathRemovePicture, (err, stats) => {
                if (err) {
                    return console.error(`Error finding file: ${err.message}`);
                }
                fs.unlink(pathRemovePicture, err => {
                    if (err) return console.log(`Error deleting file: ${err.message}`);
                    console.log('File deleted successfully');
                });
            });

            return res.status(200).json({
                message: `Post was successfully deleted`
            });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
);
