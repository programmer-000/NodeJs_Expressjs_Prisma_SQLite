import express from 'express';
import type { Request, Response } from 'express';
import * as PostHandler from '../controllers/posts.conroller';
import { body, validationResult } from 'express-validator';
import * as fs from 'fs';
import * as UserHandler from '../controllers/users.conroller';
import { PostsQueryParamsModel } from '../models';
export const postsRouter = express.Router();


/**
 GET: List of all POSTS
 */
postsRouter.get('/', async (request: Request, response: Response) => {
    try {
        if(!request.query.pageIndex || !request.query.pageSize || !request.query.authors || !request.query.categories) {
            return response.status(400).json('pageIndex and pageSize are required');
        }
        const params: PostsQueryParamsModel = {
            pageIndex: Number(request.query.pageIndex),
            pageSize: Number(request.query.pageSize),
            authors: String(request.query.authors),
            categories: String(request.query.categories)
        };

        const posts = await PostHandler.getAllPostsHandler(params);
        return response.status(200).json(posts);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});


/**
 GET: A single POST by ID
 */
postsRouter.get('/:id', async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        const post = await PostHandler.getSinglePostHandler(id);
        if (post) {
            return response.status(200).json(post);
        }
        return response.status(404).json('Post could not be found');
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});


/**
 POST: Create a Post
 */
postsRouter.post(
    '/',
    // body("title").isString(),
    // body("description").isString(),
    // body("userId").isInt(),
    // body("published").isBoolean(),
    async (request: Request, response: Response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({errors: errors.array()});
        }
        try {
            const post = JSON.parse(request.body.post_params);
            const existingUser = await UserHandler.findUserById(post.userId);

            if (!existingUser) {
                return response.status(401).json({message: `No such user exists`})
            }

            let filename = '';
            if (request.file?.filename) {
                filename = `http://localhost:5000/src/uploads/${request.file?.filename}`;
            } else {
                filename = '';
            }
            post.picture = filename;
            const newPost = await PostHandler.createPostHandler(post);
            return response.status(201).json(newPost);
        } catch (error: any) {
            return response.status(500).json(error.message);
        }
    }
);


/**
 PUT: Update POST
 */
postsRouter.put(
    '/:id',
    // body('title').isString(),
    // body('description').isString(),
    // body('userId').isInt(),
    // body('published').isBoolean(),
    async (request: Request, response: Response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({errors: errors.array()});
        }
        const id: number = parseInt(request.params.id, 10);
        try {
            const post = JSON.parse(request.body.post_params);
            const pictureOrUrl = JSON.parse(request.body.pictureOrUrl);
            const previousPictureUrl = JSON.parse(request.body.previousPictureUrl);

            let pathRemovePicture ='';
            if (previousPictureUrl !== null) {
                pathRemovePicture = previousPictureUrl.replace('http://localhost:5000/', '');
            } else {
                pathRemovePicture ='';
            }
            // const pathRemovePicture = previousPictureUrl.replace('http://localhost:5000/', '');

            /** adding, replacing and deleting photos in the database and folder (uploads) */
            let fileUrl = '';
            if (!request.file?.filename) {
                console.log('updating a post without a picture and deleting a picture')
                if (pictureOrUrl) {
                    fileUrl = previousPictureUrl;
                    console.log('update a picture path in base')
                } else {
                    fileUrl = '';
                    console.log('deleting a picture path in base')
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
                console.log('deleting a picture path in base')
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

                console.log('first image upload or replacement')
                fileUrl = `http://localhost:5000/src/uploads/${request.file?.filename}`;

            }

            post.picture = fileUrl;
            const updatedPost = await PostHandler.updatePostHandler(post, id);
            return response.status(201).json(updatedPost);
        } catch (error: any) {
            return response.status(500).json(error.message);
        }
    }
);


/**
 DELETE: Delete an POST based on the ID
 */
postsRouter.delete('/:id', async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        const previousPictureUrl = String(request.query.picture);
        const pathRemovePicture = previousPictureUrl.replace('http://localhost:5000/', '');

        /** deleting photos in the database and folder (uploads)*/
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

        await PostHandler.deletePostHandler(id);
        return response.status(204).json('Post was successfully deleted');
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});
