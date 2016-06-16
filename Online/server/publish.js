// Publish Submissions of user
Meteor.publish("submissions", function(limit) {
    if (!this.userId) {
        return this.ready();
    }

    var currentUserId = this.userId;
    return Submissions.find({"Submitter": currentUserId}, {
        limit: limit,
        sort: {"SubmittedAt": -1 }
    });
});
