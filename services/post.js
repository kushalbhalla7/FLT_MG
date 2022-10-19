const PostModel = require('../models/post');
const DatabaseService = require('../utils/dbService');

class Post {
    constructor(postDetails) {
        this.post = {
            description: postDetails.description,
            imgUrl: postDetails.imgUrl,
            creator: postDetails.creator,
        }
    }

    save() {
        return DatabaseService.insertOne(PostModel, this.post);
    }

    static findOne(postId, projection = {}) {
        return DatabaseService.findOne(PostModel, {_id: postId}, projection);
    }

    static find(userId, projection = {}) {
        return DatabaseService.find(PostModel, {creator: userId}, projection);
    }

    static updateOne(postId, data, projection = {}) {
        return DatabaseService.updateOne(PostModel, {_id: postId}, {$set: data}, projection);
    }

    static deleteOne(postId, projection = {}) {
        return DatabaseService.deleteOne(PostModel, {_id: postId}, projection);
    }

    static likePost(postId, userId, projection = {}) {
        return DatabaseService.updateOne(PostModel, {_id: postId}, {$push: {likes: userId}}, projection);
    }

    static unlike(postId, userId, projection = {}) {
        return DatabaseService.updateOne(PostModel, {_id: postId}, {$pull: {likes: userId}}, projection);
    }
}

module.exports = Post;