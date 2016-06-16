import {Template} from 'meteor/templating';

import './main.html';

// AccountsUI settings
accountsUIBootstrap3.setLanguage("de");
accountsUIBootstrap3.logoutCallback = function(error) {
    if (error)
        console.log("Error:" + error);
    Router.go("/");
}

// Subscribe to Submission Collection
Meteor.subscribe("submissions", 20); //#FIXME if large number of submission per user is expected

// Global helper to prettify timestamp
Template.registerHelper("reformatDate", function(date) {
    return moment(date).format("DD-MM-YYYY, HH:mm");
});

// Helper for Submissions Table
Template.overview.helpers({
    submissions: function() {
        var docs = Submissions.find({},
            {sort: { "SubmittedAt": -1 },
            transform: function(submission) {
                // if description text is short
                if (submission.ProjectProps.ProjectDescription.length < 36 ) {
                    submission.ShortDescription = submission.ProjectProps.ProjectDescription;
                    return submission;
                };
                // if description text is long
                submission.ShortDescription = submission.ProjectProps.ProjectDescription.slice(0,30) + " [...]";
                return submission;}
            }).fetch();
        //console.log(docs);
        return docs;
    }
});

// Form validation and DB insert
Template.form.onRendered(() => {
    var form = $("#addProjectForm");
    form.validate({
        rules: {
            inputProjectName: {
                required: true,
                maxlength: 100
            },
            inputProjectDescription: {
                maxlength: 800
            },
            inputFirstName: {
                maxlength: 100
            },
            inputSurName: {
                required: true,
                maxlength: 100
            },
            inputEmail: {
                email: true
            },
            inputSpaceBundle: {
                required: true
            },
            inputElectricityDemand: {
                maxlength: 500
            },
            inputCity: {
                maxlength: 100
            },
            inputParticipationCondition: {
                required: true
            }
        },
        messages: {
            inputProjectName: {
                required: "<p class='text-danger'>Du musst einen Namen f&uuml;r das Projekt angeben!</p>",
                maxlength: "<p class='text-danger'>Maximales Zeichenlimit &uuml;berschritten!</p>"
            },
            inputProjectDescription: {
                maxlength: "<p class='text-danger'>Maximales Zeichenlimit &uuml;berschritten!</p>"
            },
            inputFirstName: {
                maxlength: "<p class='text-danger'>Maximales Zeichenlimit &uuml;berschritten!</p>"
            },
            inputSurName: {
                required: "<p class='text-danger'>Dein Name ist eine Pflichtangabe!</p>",
                maxlength: "<p class='text-danger'>Maximales Zeichenlimit &uuml;berschritten!</p>"
            },
            inputEmail: {
                email: "<p class='text-danger'>Gib einen g&uuml;ltige Mailadresse ein!</p>"
            },
            inputSpaceBundle: {
                required: "<p class='text-danger'>Pflichtangabe!</p>"
            },
            inputElectricityDemand: {
                maxlength: "<p class='text-danger'>Maximales Zeichenlimit &uuml;berschritten!</p>"
            },
            inputCity: {
                maxlength: "<p class='text-danger'>Maximales Zeichenlimit &uuml;berschritten!</p>"
            },
            inputParticipationCondition: {
                required: "<p class='text-danger'>Du musst den Teilnahmebedingungen zustimmen, um bei der Messe ausstellen zu k&ouml;nnen!</p>"
            }
        },
        submitHandler() {
            let submissionProps = {
                //Project Props
                "Project": $("#inputProjectName").val(),
                "ProjectProps": {
                    "ProjectDescription": $("#inputProjectDescription").val(),

                    //Demand Probs
                    "ProjectDemand": {
                        "SpaceBundle": $("input[name='inputSpaceBundle']:checked").val(),
                        "Electricity": $("#inputElectricity").val(),
                        "ElectricityDemand": $("#inputElectricityDemand").val(),
                        "LogisticSlots": $("#inputLogisticsSlots").val(),
                        "LogisticHelp": $("#inputLogisticsHelp").val()
                    }
                },
                //Submitter Probs
                "ProjectContact": {
                    "FirstName": $("#inputFirstName").val(),
                    "SurName": $("#inputSurName").val(),
                    "Contact": {
                        "Email": $("#inputEmail").val(),
                        "Tel": $("#inputTel").val(),
                        "Addr": {
                            "Address": $("#inputAddress").val(),
                            "PostalCode": $("#inputPostalCode").val(),
                            "City": $("#inputCity").val()
                        }
                    },
                    "ConditionOfParticipation": ($("#inputParticipationCondition").val() === "on") ? "yes" : "no"
                },
                "Submitter": Meteor.userId(),
                "SubmittedAt": new Date()
            };

            //console.log(submissionProps);

            //DB insert
            Meteor.call("insertSubmission", submissionProps, function(error, result) {
                if (error) {
                    return alert(error.reason);
                }
            });

            Router.go("submissionFinished");
        }
    });
});

// Delete Submission Event
Template.deleteSubmission.events({
    "click .confirmDelete": function (e) {
        e.preventDefault();

        Meteor.call("deleteSubmission", this._id, function (error, result) {
            if (error) {
                return alert(error.reason);
            };

            Router.go("overview");
        });
    }
});
