import db from '../utils/db';
import { PostModel, PostsQueryParamsModel, CreateUpdatePostModel } from '../models';


/**
 * Handles retrieval of all posts based on provided query parameters.
 * @param params Query parameters for filtering posts.
 * @returns An object containing an array of posts and the total count of posts.
 */
export const getAllPostsHandler = async (params: PostsQueryParamsModel): Promise<{ posts: PostModel[]; totalCount: number; }> =>  {
    const { pageIndex, pageSize, authors, categories } = params;

    const skip: number = pageIndex * pageSize;
    const parseAuthors = JSON.parse(authors as string);

    let authorsArr = parseAuthors.length ? parseAuthors : undefined;
    const parseCategories = JSON.parse(categories as string);
    let categoriesArr = parseCategories.length ? parseCategories : undefined;

    // Count only the posts that belong to the specified authors
    const totalCount: number = await db.post.count({
        where: {
            user: {
                id: { in: authorsArr },
            },
            categories: {
                some: {
                    id: { in: categoriesArr }
                }
            }
        }
    });

    // Retrieve posts based on parameters
    const posts = await db.post.findMany({
        where: {
            user: {
                id: { in: authorsArr },
            },
            categories: {
                some: {
                    id: { in: categoriesArr }
                }
            }
        },
        take: Number(pageSize),
        skip: skip,
        select: {
            id: true,
            title: true,
            description: true,
            content: true,
            picture: true,
            published: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
            categories: true,
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    role: true
                },
            },
        },
    });
    return { posts, totalCount } as { posts: PostModel[]; totalCount: number; };
};


/**
 * Retrieves a single post by its ID.
 * @param id The ID of the post to retrieve.
 * @returns The post object if found, otherwise null.
 */
export const getSinglePostHandler = async (id: number): Promise<any> => {
    return db.post.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            title: true,
            description: true,
            content: true,
            picture: true,
            published: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
            categories: true,
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    role: true
                },
            },
        },
    });
};

/**
 * Creates a new post.
 * @param post The post data to create.
 * @returns An object containing the total count of posts and the newly created post.
 */
export const createPostHandler = async (post: CreateUpdatePostModel): Promise<any> => {
    const { title, description, content, picture, published, userId, categories } = post;
    /** In this code, `categories.map(category => ({ id: category.id }))`
     * converts the array of `CategoriesModel` objects into an array of objects containing only category IDs,
     * which matches the expected type of `CategoryWhereUniqueInput`.*/
    try {
        const newPost = await db.post.create({
            data: {
                title,
                description,
                content,
                picture,
                published,
                userId,
                categories: {
                    connect: categories?.map(category => ({ id: category.id }))
                }
            },
            select: {
                id: true,
                title: true,
                description: true,
                content: true,
                picture: true,
                published: true,
                createdAt: true,
                updatedAt: true,
                userId: true,
                categories: true,
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        role: true
                    },
                },
            },
        });
        const totalCount = await db.post.count();
        return { totalCount, newPost };
    } catch (error: any) {
        throw new Error(`Error creating post: ${error.message}`);
    }
};

/**
 * Updates an existing post.
 * @param post The updated post data.
 * @param id The ID of the post to update.
 * @returns The updated post object.
 */
export const updatePostHandler = async (post: CreateUpdatePostModel, id: number
): Promise<any> => {
    const {title, description, content, picture, published, userId, includedCategories, excludedCategories} = post;
    return db.post.update({
        where: {
            id,
        },
        data: {
            title,
            description,
            content,
            picture,
            published,
            userId,
            categories: {
                connect: includedCategories,
                disconnect: excludedCategories
            }
        },
        select: {
            id: true,
            title: true,
            description: true,
            content: true,
            picture: true,
            published: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
            categories: true,
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    role: true
                },
            },
        },
    });
};

/**
 * Deletes a post by its ID.
 * @param id The ID of the post to delete.
 */
export const deletePostHandler = async (id: number): Promise<void> => {
    await db.post.delete({
        where: {
            id,
        },
    });
};
