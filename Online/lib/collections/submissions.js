Submissions = new Mongo.Collection("Submissions");

Meteor.methods({
    insertSubmission: function(submissionProps) {
        check(Meteor.userId(), String);
        check(submissionProps, {
            // Project Props
            "Project": String,
            "ProjectProps": {
                "ProjectDescription": String,

                //Demand Probs
                "ProjectDemand": {
                    "SpaceBundle": String,
                    "Electricity": String,
                    "ElectricityDemand": String,
                    "LogisticSlots": String,
                    "LogisticHelp": String
                }
            },
            //Submitter Probs
            "ProjectContact": {
                "FirstName": String,
                "SurName": String,
                "Contact": {
                    "Email": String,
                    "Tel": String,
                    "Addr": {
                        "Address": String,
                        "PostalCode": String,
                        "City": String
                    }
                },
                "ConditionOfParticipation": String
            },
            "Submitter": String,
            "SubmittedAt": Date
        });

        Submissions.insert(submissionProps);
    },
    deleteSubmission: function (submissionID) {
        check(Meteor.userId(), String);
        Submissions.remove(submissionID);
    }
});
