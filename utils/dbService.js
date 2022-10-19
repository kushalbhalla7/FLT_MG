class DatabaseService {
    static insertOne(model, data) {
        return model(data).save();
    }

    static findOne(model, query, projection) {
        return model.findOne(
            query,
            projection,
        );
    }

    static find(model, query, projection) {
        return model.find(
            query,
            projection
        );
    }

    static updateOne(model, query, data, projection) {
        return model.findOneAndUpdate(
            query,
            data,
            { fields: projection, new: true}
        );
    }

    static deleteOne(model, query, projection) {
        return model.findOneAndDelete(
            query,
            projection,
        );
    }
}

module.exports = DatabaseService