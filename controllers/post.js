const httpStatus = require('http-status');
const errors = require('../utils/error');
const consents = require('../utils/consents');
const { response } = require('../utils/response');
const PostService = require('../services/post');
const { clearImage } = require('../utils/helper');

exports.addPost = async (req, res) => {
    const postData = req.body; 

    try {
        if (!req.file) {
            const error = errors.BAD_REQUEST;
            error.message = consents.FILE_NOT_FOUND;
            throw error;
        }

        const imgUrl = req.file.path;
        const post = new PostService({
            description: postData.description,
            imgUrl: imgUrl,
            creator: req._id
        });
        const postCreated = await post.save();

        const result = response(
            true,
            httpStatus.OK,
            '',
            consents.POST_CREATE,
            {
                _id: postCreated._id
            },
        );
        res.status(httpStatus.OK).json(result);
    } catch (error) {
        const result = response(
            true,
            null,
            error.status,
            {
                errCode: error.status || httpStatus.INTERNAL_SERVER_ERROR,
                errMsg: error.message || consents.INTERNAL_SERVER_ERROR,
            },
            '',
        );
        res.status(error.status || httpStatus.INTERNAL_SERVER_ERROR).json(result);
    }
}

exports.updatePost = async (req, res) => {
    const postData = req.body; 
    const postId = req.query.postId;

    try {
        const post = await PostService.findOne(postId, { _id: 1, creator: 1, imgUrl: 1});
        if (!post) {
            const error = errors.DATA_NOT_FOUND;
            error.message = consents.POST_NOT_FOUND;
            throw error;
        }
        if (post.creator.toString() !== req._id) {
            const error = errors.FORBIDDEN;
            error.message = 'You can not update this post';
            throw error;
        } 

        if (!req.file) {
            if (postData.imgUrl !== post.imgUrl) {
                postData.imgUrl = '';
            }
        } else {
            postData.imgUrl = req.file.path;
            if (postData.imgUrl !== post.imgUrl) {
                clearImage(post.imgUrl);
            }
        }
        await PostService.updateOne(postId, postData);
        
        const result = response(
            true,
            httpStatus.OK,
            '',
            'Post has been updated',
            '',
        );
        res.status(httpStatus.OK).json(result);
    } catch (error) {
        const result = response(
            true,
            null,
            error.status,
            {
                errCode: error.status || httpStatus.INTERNAL_SERVER_ERROR,
                errMsg: error.message || consents.INTERNAL_SERVER_ERROR,
            },
            '',
        );
        res.status(error.status || httpStatus.INTERNAL_SERVER_ERROR).json(result);
    }
}

exports.deletePost = async (req, res) => {
    const postId = req.query.postId;

    try {
        const post = await PostService.findOne(postId, { _id: 1, creator: 1, imgUrl: 1});
        if (!post) {
            const error = errors.DATA_NOT_FOUND;
            error.message = consents.POST_NOT_FOUND;
            throw error;
        }
        if (post.creator.toString() !== req._id) {
            const error = errors.FORBIDDEN;
            error.message = 'You can not update this post';
            throw error;
        } 

        await PostService.deleteOne(postId);
        clearImage(post.imgUrl);

        const result = response(
            true,
            httpStatus.OK,
            '',
            'Post has been deleted',
            '',
        );
        res.status(httpStatus.OK).json(result);
    } catch (error) {
        const result = response(
            true,
            null,
            error.status,
            {
                errCode: error.status || httpStatus.INTERNAL_SERVER_ERROR,
                errMsg: error.message || consents.INTERNAL_SERVER_ERROR,
            },
            '',
        );
        res.status(error.status || httpStatus.INTERNAL_SERVER_ERROR).json(result);
    }
}

exports.getPost = async (req, res) => {
    const postId = req.query.postId;

    try {
        const post = await PostService.findOne(postId, { _id: 1, creator: 1, imgUrl: 1});
        if (!post) {
            const error = errors.DATA_NOT_FOUND;
            error.message = consents.POST_NOT_FOUND;
            throw error;
        }

        const result = response(
            true,
            httpStatus.OK,
            '',
            'Post has been deleted',
            post,
        );
        res.status(httpStatus.OK).json(result);
    } catch (error) {
        const result = response(
            true,
            null,
            error.status,
            {
                errCode: error.status || httpStatus.INTERNAL_SERVER_ERROR,
                errMsg: error.message || consents.INTERNAL_SERVER_ERROR,
            },
            '',
        );
        res.status(error.status || httpStatus.INTERNAL_SERVER_ERROR).json(result);
    }
}

exports.getUserPosts = async (req, res) => {

    try {
        const posts = await PostService.find(req._id, { _id: 1, creator: 1, imgUrl: 1});

        const result = response(
            true,
            httpStatus.OK,
            '',
            'Users post has been fetched',
            posts,
        );
        res.status(httpStatus.OK).json(result);
    } catch (error) {
        const result = response(
            true,
            null,
            error.status,
            {
                errCode: error.status || httpStatus.INTERNAL_SERVER_ERROR,
                errMsg: error.message || consents.INTERNAL_SERVER_ERROR,
            },
            '',
        );
        res.status(error.status || httpStatus.INTERNAL_SERVER_ERROR).json(result);
    }
}
exports.likePost = async (req, res) => {
    const postId = req.query.postId;
    const userId = req.query.userId;

    try {
        const post = await PostService.findOne(postId, { _id: 1, creator: 1, imgUrl: 1, likes: 1});
        if (!post) {
            const error = errors.DATA_NOT_FOUND;
            error.message = consents.POST_NOT_FOUND;
            throw error;
        }
        if (!post.likes.includes(userId)) {
            await PostService.likePost({_id: postId}, userId);
        } else {
            await PostService.unlike({_id: postId}, userId);
        }

        const result = response(
            true,
            httpStatus.OK,
            '',
            'Post like has been updated',
            {},
        );
        res.status(httpStatus.OK).json(result);
    } catch (error) {
        const result = response(
            true,
            null,
            error.status,
            {
                errCode: error.status || httpStatus.INTERNAL_SERVER_ERROR,
                errMsg: error.message || consents.INTERNAL_SERVER_ERROR,
            },
            '',
        );
        res.status(error.status || httpStatus.INTERNAL_SERVER_ERROR).json(result);
    }
}
