Router.configure({
    layoutTemplate: "layout",
    notFoundTemplate: "notFound"
});

Router.route("/", {name: "description"});

Router.route("/overview", {name: "overview"});

Router.route("/form", {name: "form"});

Router.route("/submission/delete/:_id", {
    name: "deleteSubmission",
    data: function () {
        return Submissions.findOne(this.params._id);
    }
});

Router.route("/imprint", {name: "imprint"});

Router.route("/participation", {name: "participation"});

Router.route("/submitted", {name: "submissionFinished"});

Router.onBeforeAction(function() {
    if (!Meteor.user()) {
        this.render("accessDenied");
    } else {
        this.next();
    }
}, {only: ["form", "submissionFinished", "overview", "deleteSubmission"]});
